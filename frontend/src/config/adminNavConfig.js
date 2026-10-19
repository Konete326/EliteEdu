import {
  LayoutGrid, CalendarCheck, DollarSign, Landmark, GraduationCap,
  Users, MessageSquare, Award, Calendar, Bus, BarChart3, Sliders
} from 'lucide-react';

export const getAdminNavItems = (schoolType) => [
  {
    type: 'group',
    title: 'Main',
    icon: LayoutGrid,
    subItems: [
      { name: 'Dashboard', path: '/admin' },
      { name: 'Campus', path: '/admin/campus' },
      { name: 'Campus Transfer', path: '/admin/campus-transfer' },
      { name: 'Grades', path: '/admin/grades' },
      { name: 'Subjects', path: '/admin/subjects' },
      { name: 'Teachers', path: '/admin/teachers' },
      { name: 'Staff Service ID Cards', path: '/admin/teachers/id-cards' },
      { name: 'Staff Applicants', path: '/admin/staff-applicants' },
      { name: 'Students', path: '/admin/students' },
      { name: 'Admission Letter', path: '/admin/students/admission-letter' },
      { name: 'Student ID Cards', path: '/admin/students/id-cards' },
      { name: 'Certificates Studio', path: '/admin/certificates' },
      { name: 'Certificate Templates', path: '/admin/certificates/templates' },
      { name: 'Promote Students', path: '/admin/students/promote' },
      { name: 'Campus Operations Hub', path: '/admin/events' },
      { name: 'Behavior & Skills Assessment', path: '/admin/behavior-skills' },
      { name: 'Student Portal Preview', path: '/admin/student-portal-preview' }
    ]
  },
  {
    type: 'group',
    title: 'Attendance',
    icon: CalendarCheck,
    subItems: [
      { name: 'Student Attendance', path: '/admin/attendance/students' },
      { name: 'Staff Attendance', path: '/admin/attendance/staff' },
      { name: 'Leave Request', path: '/admin/attendance/leave-request' },
      { name: 'Attendance Report', path: '/admin/attendance/report' }
    ]
  },
  ...(schoolType === 'Private' ? [
    {
      type: 'group',
      title: 'Fee Management',
      icon: DollarSign,
      subItems: [
        { name: 'Fee Collection', path: '/admin/fees/collection' },
        { name: 'Fee Structure', path: '/admin/fees/structure' },
        { name: 'Defaulters List', path: '/admin/fees/defaulters' },
        { name: 'Fee Reports', path: '/admin/fees/reports' },
        { name: 'Fee Concession', path: '/admin/fees/concession' }
      ]
    },
    {
      type: 'group',
      title: 'Accounts',
      icon: Landmark,
      subItems: [
        { name: 'Chart of Accounts', path: '/admin/accounts/chart' },
        { name: 'Income', path: '/admin/accounts/income' },
        { name: 'Expenses', path: '/admin/accounts/expenses' },
        { name: 'Transactions', path: '/admin/accounts/transactions' },
        { name: 'Balance Sheet', path: '/admin/accounts/balance-sheet' },
        { name: 'Staff Payroll & Loans', path: '/admin/payroll' },
        { name: 'Bookstore & POS', path: '/admin/store' }
      ]
    }
  ] : []),
  {
    type: 'group',
    title: 'LMS Academic Suite',
    icon: GraduationCap,
    subItems: [
      { name: 'LMS Digital Studio', path: '/admin/lms/courses' }
    ]
  },
  {
    type: 'group',
    title: 'CRM',
    icon: Users,
    subItems: [
      { name: 'Inquiries', path: '/admin/crm/inquiries' },
      { name: 'Admissions Pipeline', path: '/admin/crm/admissions' },
      { name: 'Follow-ups', path: '/admin/crm/follow-ups' },
      { name: 'Lead Analytics', path: '/admin/crm/analytics' }
    ]
  },
  {
    type: 'group',
    title: 'Messaging',
    icon: MessageSquare,
    subItems: [
      { name: 'Notification Center', path: '/admin/notifications' },
      { name: 'Internal Messenger & Chat', path: '/admin/messaging/chat' }
    ]
  },
  {
    type: 'group',
    title: 'Exam Management',
    icon: Award,
    subItems: [
      { name: 'Exam Categories', path: '/admin/exam-management/categories' },
      { name: 'Grading Policies', path: '/admin/exam-management/grading-policies' },
      { name: 'Remarks Policy', path: '/admin/exam-management/remarks-policy' },
      { name: 'Date Sheet', path: '/admin/exam-management/schedule' },
      { name: 'Manage Remarks', path: '/admin/exam-management/manage-remarks' },
      { name: 'Mark Sheets', path: '/admin/exam-management/mark-sheets' },
      { name: 'Question Papers', path: '/admin/question-papers' }
    ]
  },
  {
    type: 'group',
    title: 'Planners',
    icon: Calendar,
    subItems: [
      { name: 'Smart Timetable', path: '/admin/timetable' },
      { name: 'Academic Calendar & Events', path: '/admin/events' }
    ]
  },
  {
    type: 'group',
    title: 'Van Management',
    icon: Bus,
    subItems: [
      { name: 'Transport & Fleet Studio', path: '/admin/transport' },
      { name: 'Van Allocation & Roster', path: '/admin/van-management' }
    ]
  },
  {
    type: 'group',
    title: 'Reports',
    icon: BarChart3,
    subItems: [
      { name: 'Master Reports Hub', path: '/admin/reports' },
      { name: 'Students Info Report', path: '/admin/reports/student-info' },
      { name: 'Parents Contact Report', path: '/admin/reports/parent-info' },
      { name: 'Staff & HR Report', path: '/admin/reports/staff-info' },
      { name: 'Attendance Report', path: '/admin/attendance/report' },
      { name: 'Students Report Card', path: '/admin/reports/report-cards' },
      { name: 'Audit & System Logs', path: '/admin/reports/audit-logs' }
    ]
  },
  {
    type: 'group',
    title: 'Control Panel',
    icon: Sliders,
    subItems: [
      { name: 'General Settings', path: '/admin/settings/general' },
      { name: 'Digital Signatures & Stamps', path: '/admin/general-settings/signatures' },
      { name: 'Roles & Permissions', path: '/admin/settings/roles' },
      { name: 'User Management', path: '/admin/control-panel/user-management' },
      { name: 'Class Transfer', path: '/admin/control-panel/class-transfer' },
      { name: 'Theme & Branding', path: '/admin/control-panel/branding' },
      { name: 'Bulk Data Import', path: '/admin/control-panel/bulk-import' },
      { name: 'Backup & Logs', path: '/admin/settings/backup' }
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
        { name: 'System & Error Logs', path: '/superadmin/logs' }
      ]
    }];
  }

  const customRole = user?.custom_role_id || user?.custom_role;
  const rawPerms = user?.permissions || customRole?.permissions;

  if (Array.isArray(rawPerms) && rawPerms.length > 0) {
    const allowed = new Set(rawPerms.filter((p) => p.view).map((p) => p.module_key?.toLowerCase()));
    const groups = [];

    const mainSub = [
      { name: 'Dashboard', path: user.role === 'Teacher' ? '/teacher' : '/admin' }
    ];

    if (allowed.has('campus')) mainSub.push({ name: 'Campus', path: '/admin/campus' });
    if (allowed.has('grades')) mainSub.push({ name: 'Grades', path: '/admin/grades' });
    if (allowed.has('subjects')) mainSub.push({ name: 'Subjects', path: '/admin/subjects' });
    if (allowed.has('teachers')) mainSub.push({ name: 'Teachers', path: '/admin/teachers' });
    if (allowed.has('students')) mainSub.push({ name: 'Students', path: '/admin/students' });
    if (allowed.has('student_promotion')) mainSub.push({ name: 'Promote Students', path: '/admin/students/promote' });
    if (allowed.has('admission_letter')) mainSub.push({ name: 'Admission Letter', path: '/admin/students/admission-letter' });
    if (allowed.has('student_id_cards')) mainSub.push({ name: 'Student ID Cards', path: '/admin/students/id-cards' });
    if (allowed.has('teacher_id_cards')) mainSub.push({ name: 'Staff Service ID Cards', path: '/admin/teachers/id-cards' });
    if (allowed.has('certificates')) {
      mainSub.push({ name: 'Certificates Studio', path: '/admin/certificates' });
      mainSub.push({ name: 'Certificate Templates', path: '/admin/certificates/templates' });
    }
    if (allowed.has('student_portal')) mainSub.push({ name: 'Student Portal Preview', path: '/admin/student-portal-preview' });
    if (allowed.has('transport')) mainSub.push({ name: 'Transport & Fleet', path: '/admin/transport' });
    if (user.role === 'Teacher') mainSub.push({ name: 'My Profile', path: '/teacher/profile' });

    groups.push({
      type: 'group',
      title: customRole?.name ? customRole.name : 'Main',
      icon: LayoutGrid,
      subItems: mainSub
    });

    if (allowed.has('fees')) {
      groups.push({
        type: 'group',
        title: 'Fee Management',
        icon: DollarSign,
        subItems: [
          { name: 'Fee Collection', path: '/admin/fees/collection' },
          { name: 'Fee Structure', path: '/admin/fees/structure' },
          { name: 'Defaulters List', path: '/admin/fees/defaulters' },
          { name: 'Fee Reports', path: '/admin/fees/reports' },
          { name: 'Fee Concession', path: '/admin/fees/concession' }
        ]
      });
    }

    if (allowed.has('accounts') || allowed.has('payroll')) {
      groups.push({
        type: 'group',
        title: 'Accounts',
        icon: Landmark,
        subItems: [
          { name: 'Chart of Accounts', path: '/admin/accounts/chart' },
          { name: 'Income', path: '/admin/accounts/income' },
          { name: 'Expenses', path: '/admin/accounts/expenses' },
          { name: 'Transactions', path: '/admin/accounts/transactions' },
          { name: 'Balance Sheet', path: '/admin/accounts/balance-sheet' },
          { name: 'Staff Payroll & Loans', path: '/admin/payroll' }
        ]
      });
    }

    if (allowed.has('attendance')) {
      groups.push({
        type: 'group',
        title: 'Attendance',
        icon: CalendarCheck,
        subItems: [
          { name: 'Student Attendance', path: '/admin/attendance/students' },
          { name: 'Staff Attendance', path: '/admin/attendance/staff' },
          { name: 'Employees Attendance', path: '/admin/attendance/employees' },
          { name: 'Attendance Report', path: '/admin/attendance/report' }
        ]
      });
    }

    if (allowed.has('exams') || allowed.has('grading_policies')) {
      const examSubs = [];
      if (allowed.has('exams')) {
        examSubs.push({ name: 'Examinations', path: '/admin/exam-management/exams' });
        examSubs.push({ name: 'Manage Class Tests', path: '/admin/class-tests/manage' });
        examSubs.push({ name: 'Exam Schedules', path: '/admin/exams/schedules' });
        examSubs.push({ name: 'Date Sheets', path: '/admin/exams/date-sheets' });
        examSubs.push({ name: 'Marks Entry', path: '/admin/exams/marks' });
      }
      if (allowed.has('grading_policies')) {
        examSubs.push({ name: 'Exam Grading', path: '/admin/exam-management/grading-policies' });
      }
      groups.push({
        type: 'group',
        title: 'Exam Management',
        icon: Award,
        subItems: examSubs
      });
    }

    if (allowed.has('reports') || allowed.has('student_reports') || allowed.has('parent_reports') || allowed.has('report_cards')) {
      const repSubs = [
        { name: 'Master Reports Hub', path: '/admin/reports' }
      ];
      if (allowed.has('student_reports') || allowed.has('reports')) repSubs.push({ name: 'Students Info Report', path: '/admin/reports/student-info' });
      if (allowed.has('parent_reports') || allowed.has('reports')) repSubs.push({ name: 'Parents Contact Report', path: '/admin/reports/parent-info' });
      if (allowed.has('staff') || allowed.has('reports')) repSubs.push({ name: 'Staff & HR Report', path: '/admin/reports/staff-info' });
      if (allowed.has('attendance') || allowed.has('reports')) repSubs.push({ name: 'Attendance Report', path: '/admin/attendance/report' });
      if (allowed.has('report_cards') || allowed.has('reports')) repSubs.push({ name: 'Students Report Card', path: '/admin/reports/report-cards' });
      repSubs.push({ name: 'Audit & System Logs', path: '/admin/reports/audit-logs' });
      groups.push({
        type: 'group',
        title: 'Reports',
        icon: BarChart3,
        subItems: repSubs
      });
    }

    if (allowed.has('control_panel') || allowed.has('user_management') || allowed.has('bulk_migration')) {
      const cpSubs = [];
      if (allowed.has('control_panel') || allowed.has('bulk_migration')) {
        cpSubs.push({ name: 'General Settings', path: '/admin/settings/general' });
        cpSubs.push({ name: 'Digital Signatures & Stamps', path: '/admin/general-settings/signatures' });
        cpSubs.push({ name: 'Theme & Branding', path: '/admin/control-panel/branding' });
        cpSubs.push({ name: 'Bulk Data Migration', path: '/admin/control-panel/bulk-import' });
      }
      if (allowed.has('user_management')) {
        cpSubs.push({ name: 'User Management', path: '/admin/control-panel/user-management' });
        cpSubs.push({ name: 'Roles & Permissions', path: '/admin/settings/roles' });
      }
      groups.push({
        type: 'group',
        title: 'Control Panel',
        icon: Sliders,
        subItems: cpSubs
      });
    }

    return groups;
  }

  if (user.role === 'Teacher') {
    const permissions = user.app_settings || user.app_permissions || {};
    const eff = user.effective_permissions || {};
    const has = (key, fallback = true) => {
      if (eff[key]?.view !== undefined) return Boolean(eff[key].view);
      return permissions[key] !== undefined ? permissions[key] !== false : fallback;
    };
    const subItems = [{ name: 'Dashboard', path: '/teacher' }];
    if (has('students')) subItems.push({ name: 'My Students', path: '/teacher/students' });
    if (has('attendance')) subItems.push({ name: 'Attendance', path: '/teacher/attendance' });
    if (has('homework')) subItems.push({ name: 'Homework', path: '/teacher/homework' });
    if (has('examination') || has('exams') || permissions.exam_management) subItems.push({ name: 'Examinations', path: '/teacher/exams' });
    if (has('timetable')) subItems.push({ name: 'Timetable', path: '/teacher/timetable' });
    if (has('quizzes')) subItems.push({ name: 'Quizzes', path: '/teacher/quizzes' });
    if (has('lectures')) subItems.push({ name: 'Lectures', path: '/teacher/lectures' });
    if (has('online_classes')) subItems.push({ name: 'Online Classes', path: '/teacher/online-classes' });
    if (has('datesheet')) subItems.push({ name: 'Date Sheet', path: '/teacher/datesheet' });
    if (has('salary')) subItems.push({ name: 'My Salary', path: '/teacher/salary' });
    if (has('my_profile')) subItems.push({ name: 'My Profile', path: '/teacher/profile' });
    if (has('student_promotion', false) || permissions.class_transfer) subItems.push({ name: 'Promote Students', path: '/admin/students/promote' });
    if (has('admission_letter', false)) subItems.push({ name: 'Admission Letters', path: '/admin/students/admission-letter' });
    if (has('student_id_cards', false)) subItems.push({ name: 'Student ID Cards', path: '/admin/students/id-cards' });
    if (has('teacher_id_cards', false)) subItems.push({ name: 'Staff ID Cards', path: '/admin/teachers/id-cards' });
    if (has('grading_policies', false)) subItems.push({ name: 'Grading Policies', path: '/admin/exam-management/grading-policies' });
    if (has('class_tests')) subItems.push({ name: 'Class Tests', path: '/teacher/class-tests' });
    if (has('question_papers')) subItems.push({ name: 'Question Papers', path: '/teacher/question-papers' });
    if (has('certificates', false)) subItems.push({ name: 'Certificates Studio', path: '/admin/certificates' });
    if (has('behavior')) subItems.push({ name: 'Behavior & Skills', path: '/teacher/behavior' });
    if (has('events')) subItems.push({ name: 'Events', path: '/teacher/events' });
    if (has('complaints')) subItems.push({ name: 'Complaints', path: '/teacher/complaints' });
    if (has('counseling')) subItems.push({ name: 'Counseling', path: '/teacher/counseling' });
    if (has('planner')) subItems.push({ name: 'Academic Planner', path: '/teacher/planner' });
    if (has('lost_and_found')) subItems.push({ name: 'Lost & Found', path: '/teacher/lost-and-found' });

    return [{
      type: 'group',
      title: 'Teacher Portal',
      icon: LayoutGrid,
      subItems
    }];
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
    '/admin/settings/general', '/admin/general-settings/signatures',
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
    '/admin/messaging', '/admin/messaging/chat', '/admin/messaging/sms', '/admin/messaging/whatsapp', '/admin/messaging/email',
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
  if (pathname === '/admin') return 'Dashboard';
  if (pathname === '/admin/campus') return 'Campus Management';
  if (pathname === '/admin/subjects') return 'Subjects';
  if (pathname === '/admin/grades') return 'Grades & Sections';
  if (pathname === '/admin/teachers') return 'Teachers';
  if (pathname === '/admin/teachers/new') return 'Add Teacher';
  if (pathname.startsWith('/admin/teachers/') && pathname.endsWith('/edit')) return 'Edit Teacher';
  if (pathname === '/admin/teachers/id-cards') return 'Staff Service ID Cards';
  if (pathname === '/admin/staff-applicants') return 'Staff Applicants';
  if (pathname === '/admin/staff-applicants/new') return 'New Applicant';
  if (pathname.startsWith('/admin/staff-applicants/') && pathname.endsWith('/edit')) return 'Edit Applicant';
  if (pathname === '/admin/students') return 'Students';
  if (pathname === '/admin/students/new') return 'Enroll Student';
  if (pathname.startsWith('/admin/students/') && pathname.endsWith('/edit')) return 'Edit Student';
  if (pathname === '/admin/students/admission-letter') return 'Admission Letter';
  if (pathname === '/admin/students/id-cards') return 'Student ID Cards';
  if (pathname === '/admin/fees' || pathname === '/admin/fees/collection') return 'Fee Collection Counter';
  if (pathname === '/admin/fees/structure') return 'Fee Structure Studio';
  if (pathname === '/admin/fees/defaulters') return 'Fee Defaulters & Recovery';
  if (pathname === '/admin/fees/reports') return 'Fee Reports & Ledger';
  if (pathname === '/admin/fees/concession') return 'Fee Concessions & Scholarships';
  if (pathname === '/admin/settings/appearance' || pathname === '/admin/control-panel/branding') return 'Theme & Appearance';
  if (pathname === '/admin/exam-management/grading-policies' || pathname === '/admin/exams/grading-policies') return 'Exam Grading';
  if (pathname === '/admin/exam-management/categories') return 'Exam Categories';
  if (pathname === '/admin/exam-management/remarks-policy') return 'Remarks Policy';
  if (pathname === '/admin/exam-management/schedule') return 'Datesheets';
  if (pathname === '/admin/exam-management/schedule/new') return 'New Datesheet';
  if (pathname === '/admin/exam-management/manage-remarks') return 'Manage Remarks';
  if (pathname === '/admin/exam-management/mark-sheets') return 'Mark Sheets';
  if (pathname === '/admin/question-papers') return 'Question Papers Studio';
  if (pathname === '/admin/exam-management/exams' || pathname === '/admin/exams/schedules' || pathname === '/admin/exams/date-sheets' || pathname === '/admin/exams/marks' || pathname === '/teacher/exams' || pathname === '/teacher/examination' || pathname === '/teacher/datesheet') return 'Examinations & Assessments';
  if (pathname === '/admin/exam-management/exams/new') return 'Exam Setup Wizard';
  if (pathname.startsWith('/admin/exam-management/exams/') && pathname.endsWith('/edit')) return 'Edit Exam';
  if (pathname === '/admin/class-tests/manage' || pathname === '/teacher/class-tests') return 'Manage Class Tests & Marks';
  if (pathname === '/admin/class-tests/results') return 'Test Results & Reports';
  if (pathname === '/admin/profile' || pathname === '/superadmin/profile' || pathname === '/teacher/profile') return 'My Profile';
  if (pathname === '/superadmin') return 'Dashboard';
  if (pathname === '/superadmin/schools') return 'Schools';
  if (pathname === '/superadmin/schools/new') return 'New School';
  if (pathname === '/superadmin/logs' || pathname === '/admin/reports/audit-logs' || pathname === '/admin/reports/audit-log') return 'System Telemetry & Audit Logs';
  if (pathname === '/admin/reports' || pathname === '/admin/reports/academic') return 'Master Reports Studio';
  if (pathname === '/admin/reports/report-cards') return 'Student Report Card Studio';
  if (pathname === '/admin/reports/student-info') return 'Student Admission & Info Report';
  if (pathname === '/admin/reports/parent-info') return 'Parent & Student Contact Report';
  if (pathname === '/admin/reports/staff-info') return 'Staff & Faculty Master Directory Report';
  if (pathname === '/admin/certificates') return 'Certificates Studio';
  if (pathname === '/admin/certificates/templates') return 'Certificate Templates Studio';
  if (pathname === '/admin/students/promote' || pathname === '/admin/control-panel/class-transfer') return 'Promote Students & Class Transfer';
  if (pathname === '/admin/control-panel/user-management') return 'User Management';
  if (pathname === '/admin/settings/roles' || pathname === '/admin/control-panel/roles' || pathname === '/admin/roles') return 'Roles & Permissions';
  if (pathname === '/admin/notifications' || pathname === '/admin/messaging/notifications' || pathname === '/admin/circular' || pathname === '/teacher/notifications' || pathname === '/superadmin/notifications') return 'Notification Center & Broadcasts';
  if (pathname === '/admin/general-settings/signatures' || pathname === '/admin/settings/signatures') return 'Digital Signatures & Stamps Studio';
  if (pathname === '/admin/attendance/students') return 'Student Attendance';
  if (pathname === '/admin/attendance/staff' || pathname === '/admin/attendance/employees') return 'Staff Attendance';
  if (pathname === '/admin/attendance/leave-request' || pathname === '/teacher/leaves') return 'Leave Request Engine';
  if (pathname === '/admin/attendance/report' || pathname === '/admin/reports/attendance-report' || pathname === '/admin/reports/attendance' || pathname === '/teacher/attendance-report') return 'Attendance Report & Monthly Register';
  if (pathname === '/teacher') return 'Faculty Dashboard';
  if (pathname === '/teacher/students') return 'My Classes & Students';
  if (pathname === '/teacher/attendance') return 'Attendance';
  if (pathname === '/teacher/homework') return 'Homework';
  if (pathname === '/teacher/examination') return 'Examination';
  if (pathname === '/teacher/timetable') return 'Timetable';
  if (pathname === '/teacher/quizzes') return 'Quizzes';
  if (pathname === '/teacher/lectures') return 'Lectures';
  if (pathname === '/teacher/online-classes') return 'Online Classes';
  if (pathname === '/teacher/datesheet') return 'Date Sheet';
  if (pathname === '/teacher/salary') return 'My Salary & Compensation';
  if (pathname.startsWith('/admin/accounts')) return 'Accounts & Bookkeeping';
  if (pathname === '/admin/payroll') return 'Staff Payroll & Benefits';
  if (pathname === '/admin/store' || pathname === '/admin/pos' || pathname === '/admin/online-store') return 'Bookstore & POS Terminal';
  if (pathname === '/admin/behavior' || pathname === '/teacher/behavior' || pathname === '/admin/behavior-skills' || pathname === '/teacher/behavior-skills') return 'Affective & Psychomotor Behavior Studio';
  if (pathname === '/admin/campus-transfer') return 'Inter-Campus Transfer & Branch Reallocation';
  if (pathname === '/admin/events' || pathname === '/teacher/events') return 'Campus Operations & Events';
  if (pathname === '/admin/news-feed') return 'Institutional News Feed';
  if (pathname === '/admin/complaints' || pathname === '/teacher/complaints') return 'Complaints & Redressal Desk';
  if (pathname === '/teacher/counseling') return 'Student Counseling & Well-being';
  if (pathname === '/admin/consent') return 'Parental Consent & Circulars';
  if (pathname === '/admin/lost-and-found' || pathname === '/teacher/lost-and-found') return 'Lost & Found Desk';
  if (pathname === '/teacher/planner') return 'Academic Lesson Planner';
  if (pathname.startsWith('/admin/planners')) return 'Academic Lesson Planners & School Events';
  if (pathname.startsWith('/admin/operations')) return 'Campus Operations & Student Welfare';
  if (pathname === '/admin/counseling') return 'Student Counseling & Well-being';
  if (pathname === '/admin/control-panel/bulk-import' || pathname === '/admin/bulk-import' || pathname === '/admin/data-migration') return 'Bulk Data Import & Migration Hub';
  if (pathname === '/admin/transport' || pathname === '/admin/general-settings/transport' || pathname.startsWith('/admin/van-management')) return 'School Transport & Fleet Management';
  if (pathname === '/admin/student-portal-preview' || pathname.startsWith('/student')) return 'Student & Parent Portal';
  if (pathname === '/admin/messaging' || pathname === '/admin/messaging/chat' || pathname === '/teacher/chat') return 'Internal Staff Messenger';
  if (pathname === '/admin/circular' || pathname === '/teacher/circular') return 'Official Circulars & Memos';
  if (pathname === '/admin/messaging/sms') return 'SMS Broadcast Communications';
  if (pathname === '/admin/messaging/whatsapp') return 'WhatsApp Alerts Studio';
  if (pathname === '/admin/messaging/email') return 'Email Notification Center';
  if (pathname === '/teacher/feedback') return 'Staff Feedback & Suggestions';
  if (pathname === '/teacher/my-profile' || pathname === '/teacher/update-picture') return 'Teacher Profile Settings';

  const allGroups = getAdminNavItems('Private');
  for (const group of allGroups) {
    const match = group.subItems?.find((sub) => sub.path === pathname);
    if (match) return match.name;
  }
  const last = pathname.split('/').filter(Boolean).pop();
  return last ? last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Dashboard';
};
