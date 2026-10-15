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

const buildHomeworkSummary = (campusList, homeworkList = []) => {
  const total = homeworkList.length;
  const assigned = homeworkList.filter((h) => h.status === 'Assigned').length;
  const published = homeworkList.filter((h) => Boolean(h.is_published)).length;
  const unassigned = homeworkList.filter((h) => h.status === 'Unassigned').length;
  const unpublished = homeworkList.filter((h) => !h.is_published).length;

  const assignedCampusIds = new Set(
    homeworkList
      .filter((h) => h.status === 'Assigned' && h.campus_id)
      .map((h) => String(h.campus_id?._id || h.campus_id))
  );

  const campusesWithHomework = campusList.filter((c) => assignedCampusIds.has(String(c.id))).length;

  return {
    total,
    assigned,
    published,
    unassigned,
    unpublished,
    campusesAssigned: `${campusesWithHomework} / ${campusList.length}`,
    campusBreakdown: campusList.map((c) => {
      const cItems = homeworkList.filter((h) => String(h.campus_id?._id || h.campus_id) === String(c.id));
      const cTotal = cItems.length;
      const cAssigned = cItems.filter((h) => h.status === 'Assigned').length;
      const cPublished = cItems.filter((h) => Boolean(h.is_published)).length;
      const assignedPct = cTotal > 0 ? Math.round((cAssigned / cTotal) * 100) : 0;
      const publishedPct = cTotal > 0 ? Math.round((cPublished / cTotal) * 100) : 0;

      return {
        name: c.name,
        sub: c.sub,
        assigned: `${cAssigned}/${cTotal} (${assignedPct}%)`,
        published: `${cPublished}/${cTotal} (${publishedPct}%)`
      };
    })
  };
};

module.exports = {
  buildFinancialOverview,
  buildAttendanceSummary,
  buildHomeworkSummary
};
