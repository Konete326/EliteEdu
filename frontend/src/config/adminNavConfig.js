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
      { name: 'Staff Applicants', path: '/admin/staff-applicants' },
      { name: 'Students', path: '/admin/students' },
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
      { name: 'Audit Log', path: '/admin/reports/audit-log' }
    ]
  },
  {
    type: 'group',
    title: 'Control Panel',
    icon: Sliders,
    subItems: [
      { name: 'General Settings', path: '/admin/settings/general' },
      { name: 'Roles & Permissions', path: '/admin/settings/roles' },
      { name: 'Theme & Appearance', path: '/admin/settings/appearance' },
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
        { name: 'Schools', path: '/superadmin/schools' }
      ]
    }];
  }
  if (user.role === 'Teacher') {
    return [{
      type: 'group',
      title: 'Main',
      icon: LayoutGrid,
      subItems: [
        { name: 'Dashboard', path: '/teacher' },
        { name: 'Attendance', path: '/teacher/attendance' },
        { name: 'Timetable', path: '/teacher/timetable' }
      ]
    }];
  }
  return getAdminNavItems(user.school_type);
};

export const getAllAdminRoutes = () => {
  const allGroups = getAdminNavItems('Private');
  const routes = [];
  allGroups.forEach((group) => {
    group.subItems.forEach((sub) => {
      if (
        sub.path !== '/admin' &&
        sub.path !== '/admin/teachers' &&
        sub.path !== '/admin/campus' &&
        sub.path !== '/admin/subjects' &&
        sub.path !== '/admin/grades' &&
        sub.path !== '/admin/students' &&
        sub.path !== '/admin/staff-applicants'
      ) {
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
  if (pathname === '/admin/staff-applicants') return 'Staff Applicants';
  if (pathname === '/admin/staff-applicants/new') return 'New Applicant';
  if (pathname.startsWith('/admin/staff-applicants/') && pathname.endsWith('/edit')) return 'Edit Applicant';
  if (pathname === '/admin/students') return 'Students';
  if (pathname === '/admin/students/new') return 'Enroll Student';
  if (pathname.startsWith('/admin/students/') && pathname.endsWith('/edit')) return 'Edit Student';
  if (pathname === '/superadmin') return 'Dashboard';
  if (pathname === '/superadmin/schools') return 'Schools';
  if (pathname === '/superadmin/schools/new') return 'New School';
  if (pathname === '/teacher') return 'Dashboard';
  if (pathname === '/teacher/attendance') return 'Attendance';
  if (pathname === '/teacher/timetable') return 'Timetable';
  const allGroups = getAdminNavItems('Private');
  for (const group of allGroups) {
    const match = group.subItems?.find((sub) => sub.path === pathname);
    if (match) return match.name;
  }
  const last = pathname.split('/').filter(Boolean).pop();
  return last ? last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Dashboard';
};
