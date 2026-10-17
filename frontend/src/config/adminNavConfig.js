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
      { name: 'Promote Students', path: '/admin/students/promote' },
      { name: 'Online Classes', path: '/admin/online-classes' },
      { name: 'News Feed', path: '/admin/news-feed' },
      { name: 'Consent', path: '/admin/consent' },
      { name: 'Circular', path: '/admin/circular' },
      { name: 'Complaints', path: '/admin/complaints' },
      { name: 'Lost & Found', path: '/admin/lost-and-found' },
      { name: 'Events', path: '/admin/events' }
    ]
  },
  {
    type: 'group',
    title: 'Attendance',
    icon: CalendarCheck,
    subItems: [
      { name: 'Student Attendance', path: '/admin/attendance/students' },
      { name: 'Employees Attendance', path: '/admin/attendance/employees' },
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
        { name: 'Fee Structure', path: '/admin/fees/structure' },
        { name: 'Fee Collection', path: '/admin/fees/collection' },
        { name: 'Fee Concession', path: '/admin/fees/concession' },
        { name: 'Defaulters List', path: '/admin/fees/defaulters' },
        { name: 'Fee Reports', path: '/admin/fees/reports' }
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
        { name: 'Balance Sheet', path: '/admin/accounts/balance-sheet' }
      ]
    }
  ] : []),
  {
    type: 'group',
    title: 'LMS',
    icon: GraduationCap,
    subItems: [
      { name: 'Courses', path: '/admin/lms/courses' },
      { name: 'Lessons & Syllabus', path: '/admin/lms/syllabus' },
      { name: 'Assignments', path: '/admin/lms/assignments' },
      { name: 'Study Material', path: '/admin/lms/material' },
      { name: 'Live Lectures', path: '/admin/lms/live' }
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
      { name: 'Chat', path: '/admin/messaging/chat' },
      { name: 'SMS Broadcast', path: '/admin/messaging/sms' },
      { name: 'WhatsApp Alerts', path: '/admin/messaging/whatsapp' },
      { name: 'Email Notifications', path: '/admin/messaging/email' }
    ]
  },
  {
    type: 'group',
    title: 'Exam Management',
    icon: Award,
    subItems: [
      { name: 'Exam Grading', path: '/admin/exam-management/grading-policies' },
      { name: 'Exam Schedules', path: '/admin/exams/schedules' },
      { name: 'Date Sheets', path: '/admin/exams/date-sheets' },
      { name: 'Marks Entry', path: '/admin/exams/marks' },
      { name: 'Report Cards', path: '/admin/exams/report-cards' },
      { name: 'Question Papers', path: '/admin/exams/question-papers' }
    ]
  },
  {
    type: 'group',
    title: 'Planners',
    icon: Calendar,
    subItems: [
      { name: 'Academic Calendar', path: '/admin/planners/academic-calendar' },
      { name: 'Timetable', path: '/admin/planners/timetable' },
      { name: 'Lesson Plans', path: '/admin/planners/lesson-plans' },
      { name: 'Activity Planner', path: '/admin/planners/activity-planner' }
    ]
  },
  {
    type: 'group',
    title: 'Van Management',
    icon: Bus,
    subItems: [
      { name: 'Routes', path: '/admin/van/routes' },
      { name: 'Vehicles', path: '/admin/van/vehicles' },
      { name: 'Drivers', path: '/admin/van/drivers' },
      { name: 'Student Allocation', path: '/admin/van/allocation' }
    ]
  },
  {
    type: 'group',
    title: 'Reports',
    icon: BarChart3,
    subItems: [
      { name: 'Academic Reports', path: '/admin/reports/academic' },
      { name: 'Financial Reports', path: '/admin/reports/financial' },
      { name: 'Attendance Summary', path: '/admin/reports/attendance' },
      { name: 'Audit Logs', path: '/admin/reports/audit-logs' }
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
  if (user.role === 'Teacher') {
    const permissions = user.app_settings || user.app_permissions || {};
    const subItems = [{ name: 'Dashboard', path: '/teacher' }];
    if (permissions.students !== false) subItems.push({ name: 'My Students', path: '/teacher/students' });
    if (permissions.attendance !== false) subItems.push({ name: 'Attendance', path: '/teacher/attendance' });
    if (permissions.homework !== false) subItems.push({ name: 'Homework', path: '/teacher/homework' });
    if (permissions.examination !== false) subItems.push({ name: 'Examination', path: '/teacher/examination' });
    if (permissions.timetable !== false) subItems.push({ name: 'Timetable', path: '/teacher/timetable' });
    if (permissions.quizzes !== false) subItems.push({ name: 'Quizzes', path: '/teacher/quizzes' });
    if (permissions.lectures !== false) subItems.push({ name: 'Lectures', path: '/teacher/lectures' });
    if (permissions.online_classes !== false) subItems.push({ name: 'Online Classes', path: '/teacher/online-classes' });
    if (permissions.datesheet !== false) subItems.push({ name: 'Date Sheet', path: '/teacher/datesheet' });
    if (permissions.salary !== false) subItems.push({ name: 'My Salary', path: '/teacher/salary' });
    if (permissions.my_profile !== false) subItems.push({ name: 'My Profile', path: '/teacher/profile' });
    if (permissions.student_promotion || permissions.class_transfer) subItems.push({ name: 'Promote Students', path: '/admin/students/promote' });
    if (permissions.admission_letter) subItems.push({ name: 'Admission Letters', path: '/admin/students/admission-letter' });
    if (permissions.student_id_cards) subItems.push({ name: 'Student ID Cards', path: '/admin/students/id-cards' });
    if (permissions.teacher_id_cards) subItems.push({ name: 'Staff ID Cards', path: '/admin/teachers/id-cards' });
    if (permissions.grading_policies) subItems.push({ name: 'Grading Policies', path: '/admin/exam-management/grading-policies' });

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
    '/admin/settings/appearance', '/admin/control-panel/branding', '/admin/reports/audit-logs',
    '/admin/reports/audit-log', '/admin/students/promote', '/admin/control-panel/class-transfer',
    '/admin/control-panel/user-management', '/admin/settings/roles', '/admin/control-panel/roles', '/admin/roles',
    '/admin/notifications', '/admin/messaging/notifications', '/admin/circular', '/teacher/notifications', '/superadmin/notifications',
    '/admin/settings/general', '/admin/general-settings/signatures',
    '/admin/settings/signatures', '/admin/attendance/students', '/admin/attendance/staff',
    '/admin/attendance/employees'
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
  if (pathname === '/admin/settings/appearance' || pathname === '/admin/control-panel/branding') return 'Theme & Appearance';
  if (pathname === '/admin/exam-management/grading-policies' || pathname === '/admin/exams/grading-policies') return 'Exam Grading';
  if (pathname === '/admin/profile' || pathname === '/superadmin/profile' || pathname === '/teacher/profile') return 'My Profile';
  if (pathname === '/superadmin') return 'Dashboard';
  if (pathname === '/superadmin/schools') return 'Schools';
  if (pathname === '/superadmin/schools/new') return 'New School';
  if (pathname === '/superadmin/logs' || pathname === '/admin/reports/audit-logs' || pathname === '/admin/reports/audit-log') return 'System Telemetry & Audit Logs';
  if (pathname === '/admin/students/promote' || pathname === '/admin/control-panel/class-transfer') return 'Promote Students & Class Transfer';
  if (pathname === '/admin/control-panel/user-management') return 'User Management';
  if (pathname === '/admin/settings/roles' || pathname === '/admin/control-panel/roles' || pathname === '/admin/roles') return 'Roles & Permissions';
  if (pathname === '/admin/notifications' || pathname === '/admin/messaging/notifications' || pathname === '/admin/circular' || pathname === '/teacher/notifications' || pathname === '/superadmin/notifications') return 'Notification Center & Broadcasts';
  if (pathname === '/admin/general-settings/signatures' || pathname === '/admin/settings/signatures') return 'Digital Signatures & Stamps Studio';
  if (pathname === '/admin/attendance/students') return 'Student Attendance';
  if (pathname === '/admin/attendance/staff' || pathname === '/admin/attendance/employees') return 'Staff Attendance';
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
  if (pathname === '/teacher/salary') return 'My Salary';
  const allGroups = getAdminNavItems('Private');
  for (const group of allGroups) {
    const match = group.subItems?.find((sub) => sub.path === pathname);
    if (match) return match.name;
  }
  const last = pathname.split('/').filter(Boolean).pop();
  return last ? last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Dashboard';
};
