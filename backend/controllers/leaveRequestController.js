const LeaveRequest = require('../models/LeaveRequest');
const { verifyClassAccess } = require('../utils/attendanceAccessHelper');
const { syncLeaveToAttendance } = require('../utils/leaveAttendanceSyncHelper');
const { buildLeaveFilter } = require('../utils/leaveFilterHelper');
const { notifyLeaveStatusChange, notifyNewLeaveRequest } = require('../utils/leaveNotificationHelper');

const getLeaveRequests = async (req, res) => {
  try {
    const filter = await buildLeaveFilter(req.user, req.query);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);

    const [rows, total, pending, approved, rejected] = await Promise.all([
      LeaveRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('student_id', 'name father_name gr_number current_grade current_section photo_url contact_number emergency_contact_no')
        .populate('staff_id', 'name designation bps_grade employee_code photo_url phone email')
        .populate('grade_id', 'name')
        .populate('reviewed_by', 'name')
        .populate('created_by', 'name')
        .lean(),
      LeaveRequest.countDocuments(filter),
      LeaveRequest.countDocuments({ ...filter, status: 'Pending' }),
      LeaveRequest.countDocuments({ ...filter, status: 'Approved' }),
      LeaveRequest.countDocuments({ ...filter, status: 'Rejected' })
    ]);

    res.json({ success: true, leaves: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 }, kpis: { total, pending, approved, rejected } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createLeaveRequest = async (req, res) => {
  try {
    const { applicant_type, student_id, grade_id, section, staff_id, leave_type, from_date, to_date, reason, attachment_url, campus_id, auto_approve } = req.body;
    if (!applicant_type || !from_date || !to_date || !reason) {
      return res.status(400).json({ success: false, message: 'Applicant type, dates, and reason are required' });
    }

    if (req.user.role === 'Teacher' && applicant_type === 'Student') {
      const hasAccess = await verifyClassAccess(req.user, grade_id);
      if (!hasAccess) return res.status(403).json({ success: false, message: 'Unauthorized for this class' });
    }

    const total_days = Math.max(1, Math.round((new Date(to_date) - new Date(from_date)) / 86400000) + 1);
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'SuperAdmin';
    const isTeacher = req.user.role === 'Teacher';
    const finalStatus = (isAdmin && auto_approve) || (isTeacher && applicant_type === 'Student') ? 'Approved' : 'Pending';

    const leave = await LeaveRequest.create({
      school_id: req.user.school_id,
      campus_id: campus_id || req.user.campus_id || null,
      applicant_type,
      student_id: applicant_type === 'Student' ? student_id : null,
      grade_id: applicant_type === 'Student' ? grade_id : null,
      section: section || 'A',
      staff_id: applicant_type === 'Staff' ? (isAdmin ? staff_id || req.user.id : req.user.id) : null,
      leave_type: leave_type || 'Sick Leave',
      from_date,
      to_date,
      total_days,
      reason,
      attachment_url: attachment_url || '',
      status: finalStatus,
      reviewed_by: finalStatus === 'Approved' ? req.user.id : null,
      reviewed_at: finalStatus === 'Approved' ? new Date() : null,
      created_by: req.user.id
    });

    if (finalStatus === 'Approved') await syncLeaveToAttendance(leave, req.user.id);
    await notifyNewLeaveRequest({ leave, creatorUser: req.user });
    res.status(201).json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { status, admin_remarks } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });

    const leave = await LeaveRequest.findOne({ _id: req.params.id, school_id: req.user.school_id });
    if (!leave) return res.status(404).json({ success: false, message: 'Leave request not found' });

    leave.status = status;
    leave.admin_remarks = admin_remarks || '';
    leave.reviewed_by = req.user.id;
    leave.reviewed_at = new Date();
    await leave.save();

    if (status === 'Approved') await syncLeaveToAttendance(leave, req.user.id);
    await notifyLeaveStatusChange({ leave, status, adminRemarks: admin_remarks, reviewerId: req.user.id });
    res.json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteLeaveRequest = async (req, res) => {
  try {
    const leave = await LeaveRequest.findOneAndDelete({ _id: req.params.id, school_id: req.user.school_id });
    if (!leave) return res.status(404).json({ success: false, message: 'Leave request not found' });
    res.json({ success: true, message: 'Leave request deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getLeaveRequests, createLeaveRequest, updateLeaveStatus, deleteLeaveRequest };
