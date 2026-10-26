const LmsItem = require('../models/LmsItem');
const Notification = require('../models/Notification');

const createLmsItem = async (req, res) => {
  try {
    const payload = { ...req.body, school_id: req.schoolId, created_by: req.user?.id };
    if (!payload.teacher_id && req.user?.id) payload.teacher_id = req.user.id;
    if (payload.campus_id === 'all') payload.campus_id = null;
    if (!payload.campus_id && req.user?.campus_id) payload.campus_id = req.user.campus_id;
    if (!payload.campus_id && req.headers['x-campus-id'] && req.headers['x-campus-id'] !== 'all') {
      payload.campus_id = req.headers['x-campus-id'];
    }

    if (payload.item_type === 'Live_Class') {
      if (!payload.meeting_room_code) {
        const uniqueSuffix = `${req.schoolId.toString().slice(-4)}-${Date.now().toString().slice(-6)}`;
        payload.meeting_room_code = `EliteEdu-${uniqueSuffix}`;
      }
      if (!payload.resource_url) {
        payload.resource_url = `https://meet.jit.si/${payload.meeting_room_code}`;
      }
    }

    const item = await LmsItem.create(payload);

    await Notification.create({
      school_id: req.schoolId,
      title: `New ${payload.item_type.replace('_', ' ')}: ${payload.title}`,
      message: `A new ${payload.item_type.toLowerCase()} has been published for your class.`,
      target_type: 'Student',
      target_id: null,
      priority: payload.item_type === 'Live_Class' ? 'High' : 'Medium',
      created_by: req.user?.id || null
    }).catch(() => {});

    const populated = await LmsItem.findById(item._id)
      .populate('grade_id', 'name code')
      .populate('subject_id', 'name code')
      .populate('chapter_id', 'title chapter_no')
      .populate('teacher_id', 'name email')
      .lean();

    res.status(201).json({ success: true, message: 'LMS item created successfully', item: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateLmsItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await LmsItem.findOneAndUpdate(
      { _id: id, school_id: req.schoolId },
      req.body,
      { new: true, runValidators: true, lean: true }
    )
      .populate('grade_id', 'name code')
      .populate('subject_id', 'name code')
      .populate('chapter_id', 'title chapter_no')
      .populate('teacher_id', 'name email');

    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.status(200).json({ success: true, message: 'LMS item updated successfully', item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteLmsItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await LmsItem.findOneAndDelete({ _id: id, school_id: req.schoolId });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.status(200).json({ success: true, message: 'LMS item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createLmsItem, updateLmsItem, deleteLmsItem };
