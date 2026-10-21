const DEFAULT_CLASSES = [
  'Playgroup', 'Nursery', 'KG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
];

const CURRICULUM_TIERS = {
  'Primary (1-5)': ['English', 'Urdu', 'Islamiat', 'Mathematics', 'General Science', 'Social Studies', 'Art & Drawing'],
  'Middle (6-8)': ['English', 'Urdu', 'Islamiat', 'Mathematics', 'General Science', 'Social Studies', 'Computer Education', 'Arabic'],
  'Matric Science - Bio': ['English', 'Urdu', 'Islamiat', 'Pakistan Studies', 'Mathematics', 'Physics', 'Chemistry', 'Biology'],
  'Matric Science - CS': ['English', 'Urdu', 'Islamiat', 'Pakistan Studies', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science'],
  'Matric Arts / General': ['English', 'Urdu', 'Islamiat', 'Pakistan Studies', 'General Mathematics', 'General Science']
};

const DEFAULT_SUBJECTS = [
  {
    name: 'English',
    code: 'ENG',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    order: 1,
    theory_marks: 75,
    practical_marks: 0,
    periods_per_week: 6,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
  },
  {
    name: 'Urdu',
    code: 'URDU',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    order: 2,
    theory_marks: 75,
    practical_marks: 0,
    periods_per_week: 6,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
  },
  {
    name: 'Islamiat / Ethics',
    code: 'ISL',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    order: 3,
    theory_marks: 50,
    practical_marks: 0,
    periods_per_week: 4,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
  },
  {
    name: 'Mathematics',
    code: 'MATH',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    order: 4,
    theory_marks: 75,
    practical_marks: 0,
    periods_per_week: 6,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
  },
  {
    name: 'General Science',
    code: 'G-SCI',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    order: 5,
    theory_marks: 75,
    practical_marks: 0,
    periods_per_week: 5,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8']
  },
  {
    name: 'Social Studies',
    code: 'SST',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    order: 6,
    theory_marks: 75,
    practical_marks: 0,
    periods_per_week: 4,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8']
  },
  {
    name: 'Pakistan Studies',
    code: 'PST',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    order: 7,
    theory_marks: 50,
    practical_marks: 0,
    periods_per_week: 4,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'Computer Education',
    code: 'COMP-JR',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    order: 8,
    theory_marks: 40,
    practical_marks: 10,
    periods_per_week: 3,
    classes: ['Class 6', 'Class 7', 'Class 8']
  },
  {
    name: 'Physics',
    code: 'PHY',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    order: 9,
    theory_marks: 60,
    practical_marks: 15,
    periods_per_week: 5,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'Chemistry',
    code: 'CHEM',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    order: 10,
    theory_marks: 60,
    practical_marks: 15,
    periods_per_week: 5,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'Biology',
    code: 'BIO',
    mandatory: false,
    subject_type: 'Elective',
    stream: 'Science (Biology)',
    elective_group: 'Science Elective (Bio / CS)',
    order: 11,
    theory_marks: 60,
    practical_marks: 15,
    periods_per_week: 5,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'Computer Science',
    code: 'CS',
    mandatory: false,
    subject_type: 'Elective',
    stream: 'Science (Computer)',
    elective_group: 'Science Elective (Bio / CS)',
    order: 12,
    theory_marks: 50,
    practical_marks: 25,
    periods_per_week: 5,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'General Science (Arts)',
    code: 'SCI-ARTS',
    mandatory: false,
    subject_type: 'Elective',
    stream: 'Arts / Humanities',
    elective_group: 'Arts Group',
    order: 13,
    theory_marks: 75,
    practical_marks: 0,
    periods_per_week: 5,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'Sindhi',
    code: 'SND',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    order: 14,
    theory_marks: 75,
    practical_marks: 0,
    periods_per_week: 3,
    classes: ['Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 10']
  },
  {
    name: 'Arabic',
    code: 'ARB',
    mandatory: false,
    subject_type: 'Elective',
    stream: 'General',
    order: 15,
    theory_marks: 50,
    practical_marks: 0,
    periods_per_week: 2,
    classes: ['Class 6', 'Class 7', 'Class 8']
  },
  {
    name: 'Art & Drawing',
    code: 'ART',
    mandatory: false,
    subject_type: 'Elective',
    stream: 'General',
    order: 16,
    theory_marks: 50,
    practical_marks: 0,
    periods_per_week: 2,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8']
  }
];

module.exports = { DEFAULT_CLASSES, CURRICULUM_TIERS, DEFAULT_SUBJECTS };
