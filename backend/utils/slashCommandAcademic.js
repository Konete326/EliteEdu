const Student = require('../models/Student');
const StudentAttendance = require('../models/StudentAttendance');
const FeeInvoice = require('../models/FeeInvoice');
const Grade = require('../models/Grade');

const buildStudentCard = async (schoolId, query) => {
  const trimmed = (query || '').trim();
  if (!trimmed) throw new Error('Please specify a student GR# or Name');

  const student = await Student.findOne({
    school_id: schoolId,
    $or: [{ gr_number: trimmed }, { name: { $regex: trimmed, $options: 'i' } }]
  }).populate('current_grade', 'name');

  if (!student) throw new Error(`No student found matching "${trimmed}"`);

  const gradeName = student.current_grade?.name || 'Class';
  const totalAtt = await StudentAttendance.countDocuments({ school_id: schoolId, student_id: student._id });
  const presentAtt = await StudentAttendance.countDocuments({
    school_id: schoolId,
    student_id: student._id,
    status: { $in: ['P', 'LT', 'HD'] }
  });
  const attRate = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 100;

  const dues = await FeeInvoice.aggregate([
    { $match: { school_id: student.school_id, student_id: student._id, status: { $in: ['Unpaid', 'Partial', 'Overdue'] } } },
    { $group: { _id: null, total: { $sum: '$balance_due' } } }
  ]);
  const pending = dues[0]?.total || 0;

  return {
    card_type: 'Student_Lookup',
    head: {
      title: `Student: ${student.name}`,
      sub_title: `GR# ${student.gr_number} | ${gradeName}-${student.current_section || 'A'}`,
      status_badge: student.status,
      accent_color: '#2563eb'
    },
    fields: [
      { key: 'Student Name', value: student.name },
      { key: 'GR Number', value: student.gr_number },
      { key: 'Class / Sec', value: `${gradeName} - ${student.current_section || 'A'}` },
      { key: 'Father Phone', value: student.emergency_contact_no || student.contact_number || 'N/A' },
      { key: 'Attendance Rate', value: `${attRate}%` },
      { key: 'Pending Dues', value: `PKR ${pending.toLocaleString()}` }
    ]
  };
};

const buildAttendanceCard = async (schoolId, classQuery) => {
  const trimmed = (classQuery || '').trim();
  let gradeId = null;
  let gradeName = 'All Campus';

  if (trimmed) {
    const grade = await Grade.findOne({ school_id: schoolId, name: { $regex: trimmed, $options: 'i' } });
    if (grade) {
      gradeId = grade._id;
      gradeName = grade.name;
    }
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const stuQuery = { school_id: schoolId, status: 'Active' };
  if (gradeId) stuQuery.current_grade = gradeId;
  const total = await Student.countDocuments(stuQuery);

  const attFilter = { school_id: schoolId, date: todayStr };
  if (gradeId) attFilter.grade_id = gradeId;
  const records = await StudentAttendance.find(attFilter).select('status');

  const present = records.filter((r) => ['P', 'LT', 'HD'].includes(r.status)).length;
  const absent = records.filter((r) => r.status === 'A').length;
  const leave = records.filter((r) => r.status === 'L').length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  return {
    card_type: 'Attendance_Summary',
    head: {
      title: `Attendance: ${gradeName}`,
      sub_title: `Date: ${todayStr}`,
      status_badge: `${rate}% Present`,
      accent_color: '#0d9488'
    },
    fields: [
      { key: 'Date', value: todayStr },
      { key: 'Scope', value: gradeName },
      { key: 'Total Students', value: String(total) },
      { key: 'Present', value: String(present) },
      { key: 'Absent', value: String(absent) },
      { key: 'Leave', value: String(leave) },
      { key: 'Attendance Rate', value: `${rate}%` }
    ]
  };
};

module.exports = { buildStudentCard, buildAttendanceCard };
