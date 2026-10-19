const TEMPLATES = {
  students: {
    headers: ['name', 'father_name', 'gender', 'dob', 'contact_number', 'father_contact', 'class_name', 'section', 'monthly_fee', 'admission_date', 'religion', 'b_form'],
    samples: [
      { name: 'Muhammad Rayyan', father_name: 'Tariq Mehmood', gender: 'Male', dob: '2012-04-15', contact_number: '03001234567', father_contact: '03001234567', class_name: 'Class 8', section: 'A', monthly_fee: 5500, admission_date: '2026-03-01', religion: 'Islam', b_form: '42101-1234567-1' },
      { name: 'Ayesha Noor', father_name: 'Farhan Ali', gender: 'Female', dob: '2013-09-22', contact_number: '03219876543', father_contact: '03219876543', class_name: 'Class 7', section: 'B', monthly_fee: 5200, admission_date: '2026-03-05', religion: 'Islam', b_form: '42201-9876543-2' },
      { name: 'Zainab Fatima', father_name: 'Kamran Aslam', gender: 'Female', dob: '2011-11-10', contact_number: '03335557788', father_contact: '03335557788', class_name: 'Class 9', section: 'A', monthly_fee: 6000, admission_date: '2026-03-10', religion: 'Islam', b_form: '42301-5557788-4' }
    ]
  },
  teachers: {
    headers: ['name', 'father_name', 'email', 'contact_number', 'designation', 'bps_grade', 'basic_salary', 'cnic', 'joining_date'],
    samples: [
      { name: 'Dr. Shahzad Khan', father_name: 'Abdul Ghafoor', email: 'shahzad.khan@eliteedu.pk', contact_number: '03017778899', designation: 'Senior Science Teacher', bps_grade: 'BPS-17', basic_salary: 65000, cnic: '37405-1234567-3', joining_date: '2024-08-15' },
      { name: 'Mariam Rasheed', father_name: 'Rasheed Ahmed', email: 'mariam.rasheed@eliteedu.pk', contact_number: '03124445566', designation: 'Mathematics Specialist', bps_grade: 'BPS-16', basic_salary: 55000, cnic: '35202-7654321-2', joining_date: '2025-01-10' },
      { name: 'Bilal Qureshi', father_name: 'Nadeem Qureshi', email: 'bilal.qureshi@eliteedu.pk', contact_number: '03456667788', designation: 'Computer Instructor', bps_grade: 'BPS-16', basic_salary: 58000, cnic: '42101-4445566-1', joining_date: '2025-09-01' }
    ]
  },
  crm_leads: {
    headers: ['student_name', 'father_name', 'contact_number', 'class_name', 'lead_source', 'priority', 'notes'],
    samples: [
      { student_name: 'Hamza Shahid', father_name: 'Shahid Iqbal', contact_number: '03332221100', class_name: 'Class 5', lead_source: 'Walk-in', priority: 'High', notes: 'Interested in STEM curriculum and transport facility' },
      { student_name: 'Emaan Farooq', father_name: 'Farooq Azam', contact_number: '03023334455', class_name: 'Class 9', lead_source: 'Social Media', priority: 'Medium', notes: 'Migrating from Lahore branch, requested fee structure' },
      { student_name: 'Subhan Malik', father_name: 'Malik Tanveer', contact_number: '03158889900', class_name: 'Pre-Nursery', lead_source: 'Referral', priority: 'Urgent', notes: 'Immediate admission required for spring session' }
    ]
  },
  questions: {
    headers: ['class_name', 'subject_name', 'question_type', 'difficulty', 'marks', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer'],
    samples: [
      { class_name: 'Class 9', subject_name: 'Physics', question_type: 'MCQ', difficulty: 'Easy', marks: 1, question_text: 'What is the SI unit of force?', option_a: 'Joule', option_b: 'Newton', option_c: 'Pascal', option_d: 'Watt', correct_answer: 'Newton' },
      { class_name: 'Class 9', subject_name: 'Physics', question_type: 'Short', difficulty: 'Medium', marks: 3, question_text: 'State Newton’s Second Law of Motion and derive its formula F=ma.', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'F = ma formulation' },
      { class_name: 'Class 10', subject_name: 'Chemistry', question_type: 'Long', difficulty: 'Hard', marks: 5, question_text: 'Explain Le Chatelier’s principle with industrial applications.', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'Detailed equilibrium response description' }
    ]
  },
  store_items: {
    headers: ['item_code', 'name', 'category', 'cost_price', 'sale_price', 'stock_qty'],
    samples: [
      { item_code: 'NB-A4-001', name: 'EliteEdu Single Line A4 Notebook', category: 'Notebooks & Copies', cost_price: 180, sale_price: 240, stock_qty: 150 },
      { item_code: 'UNI-TIE-01', name: 'Official Institutional School Tie', category: 'Uniform', cost_price: 220, sale_price: 350, stock_qty: 80 },
      { item_code: 'KIT-GEO-02', name: 'Mathematical Geometry Box Set', category: 'Stationery', cost_price: 320, sale_price: 450, stock_qty: 60 }
    ]
  }
};

const getEntityTemplate = (entityType) => {
  return TEMPLATES[entityType] || null;
};

module.exports = { TEMPLATES, getEntityTemplate };
