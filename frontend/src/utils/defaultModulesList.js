export const DEFAULT_MODULES = [
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
  { module_key: 'grading_policies', module_name: 'Grading Policies & Criteria', category: 'Examination' },
  { module_key: 'reports', module_name: 'Reports & Analytics', category: 'Operations' },
  { module_key: 'control_panel', module_name: 'Control Panel & Settings', category: 'Administration' },
  { module_key: 'user_management', module_name: 'User & Role Management', category: 'Administration' }
];

export const getInitialPermissions = (rolePermissions = []) => {
  const map = new Map((rolePermissions || []).map((p) => [p.module_key, p]));
  return DEFAULT_MODULES.map((m) => {
    const ex = map.get(m.module_key) || {};
    return {
      module_key: m.module_key,
      module_name: m.module_name,
      category: m.category,
      view: Boolean(ex.view),
      add: Boolean(ex.add),
      edit: Boolean(ex.edit),
      delete: Boolean(ex.delete),
      filter: Boolean(ex.filter),
      reports: Boolean(ex.reports)
    };
  });
};
