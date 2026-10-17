const DEFAULT_MODULES = [
  { module_key: 'campus', module_name: 'Campus Management', category: 'Academics' },
  { module_key: 'grades', module_name: 'Grades & Sections', category: 'Academics' },
  { module_key: 'subjects', module_name: 'Subjects', category: 'Academics' },
  { module_key: 'teachers', module_name: 'Teachers & Staff', category: 'Academics' },
  { module_key: 'students', module_name: 'Students & Enrollment', category: 'Academics' },
  { module_key: 'student_promotion', module_name: 'Promote Students & Class Transfer', category: 'Academics' },
  { module_key: 'admission_letter', module_name: 'Admission Letter Generator', category: 'Academics' },
  { module_key: 'student_id_cards', module_name: 'Student ID Cards Studio', category: 'Academics' },
  { module_key: 'teacher_id_cards', module_name: 'Staff Service ID Cards', category: 'Academics' },
  { module_key: 'attendance', module_name: 'Attendance Tracking', category: 'Operations' },
  { module_key: 'fees', module_name: 'Fee Management', category: 'Finance' },
  { module_key: 'accounts', module_name: 'Accounts & Expenses', category: 'Finance' },
  { module_key: 'exams', module_name: 'Examinations & Grading', category: 'Examination' },
  { module_key: 'class_tests', module_name: 'Class Tests & Test Reports', category: 'Examination' },
  { module_key: 'question_papers', module_name: 'Question Papers Studio', category: 'Examination' },
  { module_key: 'grading_policies', module_name: 'Grading Policies & Criteria', category: 'Examination' },
  { module_key: 'reports', module_name: 'Reports & Analytics', category: 'Operations' },
  { module_key: 'control_panel', module_name: 'Control Panel & Settings', category: 'Administration' },
  { module_key: 'user_management', module_name: 'User & Role Management', category: 'Administration' }
];

const buildPermissions = (rules = {}) => {
  return DEFAULT_MODULES.map((m) => {
    const r = rules[m.module_key] || rules['*'] || {};
    return {
      module_key: m.module_key,
      module_name: m.module_name,
      category: m.category,
      view: r.view ?? false,
      add: r.add ?? false,
      edit: r.edit ?? false,
      delete: r.delete ?? false,
      filter: r.filter ?? false,
      reports: r.reports ?? false
    };
  });
};

const getDefaultRoleTemplates = () => [
  {
    name: 'Campus Admin',
    description: 'Full administrative control over campus operations and staff',
    dashboard_type: 'AdminDashboard',
    is_system: true,
    permissions: buildPermissions({ '*': { view: true, add: true, edit: true, delete: true, filter: true, reports: true } })
  },
  {
    name: 'Academic Coordinator',
    description: 'Supervises curricula, grading, class timetables, and teachers',
    dashboard_type: 'AcademicDashboard',
    is_system: true,
    permissions: buildPermissions({
      '*': { view: true, add: false, edit: false, delete: false, filter: true, reports: true },
      grades: { view: true, add: true, edit: true, delete: false, filter: true, reports: true },
      subjects: { view: true, add: true, edit: true, delete: false, filter: true, reports: true },
      exams: { view: true, add: true, edit: true, delete: false, filter: true, reports: true },
      teachers: { view: true, add: false, edit: true, delete: false, filter: true, reports: true }
    })
  },
  {
    name: 'Senior Teacher',
    description: 'Manages student marks, attendance, and educational syllabus',
    dashboard_type: 'TeacherDashboard',
    is_system: true,
    permissions: buildPermissions({
      students: { view: true, add: false, edit: false, delete: false, filter: true, reports: false },
      attendance: { view: true, add: true, edit: true, delete: false, filter: true, reports: false },
      exams: { view: true, add: true, edit: true, delete: false, filter: true, reports: true }
    })
  },
  {
    name: 'Accountant',
    description: 'Oversees fee structures, collections, challans, and balances',
    dashboard_type: 'FinanceDashboard',
    is_system: true,
    permissions: buildPermissions({
      fees: { view: true, add: true, edit: true, delete: false, filter: true, reports: true },
      accounts: { view: true, add: true, edit: true, delete: false, filter: true, reports: true },
      students: { view: true, add: false, edit: false, delete: false, filter: true, reports: false }
    })
  }
];

module.exports = { DEFAULT_MODULES, getDefaultRoleTemplates, buildPermissions };
