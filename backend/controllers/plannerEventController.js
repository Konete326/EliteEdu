const AcademicPlanEvent = require('../models/AcademicPlanEvent');
const Notification = require('../models/Notification');

const getPlannersAndEvents = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(403).json({ message: 'School ID required' });
    const { record_type, grade_id, subject_id, teacher_id, status, search, campus_id, month } = req.query;
    const query = { school_id: schoolId };

    if (campus_id && campus_id !== 'all') query.campus_id = campus_id;
    if (record_type && record_type !== 'All') query.record_type = record_type;
    if (grade_id && grade_id !== 'All') query.grade_id = grade_id;
    if (subject_id && subject_id !== 'All') query.subject_id = subject_id;
    if (teacher_id && teacher_id !== 'All') query.teacher_id = teacher_id;
    if (status && status !== 'All') query.status = status;
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    if (month) {
      const [year, m] = month.split('-').map(Number);
      if (year && m) query.start_date = { $gte: new Date(year, m - 1, 1), $lte: new Date(year, m, 0, 23, 59, 59) };
    }

    const records = await AcademicPlanEvent.find(query)
      .populate('grade_id', 'name code').populate('subject_id', 'name code')
      .populate('teacher_id', 'name email designation').populate('created_by', 'name')
      .sort({ start_date: -1 }).lean();

    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPlannerOrEvent = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(403).json({ message: 'School ID required' });
    const {
      record_type = 'Lesson_Plan', title, description = '', start_date, end_date,
      grade_id, section = 'A', subject_id, teacher_id, learning_objectives = '',
      teaching_aids = '', target_audience = 'All', status = 'Planned', campus_id
    } = req.body;

    if (!title || !start_date) return res.status(400).json({ message: 'Title and start date are required' });

    const record = await AcademicPlanEvent.create({
      school_id: schoolId, campus_id: campus_id || null, record_type,
      title: String(title).trim(), description: String(description).trim(),
      start_date: new Date(start_date), end_date: end_date ? new Date(end_date) : new Date(start_date),
      grade_id: grade_id || null, section: section || 'A', subject_id: subject_id || null,
      teacher_id: teacher_id || req.user?._id || null, learning_objectives: String(learning_objectives).trim(),
      teaching_aids: String(teaching_aids).trim(), target_audience, status, created_by: req.user?._id || null
    });

    if (['School_Event', 'Holiday', 'PTM'].includes(record_type)) {
      await Notification.create({
        school_id: schoolId, campus_id: campus_id || null,
        title: `${record_type.replace('_', ' ')}: ${title}`,
        message: description ? description.slice(0, 160) : `Scheduled for ${new Date(start_date).toLocaleDateString()}`,
        type: 'Announcement', priority: record_type === 'Holiday' ? 'Important' : 'Normal',
        target_audience: target_audience || 'All', action_url: '/admin/events', created_by: req.user?._id || null
      }).catch(() => {});
    }

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePlannerOrEvent = async (req, res) => {
  try {
    const record = await AcademicPlanEvent.findOneAndUpdate(
      { _id: req.params.id, school_id: req.user?.school_id },
      { $set: req.body }, { new: true }
    );
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePlannerOrEvent = async (req, res) => {
  try {
    await AcademicPlanEvent.findOneAndDelete({ _id: req.params.id, school_id: req.user?.school_id });
    res.status(200).json({ success: true, message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPlannersAndEvents, createPlannerOrEvent, updatePlannerOrEvent, deletePlannerOrEvent };
