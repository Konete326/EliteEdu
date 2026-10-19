const ENTITY_SCHEMAS = {
  students: {
    headers: ['name', 'father_name', 'gr_number', 'grade_name', 'section', 'gender', 'contact_number', 'email', 'transport_route'],
    required: ['name', 'father_name', 'gr_number', 'grade_name'],
    samples: [
      { name: 'Muhammad Ali', father_name: 'Ahmed Ali', gr_number: 'GR-1001', grade_name: 'Class 9', section: 'A', gender: 'Male', contact_number: '03001234567', email: 'ali@example.com', transport_route: 'Route A' },
      { name: 'Fatima Zahra', father_name: 'Zahid Khan', gr_number: 'GR-1002', grade_name: 'Class 10', section: 'B', gender: 'Female', contact_number: '03009876543', email: 'fatima@example.com', transport_route: 'Route B' }
    ]
  },
  teachers: {
    headers: ['name', 'email', 'contact_number', 'gender', 'designation', 'department', 'qualification'],
    required: ['name', 'email'],
    samples: [
      { name: 'Dr. Tariq Mahmood', email: 'tariq@eliteedu.com', contact_number: '03112223344', gender: 'Male', designation: 'Senior Lecturer', department: 'Science', qualification: 'Ph.D Physics' },
      { name: 'Ayesha Siddiqua', email: 'ayesha@eliteedu.com', contact_number: '03223334455', gender: 'Female', designation: 'Coordinator', department: 'English', qualification: 'M.A English' }
    ]
  },
  crm_leads: {
    headers: ['student_name', 'parent_name', 'phone', 'email', 'grade_name', 'source', 'status'],
    required: ['student_name', 'parent_name', 'phone'],
    samples: [
      { student_name: 'Bilal Hassan', parent_name: 'Hassan Raza', phone: '03335556677', email: 'hassan@example.com', grade_name: 'Class 8', source: 'Facebook', status: 'New' },
      { student_name: 'Sara Danish', parent_name: 'Danish Iqbal', phone: '03446667788', email: 'danish@example.com', grade_name: 'Class 6', source: 'Walk-In', status: 'Contacted' }
    ]
  },
  questions: {
    headers: ['question_text', 'question_type', 'grade_name', 'subject_name', 'correct_answer', 'marks', 'difficulty'],
    required: ['question_text', 'grade_name', 'subject_name'],
    samples: [
      { question_text: 'What is Newton’s First Law of Motion?', question_type: 'Short', grade_name: 'Class 9', subject_name: 'Physics', correct_answer: 'Law of Inertia', marks: 2, difficulty: 'Easy' },
      { question_text: 'Calculate the value of acceleration due to gravity.', question_type: 'Short', grade_name: 'Class 10', subject_name: 'Physics', correct_answer: '9.8 m/s^2', marks: 3, difficulty: 'Medium' }
    ]
  },
  subjects: {
    headers: ['name', 'code', 'grade_name', 'category', 'passing_marks', 'total_marks'],
    required: ['name', 'code', 'grade_name'],
    samples: [
      { name: 'Computer Science', code: 'CS-09', grade_name: 'Class 9', category: 'Core', passing_marks: 33, total_marks: 100 },
      { name: 'Islamiat', code: 'ISL-10', grade_name: 'Class 10', category: 'General', passing_marks: 25, total_marks: 75 }
    ]
  },
  account_transactions: {
    headers: ['type', 'head_name', 'amount', 'payment_method', 'date', 'description'],
    required: ['type', 'amount'],
    samples: [
      { type: 'Expense', head_name: 'Electricity Utility Bill', amount: 45000, payment_method: 'Bank Transfer', date: '2026-10-15', description: 'Oct 2026 Campus Bill' },
      { type: 'Income', head_name: 'Prospectus Sale', amount: 15000, payment_method: 'Cash', date: '2026-10-16', description: 'Counter Admissions' }
    ]
  }
};

module.exports = { ENTITY_SCHEMAS };
