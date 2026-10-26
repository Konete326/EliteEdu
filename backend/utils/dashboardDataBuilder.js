const {
  buildFinancialOverview,
  buildAttendanceSummary,
  buildHomeworkSummary
} = require('./dashboardFinanceBuilder');
const {
  buildAppDownloadStats,
  buildAdmissionsStats,
  buildCrmPipeline
} = require('./dashboardDemographicsBuilder');

const buildAdminDashboardData = ({
  school,
  teachers = [],
  campuses = [],
  totalSubjects = 0,
  grades = [],
  homework = [],
  todayAttendance = [],
  todayStaffAttendance = [],
  studentStats,
  feeStats,
  expenseStats
}) => {
  const schoolName = school?.name || 'Main Campus';
  const schoolType = school?.school_type || 'Private';

  const {
    totalStudents = 0,
    activeStudents = 0,
    maleStudents = 0,
    femaleStudents = 0,
    pendingLeads = 0
  } = studentStats?.summary || {};

  const totalTeachers = teachers.length;
  const totalCampuses = campuses.length;
  const totalGrades = grades.length;

  const campusList = campuses.length > 0
    ? campuses.map((c) => ({ id: c._id, name: c.name, sub: c.status || 'Active' }))
    : [{ id: null, name: schoolName, sub: 'Main Campus' }];

  const now = new Date();
  const curMonth = now.getMonth();
  const curDay = now.getDate();

  const isBday = (dob) => {
    if (!dob) return false;
    const d = new Date(dob);
    return d.getMonth() === curMonth && d.getDate() === curDay;
  };

  const birthdaysToday = [
    ...(studentStats?.birthdaysToday || []),
    ...teachers.filter((t) => isBday(t.dob)).map((t) => ({ name: t.name, role: 'Staff' }))
  ];

  const upcomingClasses = grades.map((g) => ({
    title: `${g.name} ${g.sections?.length > 0 ? `(Sec: ${g.sections.join(', ')})` : ''}`,
    time: 'Scheduled'
  }));

  return {
    school: { name: schoolName, school_type: schoolType },
    topKpis: {
      activeStudents,
      totalStudents,
      teachers: totalTeachers,
      subjects: totalSubjects,
      campuses: totalCampuses,
      totalSessions: totalGrades,
      upcomingSessions: totalGrades,
      liveNow: 0
    },
    appDownloadStats: buildAppDownloadStats(studentStats, teachers, campusList),
    admissionsStats: buildAdmissionsStats(studentStats),
    financialOverview: buildFinancialOverview(campusList, studentStats, feeStats, expenseStats),
    attendanceSummary: buildAttendanceSummary(campusList, studentStats, teachers, todayAttendance, todayStaffAttendance),
    homeworkSummary: buildHomeworkSummary(campusList, homework),
    studentStats: {
      enquiries: { total: pendingLeads, boys: Math.ceil(pendingLeads / 2), girls: Math.floor(pendingLeads / 2) },
      registrations: { total: activeStudents, boys: maleStudents, girls: femaleStudents },
      admissions: { total: totalStudents, boys: maleStudents, girls: femaleStudents },
      campusBreakdown: campusList.map((c) => {
        const cData = studentStats?.campusMap?.get(String(c.id)) || { totalStudents: 0, activeStudents: 0 };
        return {
          name: c.name,
          sub: c.sub,
          inquiries: 0,
          registered: cData.activeStudents || 0,
          admissions: cData.totalStudents || 0
        };
      })
    },
    crmPipeline: buildCrmPipeline(studentStats),
    birthdaysToday,
    upcomingClasses
  };
};

module.exports = { buildAdminDashboardData };
