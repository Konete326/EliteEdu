const ALL_APP_KEYS = [
  'attendance', 'homework', 'examination', 'students', 'timetable',
  'quizzes', 'lectures', 'online_classes', 'planner', 'datesheet',
  'salary', 'events', 'complaints', 'feedback', 'counseling',
  'lost_and_found', 'resources', 'my_profile', 'update_picture',
  'student_promotion', 'class_tests', 'question_papers', 'certificates',
  'reports', 'student_reports', 'parent_reports', 'report_cards', 'attendance_reports', 'exam_reports'
];

const MODULE_KEY_MAP = {
  attendance: ['attendance'],
  homework: ['homework'],
  examination: ['exams', 'examination'],
  datesheet: ['exams', 'datesheet'],
  quizzes: ['exams', 'quizzes'],
  students: ['students'],
  student_promotion: ['student_promotion', 'students'],
  class_tests: ['class_tests', 'exams'],
  question_papers: ['question_papers', 'exams'],
  certificates: ['certificates'],
  timetable: ['timetable'],
  lectures: ['lectures'],
  online_classes: ['online_classes'],
  planner: ['planner'],
  salary: ['salary', 'fees'],
  events: ['events'],
  complaints: ['complaints'],
  feedback: ['feedback'],
  counseling: ['counseling'],
  lost_and_found: ['lost_and_found'],
  resources: ['resources', 'subjects'],
  my_profile: ['my_profile'],
  update_picture: ['update_picture'],
  reports: ['reports'],
  student_reports: ['reports', 'students'],
  parent_reports: ['reports', 'students'],
  report_cards: ['reports', 'exams', 'students'],
  attendance_reports: ['reports', 'attendance'],
  exam_reports: ['reports', 'exams']
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
