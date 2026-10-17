const buildFinancialOverview = (campusList, students, payments = []) => {
  const activeStudents = students.filter((s) => s.status === 'Active');
  const totalMonthlyFee = activeStudents.reduce((acc, s) => acc + Math.max(0, Number(s.monthly_fee || 0) - Number(s.discount || 0)), 0);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const sumPaid = (list) => list.reduce((acc, p) => acc + Number(p.paid_amount || 0), 0);
  const todayPayments = payments.filter((p) => p.payment_date && new Date(p.payment_date) >= startOfToday);
  const mtdPayments = payments.filter((p) => p.payment_date && new Date(p.payment_date) >= startOfMonth);
  const ytdPayments = payments.filter((p) => p.payment_date && new Date(p.payment_date) >= startOfYear);

  const todayCollection = sumPaid(todayPayments);
  const mtdCollection = sumPaid(mtdPayments);
  const ytdCollection = sumPaid(ytdPayments);
  const outstanding = Math.max(0, totalMonthlyFee - mtdCollection);

  return {
    todayCollection: `Rs. ${todayCollection.toLocaleString()}`,
    mtdCollection: `Rs. ${mtdCollection.toLocaleString()}`,
    ytdCollection: `Rs. ${ytdCollection.toLocaleString()}`,
    estMonthlyRevenue: `Rs. ${totalMonthlyFee.toLocaleString()}`,
    outstanding: `Rs. ${outstanding.toLocaleString()}`,
    profitThisMonth: `Rs. ${mtdCollection.toLocaleString()}`,
    totalExpenseYear: 'Rs. 0',
    totalExpenseMonth: 'Rs. 0',
    expenseToday: 'Rs. 0',
    campusBreakdown: campusList.map((c) => {
      const cStudents = activeStudents.filter((s) => String(s.campus_id) === String(c.id));
      const cEst = cStudents.reduce((acc, s) => acc + Math.max(0, Number(s.monthly_fee || 0) - Number(s.discount || 0)), 0);
      const cPayments = payments.filter((p) => String(p.campus_id) === String(c.id));
      const cToday = sumPaid(cPayments.filter((p) => p.payment_date && new Date(p.payment_date) >= startOfToday));
      const cMtd = sumPaid(cPayments.filter((p) => p.payment_date && new Date(p.payment_date) >= startOfMonth));
      const cYtd = sumPaid(cPayments.filter((p) => p.payment_date && new Date(p.payment_date) >= startOfYear));
      const cOut = Math.max(0, cEst - cMtd);
      return {
        name: c.name,
        sub: c.sub,
        today: `Rs. ${cToday.toLocaleString()}`,
        mtd: `Rs. ${cMtd.toLocaleString()}`,
        ytd: `Rs. ${cYtd.toLocaleString()}`,
        estMonthly: `Rs. ${cEst.toLocaleString()}`,
        outstanding: `Rs. ${cOut.toLocaleString()}`
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
  return { ...counts, marked: counts.p + counts.a + counts.l + counts.late + counts.hd + counts.hol };
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
  return {
    total,
    published,
    pending: total - published,
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
