const StudentAttendance = require('../models/StudentAttendance');
const StaffAttendance = require('../models/StaffAttendance');
const Notification = require('../models/Notification');

const generateDateRange = (fromStr, toStr) => {
  const dates = [];
  const curr = new Date(fromStr);
  const end = new Date(toStr);
  if (isNaN(curr.getTime()) || isNaN(end.getTime())) return [fromStr];
  while (curr <= end) {
    dates.push(curr.toISOString().split('T')[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates.length > 0 ? dates : [fromStr];
};

const syncLeaveToAttendance = async (leave, reviewerId) => {
  if (!leave || leave.status !== 'Approved') return;
  const dates = generateDateRange(leave.from_date, leave.to_date);
  const remarkText = `Approved Leave (${leave.leave_type}): ${leave.reason}`;

  if (leave.applicant_type === 'Student' && leave.student_id) {
    const ops = dates.map((date) => ({
      updateOne: {
        filter: { school_id: leave.school_id, student_id: leave.student_id, date },
        update: {
          $set: {
            campus_id: leave.campus_id,
            grade_id: leave.grade_id,
            section: leave.section || 'A',
            status: 'L',
            marked_via: 'Manual',
            remarks: remarkText,
            marked_by: reviewerId
          }
        },
        upsert: true
      }
    }));
    if (ops.length > 0) await StudentAttendance.bulkWrite(ops);
  } else if (leave.applicant_type === 'Staff' && leave.staff_id) {
    const ops = dates.map((date) => ({
      updateOne: {
        filter: { school_id: leave.school_id, staff_id: leave.staff_id, date },
        update: {
          $set: {
            campus_id: leave.campus_id,
            status: 'L',
            marked_via: 'Manual',
            remarks: remarkText,
            marked_by: reviewerId
          }
        },
        upsert: true
      }
    }));
    if (ops.length > 0) await StaffAttendance.bulkWrite(ops);
  }

  try {
    await Notification.create({
      school_id: leave.school_id,
      campus_id: leave.campus_id,
      title: `Leave ${leave.status}: ${leave.applicant_type}`,
      message: `${leave.leave_type} (${leave.from_date} to ${leave.to_date}) has been ${leave.status.toLowerCase()}.`,
      type: 'Attendance',
      priority: 'Important',
      target_audience: leave.applicant_type === 'Staff' ? 'Specific_User' : 'Teachers',
      target_user_id: leave.applicant_type === 'Staff' ? leave.staff_id : null,
      created_by: reviewerId
    });
  } catch {}
};

module.exports = { generateDateRange, syncLeaveToAttendance };
