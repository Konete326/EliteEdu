const buildFinancialOverview = (campusList, students) => {
  const activeStudents = students.filter((s) => s.status === 'Active');
  const totalMonthlyFee = activeStudents.reduce(
    (acc, s) => acc + Math.max(0, Number(s.monthly_fee || 0) - Number(s.discount || 0)),
    0
  );

  return {
    todayCollection: 'Rs. 0',
    mtdCollection: `Rs. ${totalMonthlyFee.toLocaleString()}`,
    ytdCollection: `Rs. ${totalMonthlyFee.toLocaleString()}`,
    estMonthlyRevenue: `Rs. ${totalMonthlyFee.toLocaleString()}`,
    outstanding: 'Rs. 0',
    profitThisMonth: `Rs. ${totalMonthlyFee.toLocaleString()}`,
    totalExpenseYear: 'Rs. 0',
    totalExpenseMonth: 'Rs. 0',
    expenseToday: 'Rs. 0',
    campusBreakdown: campusList.map((c) => {
      const cFee = activeStudents
        .filter((s) => String(s.campus_id) === String(c.id))
        .reduce((acc, s) => acc + Math.max(0, Number(s.monthly_fee || 0) - Number(s.discount || 0)), 0);
      return {
        name: c.name,
        sub: c.sub,
        today: 'Rs. 0',
        mtd: `Rs. ${cFee.toLocaleString()}`,
        ytd: `Rs. ${cFee.toLocaleString()}`,
        estMonthly: `Rs. ${cFee.toLocaleString()}`,
        outstanding: 'Rs. 0'
      };
    })
  };
};

const countStatuses = (list) => {
  const counts = { p: 0, a: 0, l: 0, late: 0, hd: 0, hol: 0 };
  list.forEach((rec) => {
    if (rec.status === 'P') counts.p++;
    else if (rec.status === 'A') counts.a++;
    else if (rec.status === 'L') counts.l++;
    else if (rec.status === 'LT') counts.late++;
    else if (rec.status === 'HD') counts.hd++;
    else if (rec.status === 'Hol') counts.hol++;
  });
  const marked = counts.p + counts.a + counts.l + counts.late + counts.hd + counts.hol;
  return { ...counts, marked };
};

const buildAttendanceSummary = (campusList, students, teachers, todayAttendance = [], todayStaffAttendance = []) => {
  const activeStudents = students.filter((s) => s.status === 'Active');
  const now = new Date();
  const stStats = countStatuses(todayAttendance);
  const staffStats = countStatuses(todayStaffAttendance);

  return {
    date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    students: { ...stStats, um: Math.max(0, activeStudents.length - stStats.marked), marked: `${stStats.marked}/${activeStudents.length}` },
    staff: { ...staffStats, um: Math.max(0, teachers.length - staffStats.marked), marked: `${staffStats.marked}/${teachers.length}` },
    campusBreakdown: campusList.map((c) => {
      const cStudents = activeStudents.filter((s) => String(s.campus_id) === String(c.id)).length;
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

const buildHomeworkSummary = (campusList, homeworkList = []) => {
  const total = homeworkList.length;
  const published = homeworkList.filter((h) => h.is_published).length;
  const pending = total - published;

  return {
    total,
    published,
    pending,
    campusBreakdown: campusList.map((c) => {
      const cTotal = homeworkList.filter((h) => String(h.campus_id) === String(c.id)).length;
      const cPublished = homeworkList.filter((h) => String(h.campus_id) === String(c.id) && h.is_published).length;
      return {
        name: c.name,
        sub: c.sub,
        total: cTotal,
        published: cPublished,
        pending: cTotal - cPublished
      };
    })
  };
};

module.exports = {
  buildFinancialOverview,
  buildAttendanceSummary,
  buildHomeworkSummary
};
