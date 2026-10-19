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
  { module_key: 'class_tests', module_name: 'Class Tests & Test Reports', category: 'Examination' },
  { module_key: 'question_papers', module_name: 'Question Papers Studio', category: 'Examination' },
  { module_key: 'grading_policies', module_name: 'Grading Policies & Criteria', category: 'Examination' },
  { module_key: 'reports', module_name: 'Reports & Analytics', category: 'Operations' },
  { module_key: 'student_reports', module_name: 'Student Reports', category: 'Operations' },
  { module_key: 'parent_reports', module_name: 'Parent Contact Reports', category: 'Operations' },
  { module_key: 'report_cards', module_name: 'Student Report Cards', category: 'Examination' },
  { module_key: 'attendance_reports', module_name: 'Attendance Reports', category: 'Operations' },
  { module_key: 'exam_reports', module_name: 'Exam Reports', category: 'Examination' },
  { module_key: 'control_panel', module_name: 'Control Panel & Settings', category: 'Administration' },
  { module_key: 'user_management', module_name: 'User & Role Management', category: 'Administration' },
  { module_key: 'timetable', module_name: 'Smart Timetable Management', category: 'Academics' },
  { module_key: 'lms', module_name: 'LMS & Syllabus Tracker', category: 'Academics' },
  { module_key: 'homework', module_name: 'Homework & Assignments', category: 'Academics' },
  { module_key: 'lectures', module_name: 'Recorded Lectures & Material', category: 'Academics' },
  { module_key: 'quizzes', module_name: 'Online Quizzes & Assessments', category: 'Academics' },
  { module_key: 'online_classes', module_name: 'Live Virtual Classes', category: 'Academics' },
  { module_key: 'crm', module_name: 'CRM & Admissions', category: 'CRM' },
  { module_key: 'crm_inquiries', module_name: 'Inquiries & Leads', category: 'CRM' },
  { module_key: 'crm_pipeline', module_name: 'Admissions Pipeline', category: 'CRM' },
  { module_key: 'crm_followups', module_name: 'Lead Follow-ups', category: 'CRM' },
  { module_key: 'crm_analytics', module_name: 'Lead Analytics', category: 'CRM' },
  { module_key: 'store_pos', module_name: 'Bookstore & POS Inventory', category: 'Finance' },
  { module_key: 'behavior', module_name: 'Affective & Psychomotor Behavior', category: 'Academics' },
  { module_key: 'behavior_skills', module_name: 'Behavior & Skills Assessment', category: 'Academics' },
  { module_key: 'campus_transfer', module_name: 'Campus Transfer', category: 'Academics' },
  { module_key: 'operations', module_name: 'Campus Operations & Activities', category: 'Operations' },
  { module_key: 'bulk_migration', module_name: 'Bulk Data Migration Engine', category: 'Administration' },
  { module_key: 'transport', module_name: 'Transport & Fleet Management', category: 'Operations' },
  { module_key: 'van_management', module_name: 'Van & Transport Management', category: 'Operations' },
  { module_key: 'student_portal', module_name: 'Student & Parent Portal', category: 'Academics' },
  { module_key: 'messenger', module_name: 'Internal Staff Messenger', category: 'Communications' }
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
