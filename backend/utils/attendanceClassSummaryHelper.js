const Grade = require('../models/Grade');
const Student = require('../models/Student');
const StudentAttendance = require('../models/StudentAttendance');

const aggregateClassSummary = async (schoolId, campusId, targetDate, allowedGradeIds) => {
  const date = targetDate || new Date().toISOString().split('T')[0];
  const gradeFilter = { school_id: schoolId };
  if (campusId && campusId !== 'all') gradeFilter.campus_id = campusId;
  if (allowedGradeIds?.length) gradeFilter._id = { $in: allowedGradeIds };

  const grades = await Grade.find(gradeFilter).sort({ level: 1, name: 1 }).lean();
  const summaryRows = [];

  for (const g of grades) {
    const sections = Array.isArray(g.sections) && g.sections.length ? g.sections : ['A'];
    for (const sec of sections) {
      const studentFilter = { school_id: schoolId, current_grade: g._id, current_section: sec, status: { $ne: 'Inactive' } };
      if (campusId && campusId !== 'all') studentFilter.campus_id = campusId;

      const totalStudents = await Student.countDocuments(studentFilter);
      if (totalStudents === 0 && !allowedGradeIds) continue;

      const records = await StudentAttendance.find({ school_id: schoolId, grade_id: g._id, section: sec, date }).lean();
      const statusMap = { P: 0, A: 0, L: 0, LT: 0, HD: 0, Hol: 0 };
      records.forEach((r) => { if (statusMap[r.status] !== undefined) statusMap[r.status]++; });

      const unmarked = Math.max(0, totalStudents - records.length);
      const rate = totalStudents > 0 ? Math.round(((statusMap.P + statusMap.LT + statusMap.HD * 0.5) / totalStudents) * 100) : 0;

      summaryRows.push({
        grade_id: g._id, grade_name: g.name, section: sec, total_students: totalStudents,
        present: statusMap.P, absent: statusMap.A, leave: statusMap.L, late: statusMap.LT,
        half_day: statusMap.HD, unmarked, attendance_rate: rate
      });
    }
  }

  const kpis = summaryRows.reduce(
    (acc, row) => ({
      totalStudents: acc.totalStudents + row.total_students,
      present: acc.present + row.present,
      absent: acc.absent + row.absent,
      leave: acc.leave + row.leave,
      late: acc.late + row.late,
      unmarked: acc.unmarked + row.unmarked
    }),
    { totalStudents: 0, present: 0, absent: 0, leave: 0, late: 0, unmarked: 0 }
  );
  kpis.rate = kpis.totalStudents > 0 ? Math.round((kpis.present / kpis.totalStudents) * 100) : 0;

  return { date, rows: summaryRows, kpis };
};

module.exports = { aggregateClassSummary };
