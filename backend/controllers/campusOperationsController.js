const CampusOperationRecord = require('../models/CampusOperationRecord');
const CampusOperation = require('../models/CampusOperation');
const Notification = require('../models/Notification');

const getOperationsRecords = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(403).json({ message: 'School ID required' });
    const { category, record_type, status, search, student_id, campus_id } = req.query;
    const cat = category || record_type;
    const query = { school_id: schoolId };
    if (campus_id && campus_id !== 'all') query.campus_id = campus_id;
    if (cat && cat !== 'All') {
      const map = { Event: 'News_Circular', News_Feed: 'News_Circular', Parental_Consent: 'Consent_Letter' };
      query.category = map[cat] || cat;
    }
    if (status && status !== 'All') query.status = status;
    if (student_id) query.student_id = student_id;
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { details: { $regex: search, $options: 'i' } }];

    const records = await CampusOperationRecord.find(query)
      .populate('student_id', 'name roll_number admission_number')
      .populate('grade_id', 'name code').populate('staff_id', 'name email designation')
      .populate('created_by', 'name').sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: records });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const createOperationsRecord = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(403).json({ message: 'School ID required' });
    const {
      category, record_type, title, details, description, student_id,
      grade_id, staff_id, priority = 'Normal', item_location_or_fee = '',
      event_date, status = 'Open', resolution_notes = '', campus_id
    } = req.body;
    const cat = category || record_type || 'Complaint';
    const textDetails = details || description || '';
    if (!title || !cat) return res.status(400).json({ message: 'Title and category required' });

    const record = await CampusOperationRecord.create({
      school_id: schoolId, campus_id: campus_id || null, category: cat,
      title: String(title).trim(), details: String(textDetails).trim(),
      student_id: student_id || null, grade_id: grade_id || null, staff_id: staff_id || null,
      priority, item_location_or_fee: String(item_location_or_fee).trim(),
      event_date: event_date ? new Date(event_date) : new Date(),
      status, resolution_notes: String(resolution_notes).trim(), created_by: req.user?._id || null
    });
    await CampusOperation.create({
      school_id: schoolId, campus_id: campus_id || null, record_type: cat === 'Complaint' ? 'Complaint' : 'Event',
      title, description: textDetails, status, created_by: req.user?._id || null
    }).catch(() => null);

    if (cat === 'Complaint' || priority === 'Urgent') {
      await Notification.create({
        school_id: schoolId, campus_id: campus_id || null, title: `New ${cat}: ${title}`,
        message: textDetails ? textDetails.slice(0, 150) : title, type: 'Announcement',
        priority: priority === 'Urgent' ? 'Urgent' : 'Important', target_audience: 'Admins',
        action_url: '/admin/complaints', created_by: req.user?._id || null
      }).catch(() => {});
    }
    res.status(201).json({ success: true, data: record });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const updateOperationsRecord = async (req, res) => {
  try {
    const record = await CampusOperationRecord.findOneAndUpdate(
      { _id: req.params.id, school_id: req.user?.school_id }, { $set: req.body }, { new: true }
    );
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const updateOperationStatus = async (req, res) => {
  try {
    const { status, resolution_notes } = req.body;
    const record = await CampusOperationRecord.findOneAndUpdate(
      { _id: req.params.id, school_id: req.user?.school_id },
      { $set: { status, ...(resolution_notes ? { resolution_notes } : {}) } }, { new: true }
    );
    if (!record) return res.status(404).json({ message: 'Record not found' });
    if (status === 'Resolved' || status === 'Approved') {
      await Notification.create({
        school_id: req.user?.school_id, title: `${record.category} Resolved: ${record.title}`,
        message: resolution_notes || `Status marked as ${status}`, type: 'Announcement',
        target_audience: 'All', action_url: '/admin/complaints', created_by: req.user?._id || null
      }).catch(() => {});
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const deleteOperationsRecord = async (req, res) => {
  try {
    await CampusOperationRecord.findOneAndDelete({ _id: req.params.id, school_id: req.user?.school_id });
    await CampusOperation.findOneAndDelete({ _id: req.params.id, school_id: req.user?.school_id }).catch(() => null);
    res.status(200).json({ success: true, message: 'Record deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

module.exports = { getOperationsRecords, createOperationsRecord, updateOperationsRecord, updateOperationStatus, deleteOperationsRecord };
