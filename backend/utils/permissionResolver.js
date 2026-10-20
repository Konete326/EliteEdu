const ALL_APP_KEYS = [
  'attendance', 'homework', 'examination', 'students', 'timetable',
  'quizzes', 'lectures', 'online_classes', 'planner', 'datesheet',
  'salary', 'events', 'complaints', 'feedback', 'counseling',
  'lost_and_found', 'resources', 'my_profile', 'update_picture',
  'student_promotion', 'class_tests', 'question_papers', 'certificates',
  'reports', 'student_reports', 'parent_reports', 'report_cards', 'attendance_reports', 'exam_reports', 'leave_requests',
  'crm', 'crm_inquiries', 'crm_pipeline', 'crm_followups', 'crm_analytics', 'fees', 'accounts', 'payroll',
  'lms', 'courses', 'syllabus', 'store_pos', 'pos_store', 'behavior', 'campus_transfer', 'operations', 'news_feed', 'consent',
  'bulk_migration', 'bulk_import', 'transport', 'student_portal', 'messenger', 'messaging', 'circular', 'behavior_skills', 'van_management'
];

const MODULE_KEY_MAP = {
  attendance: ['attendance'], homework: ['homework', 'lms'], examination: ['exams', 'examination'],
  datesheet: ['exams', 'datesheet'], quizzes: ['exams', 'quizzes', 'lms'], students: ['students'],
  student_promotion: ['student_promotion', 'students'], class_tests: ['class_tests', 'exams'],
  question_papers: ['question_papers', 'exams'], certificates: ['certificates'], timetable: ['timetable'],
  lectures: ['lectures', 'lms'], online_classes: ['online_classes', 'lms'], planner: ['planner', 'operations'], salary: ['salary', 'fees', 'payroll'],
  fees: ['fees', 'salary'], accounts: ['accounts', 'store_pos', 'pos_store'], payroll: ['payroll', 'salary'],
  lms: ['lms', 'homework', 'lectures', 'quizzes', 'online_classes'], courses: ['lms', 'courses'], syllabus: ['lms', 'syllabus'],
  store_pos: ['store_pos', 'pos_store', 'accounts'], pos_store: ['pos_store', 'store_pos', 'accounts'], behavior: ['behavior', 'students'], behavior_skills: ['behavior', 'students'],
  campus_transfer: ['campus_transfer', 'campus', 'students'], operations: ['operations', 'events', 'complaints'],
  news_feed: ['news_feed', 'operations'], consent: ['consent', 'operations'], bulk_migration: ['control_panel', 'bulk_migration'],
  bulk_import: ['control_panel', 'bulk_migration'],
  transport: ['transport', 'operations'], van_management: ['transport', 'operations'], student_portal: ['students', 'student_portal'],
  messenger: ['messenger', 'messaging', 'operations'], messaging: ['messaging', 'messenger', 'operations'], circular: ['circular', 'operations'],
  events: ['events', 'operations'], complaints: ['complaints', 'operations'], feedback: ['feedback', 'operations'], counseling: ['counseling', 'operations'],
  lost_and_found: ['lost_and_found', 'operations'], resources: ['resources', 'subjects'], my_profile: ['my_profile'],
  update_picture: ['update_picture'], reports: ['reports'], student_reports: ['reports', 'students'],
  parent_reports: ['reports', 'students'], report_cards: ['reports', 'exams', 'students'],
  attendance_reports: ['reports', 'attendance', 'attendance_reports'], leave_requests: ['attendance', 'leave_requests'],
  exam_reports: ['reports', 'exams'], crm: ['crm'], crm_inquiries: ['crm', 'crm_inquiries'],
  crm_pipeline: ['crm', 'crm_pipeline'], crm_followups: ['crm', 'crm_followups'], crm_analytics: ['crm', 'crm_analytics']
};

const resolveEffectivePermissions = (user) => {
  const customRole = user?.custom_role_id || user?.custom_role;
  const rolePerms = Array.isArray(customRole?.permissions) ? customRole.permissions : [];
  const appPerms = user?.app_settings || user?.app_permissions || {};

  const effective = {};
  const appSettings = {};

  rolePerms.forEach((p) => {
    if (p && p.module_key) {
      effective[p.module_key.toLowerCase()] = {
        view: Boolean(p.view),
        add: Boolean(p.add),
        edit: Boolean(p.edit),
        delete: Boolean(p.delete),
        filter: Boolean(p.filter),
        reports: Boolean(p.reports)
      };
    }
  });

  ALL_APP_KEYS.forEach((key) => {
    const directVal = appPerms[key];
    const mappedModules = MODULE_KEY_MAP[key] || [key];
    const hasRoleView = mappedModules.some((m) => effective[m]?.view === true);

    if (rolePerms.length > 0) {
      appSettings[key] = hasRoleView || directVal === true;
    } else {
      appSettings[key] = directVal !== false;
    }

    if (!effective[key]) {
      effective[key] = {
        view: appSettings[key],
        add: appSettings[key],
        edit: appSettings[key],
        delete: user?.role === 'Admin',
        filter: appSettings[key],
        reports: appSettings[key]
      };
    }
  });

  return { effective, appSettings };
};

const syncUserPermissions = (userData) => {
  const result = { ...userData };
  const customRole = result.custom_role_id;
  const perms = Array.isArray(customRole?.permissions) ? customRole.permissions : [];

  const appSettings = { ...(result.app_settings || result.app_permissions || {}) };

  if (perms.length > 0) {
    ALL_APP_KEYS.forEach((key) => {
      const mapped = MODULE_KEY_MAP[key] || [key];
      const allowed = mapped.some((m) => perms.some((p) => p.module_key?.toLowerCase() === m && p.view));
      appSettings[key] = allowed;
    });
  }

  result.app_settings = appSettings;
  result.app_permissions = appSettings;
  return result;
};

module.exports = {
  ALL_APP_KEYS,
  MODULE_KEY_MAP,
  resolveEffectivePermissions,
  syncUserPermissions
};
