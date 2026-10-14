const buildAdminDashboardData = (school, liveTeachers, liveStudents, campuses = [], totalSubjects = 0) => {
  const schoolName = school?.name || 'Main Campus';
  const studentsCount = liveStudents > 0 ? liveStudents : 0;
  const teachersCount = liveTeachers || 0;
  const totalCount = studentsCount;
  const subjectsCount = totalSubjects || 0;
  const campusBreakdowns = campuses && campuses.length > 0
    ? campuses.map((c) => ({ name: c.name, sub: c.status || 'Active' }))
    : [{ name: schoolName, sub: 'Main Campus' }];

  return {
    school: { name: schoolName, school_type: school?.school_type || 'Private' },
    topKpis: {
      activeStudents: studentsCount, totalStudents: totalCount, teachers: teachersCount,
      subjects: subjectsCount, totalSessions: 0, upcomingSessions: 0, liveNow: 0
    },
    appDownloadStats: {
      totalDownloads: 52, studentDownloads: 45, staffDownloads: 7,
      activeUsers: 29, activeStudents: 26, activeStaff: 3, activePct: 55.8,
      studentStrength: totalCount, studentDownloadPct: 12.6,
      staffStrength: teachersCount, staffDownloadPct: 43.8,
      campusBreakdown: campusBreakdowns.map((c, i) => ({
        name: c.name, sub: c.sub, downloads: 20 + i * 5, activeUsers: 10 + i * 3,
        students: `${10 + i * 2}/${40 + i * 10}`, studentPct: 25.0, staff: '2/4', staffPct: 50.0
      }))
    },
    admissionsStats: {
      totalAdmissions: 126, totalDropouts: 6,
      monthly: [
        { month: 'Jan', admissions: 1, dropouts: 0 }, { month: 'Feb', admissions: 5, dropouts: 1 },
        { month: 'Mar', admissions: 4, dropouts: 0 }, { month: 'Apr', admissions: 2, dropouts: 0 },
        { month: 'May', admissions: 6, dropouts: 1 }, { month: 'Jun', admissions: 38, dropouts: 2 },
        { month: 'Jul', admissions: 14, dropouts: 1 }, { month: 'Aug', admissions: 21, dropouts: 0 },
        { month: 'Sep', admissions: 24, dropouts: 1 }, { month: 'Oct', admissions: 11, dropouts: 0 },
        { month: 'Nov', admissions: 0, dropouts: 0 }, { month: 'Dec', admissions: 0, dropouts: 0 }
      ],
      areaBreakdown: [
        { name: 'Uncategorized', count: 122, color: '#3b82f6' },
        { name: 'North Nazimabad', count: 3, color: '#10b981' },
        { name: 'Gulberg', count: 1, color: '#f59e0b' }
      ]
    },
    financialOverview: {
      todayCollection: '$450.00', mtdCollection: '$14,250.00', ytdCollection: '$128,400.00',
      estMonthlyRevenue: '$22,500.00', outstanding: '$8,950.00', profitThisMonth: '$9,800.00',
      totalExpenseYear: '$54,300.00', totalExpenseMonth: '$4,450.00', expenseToday: '$120.00',
      campusBreakdown: campusBreakdowns.map((c) => ({
        name: c.name, sub: c.sub, today: '$150.00', mtd: '$4,200.00',
        ytd: '$38,000.00', estMonthly: '$7,500.00', outstanding: '$2,100.00'
      }))
    },
    attendanceSummary: {
      date: '14 Oct, 2026',
      students: { p: 15, a: 6, l: 3, late: 1, hd: 0, hol: 0, um: 337, marked: '25/362' },
      staff: { p: 0, a: 0, l: 1, late: 0, hd: 0, hol: 0, um: 15, marked: '1/16' },
      campusBreakdown: campusBreakdowns.map((c) => ({
        name: c.name, sub: c.sub,
        students: { total: 6, p: 0, a: 0, l: 0, late: 0, hd: 0, hol: 0, um: 6 },
        staff: { total: 0, p: 0, a: 0, l: 0, late: 0, hd: 0, hol: 0, um: 0 }
      }))
    },
    homeworkSummary: {
      total: 216, assigned: 3, published: 3, unassigned: 212, unpublished: 212,
      campusesAssigned: `${campusBreakdowns.length} / ${campusBreakdowns.length}`,
      campusBreakdown: campusBreakdowns.map((c) => ({
        name: c.name, sub: c.sub, assigned: '1/1 (100%)', published: '1/1 (100%)'
      }))
    },
    studentStats: {
      enquiries: { total: 6, boys: 3, girls: 3 },
      registrations: { total: 14, boys: 12, girls: 2 },
      admissions: { total: 362, boys: 359, girls: 3 },
      campusBreakdown: campusBreakdowns.map((c) => ({
        name: c.name, sub: c.sub, inquiries: 0, registered: 0, admissions: 6
      }))
    },
    crmPipeline: {
      totalLeads: 15, converted: 9, conversionRate: '60%',
      stages: [
        { name: 'Hot lead', count: 4, color: '#10b981' },
        { name: 'New', count: 9, color: '#3b82f6' },
        { name: 'Contacted', count: 1, color: '#f59e0b' },
        { name: 'Lost', count: 1, color: '#ef4444' }
      ]
    },
    birthdaysToday: [],
    upcomingClasses: []
  };
};

module.exports = { buildAdminDashboardData };
