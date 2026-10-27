const { createSystemNotification } = require('./notificationDispatcher');
const Student = require('../models/Student');

const notifyLeaveStatusChange = async ({ leave, status, adminRemarks, reviewerId }) => {
  try {
    const recipientIds = new Set();
    if (leave.applicant_type === 'Staff' && leave.staff_id) {
      recipientIds.add(String(leave.staff_id));
    }
    if (leave.created_by) {
      recipientIds.add(String(leave.created_by));
    }

    let studentName = '';
    if (leave.applicant_type === 'Student' && leave.student_id) {
      try {
        const student = await Student.findById(leave.student_id).select('name').lean();
        if (student) studentName = student.name;
      } catch {}
    }

    const title = leave.applicant_type === 'Student'
      ? `Student Leave ${status}`
      : `Leave Request ${status}`;

    const remarks = adminRemarks ? ` Remarks: ${adminRemarks}` : '';
    const dateRange = leave.from_date === leave.to_date ? leave.from_date : `${leave.from_date} to ${leave.to_date}`;
    const message = leave.applicant_type === 'Student'
      ? `Leave request${studentName ? ` for ${studentName}` : ''} (${dateRange}) has been ${status.toLowerCase()}.${remarks}`
      : `Your ${leave.leave_type || 'leave'} application (${dateRange}) has been ${status.toLowerCase()}.${remarks}`;

    for (const targetUserId of recipientIds) {
      await createSystemNotification({
        school_id: leave.school_id,
        campus_id: leave.campus_id,
        title,
        message,
        type: 'Attendance',
        priority: status === 'Approved' ? 'Normal' : 'Important',
        target_audience: 'Specific_User',
        target_user_id: targetUserId,
        action_url: '/teacher/attendance?tab=leave',
        created_by: reviewerId
      });
    }
  } catch {}
};

const notifyNewLeaveRequest = async ({ leave, creatorUser }) => {
  try {
    if (leave.status !== 'Pending') return;
    const creatorName = creatorUser?.name || 'Staff';
    const dateRange = leave.from_date === leave.to_date ? leave.from_date : `${leave.from_date} to ${leave.to_date}`;
    await createSystemNotification({
      school_id: leave.school_id,
      campus_id: leave.campus_id,
      title: 'New Leave Request',
      message: `${creatorName} submitted a ${leave.leave_type || 'leave'} application (${dateRange}).`,
      type: 'Attendance',
      priority: 'Important',
      target_audience: 'Admins',
      action_url: '/admin/attendance/leave-request',
      created_by: creatorUser?._id || creatorUser?.id
    });
  } catch {}
};

module.exports = { notifyLeaveStatusChange, notifyNewLeaveRequest };
