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

const buildAdminDashboardData = (school, teachers = [], students = [], campuses = [], totalSubjects = 0, grades = [], homework = []) => {
  const schoolName = school?.name || 'Main Campus';
  const schoolType = school?.school_type || 'Private';

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Active').length;
  const totalTeachers = teachers.length;
  const totalCampuses = campuses.length;
  const totalGrades = grades.length;

  const maleStudents = students.filter((s) => s.gender === 'Male').length;
  const femaleStudents = students.filter((s) => s.gender === 'Female').length;

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
    ...students.filter((s) => isBday(s.dob)).map((s) => ({ name: s.name, role: 'Student' })),
    ...teachers.filter((t) => isBday(t.dob)).map((t) => ({ name: t.name, role: 'Staff' }))
  ];

  const upcomingClasses = grades.map((g) => ({
    title: `${g.name} ${g.sections?.length > 0 ? `(Sec: ${g.sections.join(', ')})` : ''}`,
    time: 'Scheduled'
  }));

  const pendingLeads = students.filter((s) => s.admission_test?.status === 'Pending').length;

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
    appDownloadStats: buildAppDownloadStats(students, teachers, campusList, totalStudents, activeStudents, totalTeachers),
    admissionsStats: buildAdmissionsStats(students),
    financialOverview: buildFinancialOverview(campusList, students),
    attendanceSummary: buildAttendanceSummary(campusList, students, teachers),
    homeworkSummary: buildHomeworkSummary(campusList, homework),
    studentStats: {
      enquiries: { total: pendingLeads, boys: Math.ceil(pendingLeads / 2), girls: Math.floor(pendingLeads / 2) },
      registrations: { total: activeStudents, boys: maleStudents, girls: femaleStudents },
      admissions: { total: totalStudents, boys: maleStudents, girls: femaleStudents },
      campusBreakdown: campusList.map((c) => {
        const cTotal = students.filter((s) => String(s.campus_id) === String(c.id)).length;
        const cActive = students.filter((s) => s.status === 'Active' && String(s.campus_id) === String(c.id)).length;
        return {
          name: c.name,
          sub: c.sub,
          inquiries: 0,
          registered: cActive,
          admissions: cTotal
        };
      })
    },
    crmPipeline: buildCrmPipeline(students, activeStudents),
    birthdaysToday,
    upcomingClasses
  };
};

module.exports = { buildAdminDashboardData };
