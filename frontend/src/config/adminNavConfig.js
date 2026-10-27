import {
  LayoutGrid, CalendarCheck, DollarSign, Landmark, GraduationCap,
  Users, MessageSquare, Award, Calendar, Bus, BarChart3, Sliders, BookOpen
} from 'lucide-react';

export const getAdminNavItems = (schoolType) => [
  {
    type: 'group',
    title: 'Main',
    icon: LayoutGrid,
    subItems: [
      { name: 'Dashboard', path: '/admin' },
      { name: 'Campuses', path: '/admin/campus' },
      { name: 'Campus Transfer', path: '/admin/campus-transfer' },
      { name: 'Classes', path: '/admin/grades' },
      { name: 'Subjects', path: '/admin/subjects' },
      { name: 'Teachers', path: '/admin/teachers' },
      { name: 'Teacher Cards', path: '/admin/teachers/id-cards' },
      { name: 'Applicants', path: '/admin/staff-applicants' },
      { name: 'Students', path: '/admin/students' },
      { name: 'Admissions', path: '/admin/students/admission-letter' },
      { name: 'Student Cards', path: '/admin/students/id-cards' },
      { name: 'Certificates', path: '/admin/certificates' },
      { name: 'Templates', path: '/admin/certificates/templates' },
      { name: 'Promotions', path: '/admin/students/promote' },
      { name: 'Activities', path: '/admin/events', badge: 'Coming Soon' },
      { name: 'Behavior', path: '/admin/behavior-skills' },
      { name: 'Student Portal', path: '/admin/student-portal-preview' }
    ]
  },
  {
    type: 'group',
    title: 'Attendance',
    icon: CalendarCheck,
    subItems: [
      { name: 'Attendance', path: '/admin/attendance/students' }
    ]
  },
  ...(schoolType === 'Private' ? [
    {
      type: 'group',
      title: 'Fees',
      icon: DollarSign,
      subItems: [
        { name: 'Collect Fees', path: '/admin/fees/collection' },
        { name: 'Fee Plans', path: '/admin/fees/structure' },
        { name: 'Defaulters', path: '/admin/fees/defaulters' },
        { name: 'Fee Reports', path: '/admin/fees/reports' },
        { name: 'Concessions', path: '/admin/fees/concession' }
      ]
    },
    {
      type: 'group',
      title: 'Accounts',
      icon: Landmark,
      subItems: [
        { name: 'Account Heads', path: '/admin/accounts/chart' },
        { name: 'Income', path: '/admin/accounts/income' },
        { name: 'Expenses', path: '/admin/accounts/expenses' },
        { name: 'Transactions', path: '/admin/accounts/transactions' },
        { name: 'Balance Sheet', path: '/admin/accounts/balance-sheet' },
        { name: 'Payroll', path: '/admin/payroll' },
        { name: 'Store / POS', path: '/admin/store' }
      ]
    }
  ] : []),
  {
    type: 'group',
    title: 'E-Learning',
    icon: GraduationCap,
    subItems: [
      { name: 'Courses', path: '/admin/lms/courses', badge: 'Coming Soon' }
    ]
  },
  {
    type: 'group',
    title: 'Admissions',
    icon: Users,
    subItems: [
      { name: 'Inquiries', path: '/admin/crm/inquiries' },
      { name: 'Status', path: '/admin/crm/admissions' },
      { name: 'Follow-ups', path: '/admin/crm/follow-ups' },
      { name: 'Analytics', path: '/admin/crm/analytics' }
    ]
  },
  {
    type: 'group',
    title: 'Messages',
    icon: MessageSquare,
    subItems: [
      { name: 'Staff Chat', path: '/admin/messaging/internal' },
      { name: 'Notices', path: '/admin/notifications' }
    ]
  },
  {
    type: 'group',
    title: 'Exams',
    icon: Award,
    subItems: [
      { name: 'Exam Types', path: '/admin/exam-management/categories' },
      { name: 'Grading', path: '/admin/exam-management/grading-policies', badge: 'Coming Soon' },
      { name: 'Remarks Rules', path: '/admin/exam-management/remarks-policy' },
      { name: 'Datesheet', path: '/admin/exam-management/schedule' },
      { name: 'Remarks', path: '/admin/exam-management/manage-remarks' },
      { name: 'Marks Entry', path: '/admin/exam-management/mark-sheets' },
      { name: 'Question Papers', path: '/admin/question-papers' }
    ]
  },
  {
    type: 'group',
    title: 'Timetable',
    icon: Calendar,
    subItems: [
      { name: 'Timetable', path: '/admin/timetable' },
      { name: 'Calendar', path: '/admin/events', badge: 'Coming Soon' }
    ]
  },
  {
    type: 'group',
    title: 'Transport',
    icon: Bus,
    subItems: [
      { name: 'Vehicles', path: '/admin/transport' },
      { name: 'Routes', path: '/admin/van-management' }
    ]
  },
  {
    type: 'group',
    title: 'Reports',
    icon: BarChart3,
    subItems: [
      { name: 'Reports Hub', path: '/admin/reports' },
      { name: 'Students Report', path: '/admin/reports/student-info' },
      { name: 'Parents Info', path: '/admin/reports/parent-info' },
      { name: 'Staff Report', path: '/admin/reports/staff-info' },
      { name: 'Attendance', path: '/admin/attendance/report' },
      { name: 'Report Cards', path: '/admin/reports/report-cards' },
      { name: 'Audit Logs', path: '/admin/reports/audit-logs' }
    ]
  },
  {
    type: 'group',
    title: 'Settings',
    icon: Sliders,
    subItems: [
      { name: 'General', path: '/admin/settings/general' },
      { name: 'Zoom Setup', path: '/admin/settings/integrations/zoom' },
      { name: 'Signatures', path: '/admin/general-settings/signatures' },
      { name: 'Roles & Rights', path: '/admin/settings/roles' },
      { name: 'Users', path: '/admin/control-panel/user-management' },
      { name: 'Class Transfer', path: '/admin/control-panel/class-transfer' },
      { name: 'Logo & Theme', path: '/admin/control-panel/branding' },
      { name: 'Bulk Import', path: '/admin/control-panel/bulk-import' },
      { name: 'Backup', path: '/admin/settings/backup' }
    ]
  }
];

export const getNavCategories = (user) => {
  if (!user) return [];
  if (user.role === 'SuperAdmin') {
    return [{
      type: 'group',
      title: 'Main',
      icon: LayoutGrid,
      subItems: [
        { name: 'Dashboard', path: '/superadmin' },
        { name: 'Schools', path: '/superadmin/schools' },
        { name: 'Logs', path: '/superadmin/logs' }
      ]
    }];
  }

  if (user.role === 'Student') {
    return [{
      type: 'group',
      title: 'Main',
      icon: LayoutGrid,
      subItems: [
        { name: 'Dashboard', path: '/student/dashboard' },
        { name: 'Messages', path: '/student/messages' }
      ]
    }];
  }

  if (user.role === 'Teacher') {
    const permissions = user.app_settings || user.app_permissions || {};
    const eff = user.effective_permissions || {};
    const has = (key, fallback = true) => {
      if (eff[key]?.view !== undefined) return Boolean(eff[key].view);
      return permissions[key] !== undefined ? permissions[key] !== false : fallback;
    };

    const groups = [];

    const mainItems = [
      { name: 'Dashboard', path: '/teacher' }
    ];
    if (has('students')) mainItems.push({ name: 'Students', path: '/teacher/students' });
    if (has('timetable')) mainItems.push({ name: 'Timetable', path: '/teacher/timetable' });
    groups.push({
      type: 'group',
      title: 'Main',
      icon: LayoutGrid,
      subItems: mainItems
    });

    const attendanceItems = [];
    if (has('attendance')) attendanceItems.push({ name: 'Attendance', path: '/teacher/attendance' });
    if (has('behavior')) attendanceItems.push({ name: 'Behavior', path: '/teacher/behavior' });
    if (attendanceItems.length > 0) {
      groups.push({
        type: 'group',
        title: 'Attendance',
        icon: CalendarCheck,
        subItems: attendanceItems
      });
    }

    const lmsItems = [];
    if (has('homework')) lmsItems.push({ name: 'Homework', path: '/teacher/homework', badge: 'Coming Soon' });
    if (has('lectures')) lmsItems.push({ name: 'Lectures', path: '/teacher/lectures', badge: 'Coming Soon' });
    if (has('quizzes')) lmsItems.push({ name: 'Quizzes', path: '/teacher/quizzes', badge: 'Coming Soon' });
    if (has('online_classes')) lmsItems.push({ name: 'Live Classes', path: '/teacher/online-classes', badge: 'Coming Soon' });
    if (lmsItems.length > 0) {
      groups.push({
        type: 'group',
        title: 'E-Learning',
        icon: BookOpen,
        subItems: lmsItems
      });
    }

    const examItems = [];
    if (has('examination') || has('exams') || permissions.exam_management) {
      examItems.push({ name: 'Exam Marks', path: '/teacher/exams', badge: 'Coming Soon' });
    }
    if (has('datesheet')) examItems.push({ name: 'Datesheet', path: '/teacher/datesheet', badge: 'Coming Soon' });
    if (has('class_tests')) examItems.push({ name: 'Class Tests', path: '/teacher/class-tests' });
    if (has('question_papers')) examItems.push({ name: 'Question Papers', path: '/teacher/question-papers' });
    if (examItems.length > 0) {
      groups.push({
        type: 'group',
        title: 'Exams',
        icon: Award,
        subItems: examItems
      });
    }

    const schoolType = user?.school_type || user?.school_id?.school_type || 'Private';
    const plannerItems = [];
    if (has('planner')) plannerItems.push({ name: 'Planner', path: '/teacher/planner', badge: 'Coming Soon' });
    if (has('events')) plannerItems.push({ name: 'Events', path: '/teacher/events', badge: 'Coming Soon' });
    if (has('counseling')) plannerItems.push({ name: 'Counseling', path: '/teacher/counseling', badge: 'Coming Soon' });
    if (has('complaints')) plannerItems.push({ name: 'Complaints', path: '/teacher/complaints', badge: 'Coming Soon' });
    if (has('lost_and_found')) plannerItems.push({ name: 'Lost & Found', path: '/teacher/lost-and-found', badge: 'Coming Soon' });
    if (plannerItems.length > 0) {
      groups.push({
        type: 'group',
        title: 'Events',
        icon: Calendar,
        subItems: plannerItems
      });
    }

    const employmentItems = [];
    if (schoolType !== 'Government' && has('salary')) {
      employmentItems.push({ name: 'Salary Slip', path: '/teacher/salary', badge: 'Coming Soon' });
    }
    employmentItems.push({ name: 'Messages', path: '/teacher/messages' });
    if (has('my_profile')) employmentItems.push({ name: 'Profile', path: '/teacher/profile' });
    if (employmentItems.length > 0) {
      groups.push({
        type: 'group',
        title: 'My Account',
        icon: DollarSign,
        subItems: employmentItems
      });
    }

    return groups;
  }

  const customRole = user?.custom_role_id || user?.custom_role;
  const rawPerms = user?.permissions || customRole?.permissions;

  if (Array.isArray(rawPerms) && rawPerms.length > 0) {
    const allowed = new Set(rawPerms.filter((p) => p.view).map((p) => p.module_key?.toLowerCase()));
    const groups = [];

    const mainSub = [
      { name: 'Dashboard', path: '/admin' }
    ];

    if (allowed.has('campus')) mainSub.push({ name: 'Campuses', path: '/admin/campus' });
    if (allowed.has('grades')) mainSub.push({ name: 'Classes', path: '/admin/grades' });
    if (allowed.has('subjects')) mainSub.push({ name: 'Subjects', path: '/admin/subjects' });
    if (allowed.has('teachers')) mainSub.push({ name: 'Teachers', path: '/admin/teachers' });
    if (allowed.has('students')) mainSub.push({ name: 'Students', path: '/admin/students' });
    if (allowed.has('student_promotion')) mainSub.push({ name: 'Promotions', path: '/admin/students/promote' });
    if (allowed.has('admission_letter')) mainSub.push({ name: 'Admissions', path: '/admin/students/admission-letter' });
    if (allowed.has('student_id_cards')) mainSub.push({ name: 'Student Cards', path: '/admin/students/id-cards' });
    if (allowed.has('teacher_id_cards')) mainSub.push({ name: 'Teacher Cards', path: '/admin/teachers/id-cards' });
    if (allowed.has('certificates')) {
      mainSub.push({ name: 'Certificates', path: '/admin/certificates' });
      mainSub.push({ name: 'Templates', path: '/admin/certificates/templates' });
    }
    if (allowed.has('student_portal')) mainSub.push({ name: 'Student Portal', path: '/admin/student-portal-preview' });
    if (allowed.has('transport')) mainSub.push({ name: 'Vehicles', path: '/admin/transport' });

    groups.push({
      type: 'group',
      title: customRole?.name ? customRole.name : 'Main',
      icon: LayoutGrid,
      subItems: mainSub
    });

    if (allowed.has('fees')) {
      groups.push({
        type: 'group',
        title: 'Fees',
        icon: DollarSign,
        subItems: [
          { name: 'Collect Fees', path: '/admin/fees/collection' },
          { name: 'Fee Plans', path: '/admin/fees/structure' },
          { name: 'Defaulters', path: '/admin/fees/defaulters' },
          { name: 'Fee Reports', path: '/admin/fees/reports' },
          { name: 'Concessions', path: '/admin/fees/concession' }
        ]
      });
    }

    if (allowed.has('accounts') || allowed.has('payroll')) {
      groups.push({
        type: 'group',
        title: 'Accounts',
        icon: Landmark,
        subItems: [
          { name: 'Account Heads', path: '/admin/accounts/chart' },
          { name: 'Income', path: '/admin/accounts/income' },
          { name: 'Expenses', path: '/admin/accounts/expenses' },
          { name: 'Transactions', path: '/admin/accounts/transactions' },
          { name: 'Balance Sheet', path: '/admin/accounts/balance-sheet' },
          { name: 'Payroll', path: '/admin/payroll' }
        ]
      });
    }

    if (allowed.has('attendance')) {
      groups.push({
        type: 'group',
        title: 'Attendance',
        icon: CalendarCheck,
        subItems: [
          { name: 'Attendance', path: '/admin/attendance/students' }
        ]
      });
    }

    if (allowed.has('exams') || allowed.has('grading_policies')) {
      const examSubs = [];
      if (allowed.has('exams')) {
        examSubs.push({ name: 'Exams', path: '/admin/exam-management/exams' });
        examSubs.push({ name: 'Class Tests', path: '/admin/class-tests/manage' });
        examSubs.push({ name: 'Schedules', path: '/admin/exams/schedules' });
        examSubs.push({ name: 'Datesheets', path: '/admin/exams/date-sheets' });
        examSubs.push({ name: 'Marks Entry', path: '/admin/exams/marks' });
      }
      if (allowed.has('grading_policies')) {
        examSubs.push({ name: 'Grading', path: '/admin/exam-management/grading-policies', badge: 'Coming Soon' });
      }
      groups.push({
        type: 'group',
        title: 'Exams',
        icon: Award,
        subItems: examSubs
      });
    }

    if (allowed.has('reports') || allowed.has('student_reports') || allowed.has('parent_reports') || allowed.has('report_cards')) {
      const repSubs = [
        { name: 'Reports Hub', path: '/admin/reports' }
      ];
      if (allowed.has('student_reports') || allowed.has('reports')) repSubs.push({ name: 'Students Report', path: '/admin/reports/student-info' });
      if (allowed.has('parent_reports') || allowed.has('reports')) repSubs.push({ name: 'Parents Info', path: '/admin/reports/parent-info' });
      if (allowed.has('staff') || allowed.has('reports')) repSubs.push({ name: 'Staff Report', path: '/admin/reports/staff-info' });
      if (allowed.has('attendance') || allowed.has('reports')) repSubs.push({ name: 'Attendance', path: '/admin/attendance/report' });
      if (allowed.has('report_cards') || allowed.has('reports')) repSubs.push({ name: 'Report Cards', path: '/admin/reports/report-cards' });
      repSubs.push({ name: 'Audit Logs', path: '/admin/reports/audit-logs' });
      groups.push({
        type: 'group',
        title: 'Reports',
        icon: BarChart3,
        subItems: repSubs
      });
    }

    if (allowed.has('messaging') || allowed.has('messenger') || allowed.has('operations')) {
      groups.push({
        type: 'group',
        title: 'Messages',
        icon: MessageSquare,
        subItems: [
          { name: 'Staff Chat', path: '/admin/messaging/internal' },
          { name: 'Notices', path: '/admin/notifications' }
        ]
      });
    }

    if (allowed.has('control_panel') || allowed.has('user_management') || allowed.has('bulk_migration')) {
      const cpSubs = [];
      if (allowed.has('control_panel') || allowed.has('bulk_migration')) {
        cpSubs.push({ name: 'General', path: '/admin/settings/general' });
        cpSubs.push({ name: 'Signatures', path: '/admin/general-settings/signatures' });
        cpSubs.push({ name: 'Logo & Theme', path: '/admin/control-panel/branding' });
        cpSubs.push({ name: 'Bulk Import', path: '/admin/control-panel/bulk-import' });
      }
      if (allowed.has('user_management')) {
        cpSubs.push({ name: 'Users', path: '/admin/control-panel/user-management' });
        cpSubs.push({ name: 'Roles & Rights', path: '/admin/settings/roles' });
      }
      groups.push({
        type: 'group',
        title: 'Settings',
        icon: Sliders,
        subItems: cpSubs
      });
    }

    return groups;
  }

  return getAdminNavItems(user.school_type);
};

export const getAllAdminRoutes = () => {
  const allGroups = getAdminNavItems('Private');
  const excluded = new Set([
    '/admin', '/admin/teachers', '/admin/teachers/id-cards', '/admin/campus', '/admin/subjects',
    '/admin/grades', '/admin/students', '/admin/students/admission-letter', '/admin/students/id-cards',
    '/admin/staff-applicants', '/admin/exam-management/grading-policies', '/admin/exams/grading-policies',
    '/admin/exam-management/exams', '/admin/exam-management/exams/new', '/admin/exams/schedules',
    '/admin/exams/date-sheets', '/admin/exams/marks', '/teacher/exams',
    '/admin/exam-management/categories', '/admin/exam-management/remarks-policy',
    '/admin/exam-management/schedule', '/admin/exam-management/schedule/new',
    '/admin/exam-management/manage-remarks', '/admin/exam-management/mark-sheets',
    '/admin/exam-management/results', '/admin/question-papers',
    '/admin/class-tests/manage', '/admin/class-tests/results', '/teacher/class-tests',
    '/admin/fees/collection', '/admin/fees/structure', '/admin/fees/defaulters',
    '/admin/fees/reports', '/admin/fees/concession',
    '/admin/settings/appearance', '/admin/control-panel/branding', '/admin/reports/audit-logs',
    '/admin/reports/audit-log', '/admin/reports', '/admin/reports/academic', '/admin/reports/report-cards',
    '/admin/reports/student-info', '/admin/reports/parent-info', '/admin/reports/staff-info',
    '/admin/reports/attendance-report', '/admin/reports/attendance',
    '/admin/students/promote', '/admin/control-panel/class-transfer',
    '/admin/control-panel/user-management', '/admin/settings/roles', '/admin/control-panel/roles', '/admin/roles',
    '/admin/notifications', '/admin/messaging/notifications', '/admin/circular', '/teacher/notifications', '/superadmin/notifications',
    '/admin/settings/general', '/admin/settings/integrations/zoom', '/admin/general-settings/signatures',
    '/admin/settings/signatures', '/admin/attendance/students', '/admin/attendance/staff',
    '/admin/attendance/employees', '/admin/attendance/leave-request', '/admin/attendance/report',
    '/admin/certificates', '/admin/certificates/templates',
    '/admin/accounts', '/admin/accounts/chart', '/admin/accounts/income', '/admin/accounts/expenses',
    '/admin/accounts/transactions', '/admin/accounts/balance-sheet', '/admin/payroll', '/teacher/salary',
    '/admin/campus-transfer', '/admin/store', '/admin/pos', '/admin/online-store', '/admin/behavior', '/teacher/behavior',
    '/admin/behavior-skills', '/teacher/behavior-skills',
    '/admin/events', '/teacher/events', '/admin/news-feed', '/admin/complaints', '/teacher/complaints',
    '/admin/consent', '/admin/lost-and-found', '/teacher/lost-and-found', '/teacher/counseling', '/teacher/planner',
    '/admin/control-panel/bulk-import', '/admin/bulk-import', '/admin/data-migration', '/admin/transport', '/admin/general-settings/transport',
    '/admin/van-management', '/admin/van-management/routes', '/admin/van-management/allocation',
    '/admin/student-portal-preview', '/admin/van/routes', '/admin/van/vehicles', '/admin/van/drivers', '/admin/van/allocation',
    '/admin/messaging', '/admin/messaging/messages', '/admin/messaging/internal', '/admin/messages', '/teacher/messages', '/student/messages', '/admin/messaging/chat', '/admin/messaging/sms', '/admin/messaging/whatsapp', '/admin/messaging/email',
    '/admin/planners', '/admin/planners/academic-calendar', '/admin/planners/lesson-plans', '/admin/planners/activity-planner',
    '/admin/operations', '/admin/counseling',
    '/admin/settings/backup', '/admin/online-classes',
    '/admin/lms/courses', '/admin/lms/syllabus', '/admin/lms/assignments', '/admin/lms/material', '/admin/lms/live',
    '/admin/crm/inquiries', '/admin/crm/admissions', '/admin/crm/follow-ups', '/admin/crm/analytics'
  ]);
  const routes = [];
  allGroups.forEach((group) => {
    group.subItems.forEach((sub) => {
      if (!excluded.has(sub.path)) {
        routes.push(sub);
      }
    });
  });
  return routes;
};

export const getRouteTitle = (pathname) => {
  if (pathname === '/admin/messaging/messages' || pathname === '/admin/messaging/internal' || pathname === '/admin/messages' || pathname === '/teacher/messages' || pathname === '/student/messages') return 'Staff Chat & Messages';
  if (pathname === '/admin') return 'Dashboard';
  if (pathname === '/admin/campus') return 'Campuses';
  if (pathname === '/admin/subjects') return 'Subjects';
  if (pathname === '/admin/grades') return 'Classes & Sections';
  if (pathname === '/admin/teachers') return 'Teachers';
  if (pathname === '/admin/teachers/new') return 'Add Teacher';
  if (pathname.startsWith('/admin/teachers/') && pathname.endsWith('/edit')) return 'Edit Teacher';
  if (pathname === '/admin/teachers/id-cards') return 'Teacher ID Cards';
  if (pathname === '/admin/staff-applicants') return 'Job Applications';
  if (pathname === '/admin/staff-applicants/new') return 'New Applicant';
  if (pathname.startsWith('/admin/staff-applicants/') && pathname.endsWith('/edit')) return 'Edit Applicant';
  if (pathname === '/admin/students') return 'Students List';
  if (pathname === '/admin/students/new') return 'Enroll Student';
  if (pathname.startsWith('/admin/students/') && pathname.endsWith('/edit')) return 'Edit Student';
  if (pathname === '/admin/students/admission-letter') return 'Admission Letters';
  if (pathname === '/admin/students/id-cards') return 'Student ID Cards';
  if (pathname === '/admin/fees' || pathname === '/admin/fees/collection') return 'Collect Fees';
  if (pathname === '/admin/fees/structure') return 'Fee Plans';
  if (pathname === '/admin/fees/defaulters') return 'Unpaid Fees';
  if (pathname === '/admin/fees/reports') return 'Fee Reports';
  if (pathname === '/admin/fees/concession') return 'Fee Discounts';
  if (pathname === '/admin/settings/appearance' || pathname === '/admin/control-panel/branding') return 'School Logo & Theme';
  if (pathname === '/admin/exam-management/grading-policies' || pathname === '/admin/exams/grading-policies') return 'Grading System';
  if (pathname === '/admin/exam-management/categories') return 'Exam Types';
  if (pathname === '/admin/exam-management/remarks-policy') return 'Remarks Rules';
  if (pathname === '/admin/exam-management/schedule') return 'Exam Schedule';
  if (pathname === '/admin/exam-management/schedule/new') return 'New Datesheet';
  if (pathname === '/admin/exam-management/manage-remarks') return 'Student Remarks';
  if (pathname === '/admin/exam-management/mark-sheets') return 'Enter Student Marks';
  if (pathname === '/admin/question-papers') return 'Question Papers';
  if (pathname === '/admin/exam-management/exams' || pathname === '/admin/exams/schedules' || pathname === '/admin/exams/date-sheets' || pathname === '/admin/exams/marks' || pathname === '/teacher/exams' || pathname === '/teacher/examination' || pathname === '/teacher/datesheet') return 'Exams & Marks';
  if (pathname === '/admin/exam-management/exams/new') return 'New Exam Setup';
  if (pathname.startsWith('/admin/exam-management/exams/') && pathname.endsWith('/edit')) return 'Edit Exam';
  if (pathname === '/admin/class-tests/manage' || pathname === '/teacher/class-tests') return 'Class Tests';
  if (pathname === '/admin/class-tests/results') return 'Test Results';
  if (pathname === '/admin/profile' || pathname === '/superadmin/profile' || pathname === '/teacher/profile') return 'My Profile';
  if (pathname === '/superadmin') return 'Dashboard';
  if (pathname === '/superadmin/schools') return 'All Schools';
  if (pathname === '/superadmin/schools/new') return 'New School';
  if (pathname === '/superadmin/logs' || pathname === '/admin/reports/audit-logs' || pathname === '/admin/reports/audit-log') return 'System Logs';
  if (pathname === '/admin/reports' || pathname === '/admin/reports/academic') return 'All Reports Overview';
  if (pathname === '/admin/reports/report-cards') return 'Print Report Cards';
  if (pathname === '/admin/reports/student-info') return 'Students Info Report';
  if (pathname === '/admin/reports/parent-info') return 'Parents Phone Numbers';
  if (pathname === '/admin/reports/staff-info') return 'Staff & Teachers List';
  if (pathname === '/admin/certificates') return 'Print Certificates';
  if (pathname === '/admin/certificates/templates') return 'Certificate Designs';
  if (pathname === '/admin/students/promote' || pathname === '/admin/control-panel/class-transfer') return 'Promote Students';
  if (pathname === '/admin/control-panel/user-management') return 'User Accounts';
  if (pathname === '/admin/settings/roles' || pathname === '/admin/control-panel/roles' || pathname === '/admin/roles') return 'Staff Roles & Rights';
  if (pathname === '/admin/notifications' || pathname === '/admin/messaging/notifications' || pathname === '/admin/circular' || pathname === '/teacher/notifications' || pathname === '/superadmin/notifications') return 'Send Notices & Alerts';
  if (pathname === '/admin/general-settings/signatures' || pathname === '/admin/settings/signatures') return 'Stamps & Signatures';
  if (pathname === '/admin/settings/integrations/zoom') return 'Zoom Live Classes';
  if (pathname === '/admin/attendance/students') return 'Student Attendance';
  if (pathname === '/admin/attendance/staff' || pathname === '/admin/attendance/employees') return 'Staff Attendance';
  if (pathname === '/admin/attendance/leave-request' || pathname === '/teacher/leaves') return 'Leave Requests';
  if (pathname === '/admin/attendance/report' || pathname === '/admin/reports/attendance-report' || pathname === '/admin/reports/attendance' || pathname === '/teacher/attendance-report') return 'Attendance Report';
  if (pathname === '/teacher') return 'Teacher Dashboard';
  if (pathname === '/teacher/students') return 'My Students';
  if (pathname === '/teacher/attendance') return 'Mark Attendance';
  if (pathname === '/teacher/homework') return 'Give Homework';
  if (pathname === '/teacher/examination') return 'Enter Exam Marks';
  if (pathname === '/teacher/timetable') return 'My Timetable';
  if (pathname === '/teacher/quizzes') return 'Online Quizzes';
  if (pathname === '/teacher/lectures') return 'Video Lectures';
  if (pathname === '/teacher/online-classes') return 'Live Classes';
  if (pathname === '/teacher/datesheet') return 'Exam Datesheet';
  if (pathname === '/teacher/salary') return 'My Salary Slip';
  if (pathname.startsWith('/admin/accounts')) return 'Accounts';
  if (pathname === '/admin/payroll') return 'Staff Salaries & Loans';
  if (pathname === '/admin/store' || pathname === '/admin/pos' || pathname === '/admin/online-store') return 'School Uniform & Books';
  if (pathname === '/admin/behavior' || pathname === '/teacher/behavior' || pathname === '/admin/behavior-skills' || pathname === '/teacher/behavior-skills') return 'Student Behavior';
  if (pathname === '/admin/campus-transfer') return 'Campus Transfer';
  if (pathname === '/admin/events' || pathname === '/teacher/events') return 'School Events';
  if (pathname === '/admin/news-feed') return 'School News Feed';
  if (pathname === '/admin/complaints' || pathname === '/teacher/complaints') return 'Complaints Box';
  if (pathname === '/teacher/counseling') return 'Student Counseling';
  if (pathname === '/admin/consent') return 'Parental Consents';
  if (pathname === '/admin/lost-and-found' || pathname === '/teacher/lost-and-found') return 'Lost & Found';
  if (pathname === '/teacher/planner') return 'Yearly Planner';
  if (pathname.startsWith('/admin/planners')) return 'Timetable & Calendar';
  if (pathname.startsWith('/admin/operations')) return 'School Activities';
  if (pathname === '/admin/counseling') return 'Student Counseling';
  if (pathname === '/admin/control-panel/bulk-import' || pathname === '/admin/bulk-import' || pathname === '/admin/data-migration') return 'Import Excel Data';
  if (pathname === '/admin/transport' || pathname === '/admin/general-settings/transport' || pathname.startsWith('/admin/van-management')) return 'School Transport';
  if (pathname === '/admin/student-portal-preview' || pathname.startsWith('/student')) return 'Student Portal';
  if (pathname === '/admin/messaging' || pathname === '/admin/messaging/chat' || pathname === '/teacher/chat') return 'Staff Chat';
  if (pathname === '/admin/circular' || pathname === '/teacher/circular') return 'Official Circulars';
  if (pathname === '/admin/messaging/sms') return 'SMS Alerts';
  if (pathname === '/admin/messaging/whatsapp') return 'WhatsApp Alerts';
  if (pathname === '/admin/messaging/email') return 'Email Notices';
  if (pathname === '/teacher/feedback') return 'Staff Feedback';
  if (pathname === '/teacher/my-profile' || pathname === '/teacher/update-picture') return 'My Profile';

  const allGroups = getAdminNavItems('Private');
  for (const group of allGroups) {
    const match = group.subItems?.find((sub) => sub.path === pathname);
    if (match) return match.name;
  }
  const last = pathname.split('/').filter(Boolean).pop();
  return last ? last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Dashboard';
};
