const buildAppDownloadStats = (studentStats, teachers, campusList) => {
  const totalStudents = studentStats?.summary?.totalStudents || 0;
  const activeStudents = studentStats?.summary?.activeStudents || 0;
  const totalTeachers = teachers.length;

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
      const cStudents = studentStats?.campusMap?.get(String(c.id))?.totalStudents || 0;
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

const buildAdmissionsStats = (studentStats) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthly = monthNames.map((mName, mIdx) => ({
    month: mName,
    admissions: studentStats?.admissionsMonthlyMap?.get(mIdx + 1) || 0,
    dropouts: studentStats?.dropoutsMonthlyMap?.get(mIdx + 1) || 0
  }));

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
  const areaBreakdown = (studentStats?.areaBreakdown || []).map((item, i) => ({
    name: item._id,
    count: item.count,
    color: colors[i % colors.length]
  }));

  return {
    totalAdmissions: studentStats?.summary?.totalStudents || 0,
    totalDropouts: studentStats?.summary?.totalDropouts || 0,
    monthly,
    areaBreakdown: areaBreakdown.length > 0 ? areaBreakdown : [{ name: 'No area records', count: 0, color: '#3b82f6' }]
  };
};

const buildCrmPipeline = (studentStats) => {
  const totalStudents = studentStats?.summary?.totalStudents || 0;
  const activeStudents = studentStats?.summary?.activeStudents || 0;
  const pendingLeads = studentStats?.summary?.pendingLeads || 0;
  const passedTests = studentStats?.summary?.passedTests || 0;

  const stages = [
    { name: 'New Inquiries', count: pendingLeads, color: '#3b82f6' },
    { name: 'Evaluated / Passed', count: passedTests, color: '#f59e0b' },
    { name: 'Enrolled Students', count: activeStudents, color: '#10b981' }
  ].filter((st) => st.count > 0);

  const conversionRate = totalStudents > 0 ? `${Math.round((activeStudents / totalStudents) * 100)}%` : '0%';

  return {
    totalLeads: totalStudents,
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
