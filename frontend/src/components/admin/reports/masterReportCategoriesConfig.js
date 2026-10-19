export const REPORT_CATEGORIES = [
  {
    id: 'student',
    label: 'Student Reports (12)',
    subReports: [
      { id: 'master_list', label: 'Student master list' },
      { id: 'registration_list', label: 'Registration list' },
      { id: 'new_admissions', label: 'New admissions' },
      { id: 'strength_summary', label: 'Student strength summary' },
      { id: 'dropout_left', label: 'Dropout / left students' },
      { id: 'birthday_list', label: 'Birthday list' },
      { id: 'profile_sheet', label: 'Student profile sheet' },
      { id: 'siblings_report', label: 'Siblings report' },
      { id: 'id_cards_status', label: 'ID cards status' },
      { id: 'fee_status_summary', label: 'Fee status summary' },
      { id: 'fee_status_student_wise', label: 'Fee status student-wise' },
      { id: 'free_students', label: 'Free Students List' }
    ]
  },
  {
    id: 'exams',
    label: 'Exam & Result Reports (11)',
    subReports: [
      { id: 'marksheet_report_card', label: 'Marksheet / report card' },
      { id: 'result_summary', label: 'Result summary' },
      { id: 'toppers_list', label: 'Toppers list' },
      { id: 'fail_compartment_list', label: 'Fail / compartment list' },
      { id: 'grade_distribution', label: 'Grade distribution' },
      { id: 'progress_report_term_wise', label: 'Progress report (term-wise)' },
      { id: 'mark_sheets_summary', label: 'Mark Sheets Summary' },
      { id: 'exam_attendance', label: 'Exam Attendance' },
      { id: 'detailed_summary_datasheet', label: 'Detailed Summary Datasheet' },
      { id: 'blank_datasheet', label: 'Blank Datasheet' },
      { id: 'seating_arrangement', label: 'Seating Arrangement' }
    ]
  },
  {
    id: 'attendance',
    label: 'Student Attendance (7)',
    subReports: [
      { id: 'daily_class_summary', label: 'Daily Class Attendance Summary' },
      { id: 'student_monthly_register', label: 'Student Monthly Register' },
      { id: 'absent_students', label: 'Absent Students Report' },
      { id: 'late_comers', label: 'Late Comers Report' },
      { id: 'low_attendance', label: 'Low Attendance (<75%) Report' },
      { id: 'approved_leaves', label: 'Approved Student Leaves Report' },
      { id: 'unmarked_classes_alert', label: 'Unmarked Classes Alert' }
    ]
  },
  {
    id: 'fee_collection',
    label: 'Fee & Collection (6)',
    subReports: [
      { id: 'daily_collection_register', label: 'Daily Collection Register' },
      { id: 'monthly_collection_summary', label: 'Monthly Collection Summary' },
      { id: 'student_wise_fee_ledger', label: 'Student-Wise Fee Ledger' },
      { id: 'concession_scholarship_report', label: 'Concession & Scholarships' },
      { id: 'payment_mode_breakdown', label: 'Payment Mode Breakdown' },
      { id: 'cancelled_void_challans', label: 'Void / Cancelled Challans' }
    ]
  },
  {
    id: 'outstanding_dues',
    label: 'Outstanding & Dues (4)',
    subReports: [
      { id: 'fee_defaulters_list', label: 'Fee Defaulters List' },
      { id: 'class_wise_dues_summary', label: 'Class-Wise Dues Summary' },
      { id: 'aging_dues_report', label: 'Aging Dues Analysis (1-3 Mo)' },
      { id: 'left_students_pending_dues', label: 'Left Students Pending Dues' }
    ]
  },
  {
    id: 'accounts_financial',
    label: 'Accounts & Financial (6)',
    subReports: [
      { id: 'income_register', label: 'Income Register' },
      { id: 'expense_register', label: 'Expense Register' },
      { id: 'day_book_cashbook', label: 'Day Book & Cash Book' },
      { id: 'trial_balance_summary', label: 'Trial Balance Summary' },
      { id: 'profit_and_loss_statement', label: 'Profit & Loss Statement' },
      { id: 'staff_payroll_and_loans_report', label: 'Staff Payroll & Loans' }
    ]
  },
  {
    id: 'certificates_docs',
    label: 'Certificates & Docs (4)',
    subReports: [
      { id: 'issued_certificates_register', label: 'Issued Certificates Register' },
      { id: 'school_leaving_certificates', label: 'School Leaving Certificates' },
      { id: 'character_merit_certificates', label: 'Character & Merit Awards' },
      { id: 'missing_student_documents', label: 'Missing Student Documents' }
    ]
  },
  {
    id: 'staff_attendance',
    label: 'Staff Attendance (4)',
    subReports: [
      { id: 'daily_staff_attendance', label: 'Daily Staff Attendance' },
      { id: 'monthly_staff_attendance_summary', label: 'Monthly Attendance Summary' },
      { id: 'staff_late_arrival_register', label: 'Late Arrival Register' },
      { id: 'staff_approved_leaves_register', label: 'Approved Staff Leaves' }
    ]
  },
  {
    id: 'staff_hr',
    label: 'Staff & HR Reports (6)',
    subReports: [
      { id: 'staff_master_directory', label: 'Staff Master Directory' },
      { id: 'dept_bps_summary', label: 'Department & BPS Scale Summary' },
      { id: 'teacher_subject_allocation', label: 'Teacher Subject Allocation' },
      { id: 'staff_qualification_exp', label: 'Qualification & Experience' },
      { id: 'staff_applicants_pipeline', label: 'Staff Applicants Pipeline' },
      { id: 'staff_contact_emergency', label: 'Contact & Emergency Directory' }
    ]
  }
];
