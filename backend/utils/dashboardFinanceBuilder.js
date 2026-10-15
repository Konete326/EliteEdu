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

const buildAttendanceSummary = (campusList, students, teachers) => {
  const activeStudents = students.filter((s) => s.status === 'Active');
  const now = new Date();

  return {
    date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    students: {
      p: 0,
      a: 0,
      l: 0,
      late: 0,
      hd: 0,
      hol: 0,
      um: activeStudents.length,
      marked: `0/${activeStudents.length}`
    },
    staff: {
      p: 0,
      a: 0,
      l: 0,
      late: 0,
      hd: 0,
      hol: 0,
      um: teachers.length,
      marked: `0/${teachers.length}`
    },
    campusBreakdown: campusList.map((c) => {
      const cStudents = activeStudents.filter((s) => String(s.campus_id) === String(c.id)).length;
      const cTeachers = teachers.filter((t) => String(t.campus_id) === String(c.id)).length;
      return {
        name: c.name,
        sub: c.sub,
        students: { total: cStudents, p: 0, a: 0, l: 0, late: 0, hd: 0, hol: 0, um: cStudents },
        staff: { total: cTeachers, p: 0, a: 0, l: 0, late: 0, hd: 0, hol: 0, um: cTeachers }
      };
    })
  };
};

const buildHomeworkSummary = (campusList) => ({
  total: 0,
  assigned: 0,
  published: 0,
  unassigned: 0,
  unpublished: 0,
  campusesAssigned: `${campusList.length} / ${campusList.length}`,
  campusBreakdown: campusList.map((c) => ({
    name: c.name,
    sub: c.sub,
    assigned: '0/0 (0%)',
    published: '0/0 (0%)'
  }))
});

module.exports = {
  buildFinancialOverview,
  buildAttendanceSummary,
  buildHomeworkSummary
};
