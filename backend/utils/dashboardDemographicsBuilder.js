const buildAppDownloadStats = (students, teachers, campusList, totalStudents, activeStudents, totalTeachers) => {
  const totalDownloads = totalStudents + totalTeachers;
  const activeDownloads = activeStudents + totalTeachers;
  const activePct = totalDownloads > 0 ? Number(((activeDownloads / totalDownloads) * 100).toFixed(1)) : 0;

  return {
    totalDownloads,
    studentDownloads: totalStudents,
    staffDownloads: totalTeachers,
    activeUsers: activeDownloads,
    activeStudents,
    activeStaff: totalTeachers,
    activePct,
    studentStrength: totalStudents,
    studentDownloadPct: totalStudents > 0 ? 100 : 0,
    staffStrength: totalTeachers,
    staffDownloadPct: totalTeachers > 0 ? 100 : 0,
    campusBreakdown: campusList.map((c) => {
      const cStudents = students.filter((s) => String(s.campus_id) === String(c.id)).length;
      const cTeachers = teachers.filter((t) => String(t.campus_id) === String(c.id)).length;
      return {
        name: c.name,
        sub: c.sub,
        downloads: cStudents + cTeachers,
        activeUsers: cStudents + cTeachers,
        students: `${cStudents}/${totalStudents}`,
        studentPct: totalStudents > 0 ? Number(((cStudents / totalStudents) * 100).toFixed(1)) : 0,
        staff: `${cTeachers}/${totalTeachers}`,
        staffPct: totalTeachers > 0 ? Number(((cTeachers / totalTeachers) * 100).toFixed(1)) : 0
      };
    })
  };
};

const buildAdmissionsStats = (students) => {
  const now = new Date();
  const curYear = now.getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthly = monthNames.map((mName, mIdx) => {
    const admitted = students.filter((s) => {
      const dt = s.admission_date ? new Date(s.admission_date) : new Date(s.createdAt);
      return dt.getFullYear() === curYear && dt.getMonth() === mIdx;
    }).length;
    const dropouts = students.filter((s) => {
      if (s.status !== 'Left') return false;
      const dt = s.updatedAt ? new Date(s.updatedAt) : new Date(s.createdAt);
      return dt.getFullYear() === curYear && dt.getMonth() === mIdx;
    }).length;
    return { month: mName, admissions: admitted, dropouts };
  });

  const areaMap = {};
  students.forEach((s) => {
    const a = s.address?.area?.trim() || 'General / Unspecified';
    areaMap[a] = (areaMap[a] || 0) + 1;
  });
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
  const areaBreakdown = Object.entries(areaMap).map(([name, count], i) => ({
    name,
    count,
    color: colors[i % colors.length]
  }));

  return {
    totalAdmissions: students.length,
    totalDropouts: students.filter((s) => s.status === 'Left').length,
    monthly,
    areaBreakdown: areaBreakdown.length > 0 ? areaBreakdown : [{ name: 'No area records', count: 0, color: '#3b82f6' }]
  };
};

const buildCrmPipeline = (students, activeStudents) => {
  const pendingLeads = students.filter((s) => s.admission_test?.status === 'Pending').length;
  const passedTests = students.filter((s) => s.admission_test?.status === 'Passed' || s.admission_test?.test_passed).length;
  const stages = [
    { name: 'New Inquiries', count: pendingLeads, color: '#3b82f6' },
    { name: 'Evaluated / Passed', count: passedTests, color: '#f59e0b' },
    { name: 'Enrolled Students', count: activeStudents, color: '#10b981' }
  ].filter((st) => st.count > 0);

  const conversionRate = students.length > 0 ? `${Math.round((activeStudents / students.length) * 100)}%` : '0%';

  return {
    totalLeads: students.length,
    converted: activeStudents,
    conversionRate,
    stages
  };
};

module.exports = {
  buildAppDownloadStats,
  buildAdmissionsStats,
  buildCrmPipeline
};
