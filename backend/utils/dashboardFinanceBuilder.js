const buildFinancialOverview = (campusList, studentStats, feeStats, expenseStats) => {
  const feeTotals = feeStats?.totals || { todayCollection: 0, mtdCollection: 0, ytdCollection: 0 };
  const feeCampusMap = feeStats?.campusMap || new Map();
  const { todayExp = 0, mtdExp = 0, ytdExp = 0 } = expenseStats || {};
  const totalMonthlyFee = studentStats?.summary?.totalMonthlyFee || 0;

  const todayCollection = feeTotals.todayCollection || 0;
  const mtdCollection = feeTotals.mtdCollection || 0;
  const ytdCollection = feeTotals.ytdCollection || 0;

  const outstanding = Math.max(0, totalMonthlyFee - mtdCollection);
  const netMonthlyProfit = mtdCollection - mtdExp;

  return {
    todayCollection: `Rs. ${todayCollection.toLocaleString()}`,
    mtdCollection: `Rs. ${mtdCollection.toLocaleString()}`,
    ytdCollection: `Rs. ${ytdCollection.toLocaleString()}`,
    estMonthlyRevenue: `Rs. ${totalMonthlyFee.toLocaleString()}`,
    outstanding: `Rs. ${outstanding.toLocaleString()}`,
    profitThisMonth: `Rs. ${netMonthlyProfit.toLocaleString()}`,
    totalExpenseYear: `Rs. ${ytdExp.toLocaleString()}`,
    totalExpenseMonth: `Rs. ${mtdExp.toLocaleString()}`,
    expenseToday: `Rs. ${todayExp.toLocaleString()}`,
    campusBreakdown: campusList.map((c) => {
      const cStudent = studentStats?.campusMap?.get(String(c.id)) || { estMonthlyFee: 0 };
      const cEst = cStudent.estMonthlyFee || 0;
      const cFee = feeCampusMap.get(String(c.id)) || { today: 0, mtd: 0, ytd: 0 };
      const cToday = cFee.today || 0;
      const cMtd = cFee.mtd || 0;
      const cYtd = cFee.ytd || 0;
      return {
        name: c.name,
        sub: c.sub,
        today: `Rs. ${cToday.toLocaleString()}`,
        mtd: `Rs. ${cMtd.toLocaleString()}`,
        ytd: `Rs. ${cYtd.toLocaleString()}`,
        estMonthly: `Rs. ${cEst.toLocaleString()}`,
        outstanding: `Rs. ${Math.max(0, cEst - cMtd).toLocaleString()}`
      };
    })
  };
};

const countStatuses = (list) => {
  const map = { P: 'p', A: 'a', L: 'l', LT: 'late', HD: 'hd', Hol: 'hol' };
  const counts = { p: 0, a: 0, l: 0, late: 0, hd: 0, hol: 0 };
  list.forEach((rec) => {
    const k = map[rec.status];
    if (k) counts[k]++;
  });
  return { ...counts, marked: counts.p + counts.a + counts.l + counts.late + counts.hd + counts.hol };
};

const buildAttendanceSummary = (campusList, studentStats, teachers, todayAttendance = [], todayStaffAttendance = []) => {
  const activeStudentsCount = studentStats?.summary?.activeStudents || 0;
  const now = new Date();
  const stStats = countStatuses(todayAttendance);
  const staffStats = countStatuses(todayStaffAttendance);

  return {
    date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    students: { ...stStats, um: Math.max(0, activeStudentsCount - stStats.marked), marked: `${stStats.marked}/${activeStudentsCount}` },
    staff: { ...staffStats, um: Math.max(0, teachers.length - staffStats.marked), marked: `${staffStats.marked}/${teachers.length}` },
    campusBreakdown: campusList.map((c) => {
      const cStudents = studentStats?.campusMap?.get(String(c.id))?.activeStudents || 0;
      const cTeachers = teachers.filter((t) => String(t.campus_id) === String(c.id)).length;
      const cStAtt = countStatuses(todayAttendance.filter((rec) => String(rec.campus_id) === String(c.id)));
      const cStaffAtt = countStatuses(todayStaffAttendance.filter((rec) => String(rec.campus_id) === String(c.id)));
      return {
        name: c.name,
        sub: c.sub,
        students: { total: cStudents, ...cStAtt, um: Math.max(0, cStudents - cStAtt.marked) },
        staff: { total: cTeachers, ...cStaffAtt, um: Math.max(0, cTeachers - cStaffAtt.marked) }
      };
    })
  };
};

const { buildHomeworkSummary } = require('./dashboardHomeworkBuilder');

module.exports = {
  buildFinancialOverview,
  buildAttendanceSummary,
  buildHomeworkSummary
};
