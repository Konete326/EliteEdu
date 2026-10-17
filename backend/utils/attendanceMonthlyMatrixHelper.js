const Student = require('../models/Student');
const StudentAttendance = require('../models/StudentAttendance');
const User = require('../models/User');
const StaffAttendance = require('../models/StaffAttendance');

const getDaysInMonth = (monthStr) => {
  const [year, month] = (monthStr || new Date().toISOString().slice(0, 7)).split('-').map(Number);
  const totalDays = new Date(year, month, 0).getDate();
  const days = [];
  for (let d = 1; d <= totalDays; d++) {
    const dayStr = d < 10 ? `0${d}` : `${d}`;
    const mStr = month < 10 ? `0${month}` : `${month}`;
    days.push({ day: d, dayStr, date: `${year}-${mStr}-${dayStr}` });
  }
  return { year, month, totalDays, days };
};

const buildStudentMonthlyMatrix = async (schoolId, campusId, gradeId, section, monthStr, search) => {
  const { days } = getDaysInMonth(monthStr);
  const studentFilter = { school_id: schoolId, status: { $ne: 'Inactive' } };
  if (gradeId && gradeId !== 'all') studentFilter.current_grade = gradeId;
  if (section && section !== 'all') studentFilter.current_section = section;
  if (campusId && campusId !== 'all') studentFilter.campus_id = campusId;
  if (search) studentFilter.$or = [{ name: new RegExp(search, 'i') }, { gr_number: new RegExp(search, 'i') }];

  const students = await Student.find(studentFilter).select('_id name father_name gr_number current_grade current_section photo_url').sort({ gr_number: 1, name: 1 }).lean();
  const studentIds = students.map((s) => s._id);
  const startMonth = days[0].date;
  const endMonth = days[days.length - 1].date;

  const attendanceRecords = await StudentAttendance.find({ school_id: schoolId, student_id: { $in: studentIds }, date: { $gte: startMonth, $lte: endMonth } }).lean();
  const recordMap = {};
  attendanceRecords.forEach((r) => {
    const sId = String(r.student_id);
    if (!recordMap[sId]) recordMap[sId] = {};
    recordMap[sId][r.date.slice(-2)] = r.status;
  });

  const matrix = students.map((st) => {
    const sId = String(st._id);
    const dayMap = recordMap[sId] || {};
    let presentCount = 0, absentCount = 0, leaveCount = 0, lateCount = 0;
    days.forEach((d) => {
      const stCode = dayMap[d.dayStr];
      if (stCode === 'P') presentCount++;
      else if (stCode === 'A') absentCount++;
      else if (stCode === 'L') leaveCount++;
      else if (stCode === 'LT') lateCount++;
    });
    const markedDays = presentCount + absentCount + leaveCount + lateCount;
    const percentage = markedDays > 0 ? Math.round(((presentCount + lateCount) / markedDays) * 100) : 0;
    return { student: st, dayMap, presentCount, absentCount, leaveCount, lateCount, percentage, isLowAttendance: markedDays > 0 && percentage < 75 };
  });

  return { days, matrix };
};

const buildStaffMonthlyMatrix = async (schoolId, campusId, monthStr, designation, search, staffIdLimit) => {
  const { days } = getDaysInMonth(monthStr);
  const staffFilter = { school_id: schoolId, role: { $in: ['Teacher', 'Staff'] }, status: { $ne: 'Inactive' } };
  if (staffIdLimit) staffFilter._id = staffIdLimit;
  if (campusId && campusId !== 'all') staffFilter.campus_id = campusId;
  if (designation && designation !== 'all') staffFilter.designation = designation;
  if (search) staffFilter.$or = [{ name: new RegExp(search, 'i') }, { employee_code: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];

  const staffList = await User.find(staffFilter).select('_id name email designation bps_grade employee_code phone photo_url').sort({ name: 1 }).lean();
  const staffIds = staffList.map((s) => s._id);
  const startMonth = days[0].date;
  const endMonth = days[days.length - 1].date;

  const attendanceRecords = await StaffAttendance.find({ school_id: schoolId, staff_id: { $in: staffIds }, date: { $gte: startMonth, $lte: endMonth } }).lean();
  const recordMap = {};
  attendanceRecords.forEach((r) => {
    const sId = String(r.staff_id);
    if (!recordMap[sId]) recordMap[sId] = {};
    recordMap[sId][r.date.slice(-2)] = { status: r.status, in: r.check_in_time, out: r.check_out_time };
  });

  const matrix = staffList.map((st) => {
    const sId = String(st._id);
    const dayMap = recordMap[sId] || {};
    let presentCount = 0, absentCount = 0, leaveCount = 0, lateCount = 0;
    days.forEach((d) => {
      const code = dayMap[d.dayStr]?.status;
      if (code === 'P') presentCount++;
      else if (code === 'A') absentCount++;
      else if (code === 'L') leaveCount++;
      else if (code === 'LT') lateCount++;
    });
    const markedDays = presentCount + absentCount + leaveCount + lateCount;
    const percentage = markedDays > 0 ? Math.round(((presentCount + lateCount) / markedDays) * 100) : 0;
    return { staff: st, dayMap, presentCount, absentCount, leaveCount, lateCount, percentage };
  });

  return { days, matrix };
};

module.exports = { buildStudentMonthlyMatrix, buildStaffMonthlyMatrix };
