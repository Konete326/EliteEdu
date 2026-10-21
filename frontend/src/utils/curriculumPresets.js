export const DEFAULT_CLASSES = [
  'Playgroup', 'Nursery', 'KG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
];

export const CURRICULUM_TIERS = {
  'Primary (1-5)': ['English', 'Urdu', 'Islamiat', 'Mathematics', 'General Science', 'Social Studies', 'Art & Drawing'],
  'Middle (6-8)': ['English', 'Urdu', 'Islamiat', 'Mathematics', 'General Science', 'Social Studies', 'Computer Education', 'Arabic'],
  'Matric Science - Bio': ['English', 'Urdu', 'Islamiat', 'Pakistan Studies', 'Mathematics', 'Physics', 'Chemistry', 'Biology'],
  'Matric Science - CS': ['English', 'Urdu', 'Islamiat', 'Pakistan Studies', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science'],
  'Matric Arts / General': ['English', 'Urdu', 'Islamiat', 'Pakistan Studies', 'General Mathematics', 'General Science (Arts)']
};

export const STANDARD_SUBJECT_PRESETS = [
  {
    name: 'English',
    code: 'ENG',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    periods_per_week: 6,
    theory_marks: 75,
    practical_marks: 0,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
  },
  {
    name: 'Urdu',
    code: 'URDU',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    periods_per_week: 6,
    theory_marks: 75,
    practical_marks: 0,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
  },
  {
    name: 'Islamiat / Ethics',
    code: 'ISL',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    periods_per_week: 4,
    theory_marks: 50,
    practical_marks: 0,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
  },
  {
    name: 'Mathematics',
    code: 'MATH',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    periods_per_week: 6,
    theory_marks: 75,
    practical_marks: 0,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
  },
  {
    name: 'General Science',
    code: 'G-SCI',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    periods_per_week: 5,
    theory_marks: 75,
    practical_marks: 0,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8']
  },
  {
    name: 'Social Studies',
    code: 'SST',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    periods_per_week: 4,
    theory_marks: 75,
    practical_marks: 0,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8']
  },
  {
    name: 'Pakistan Studies',
    code: 'PST',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    periods_per_week: 4,
    theory_marks: 50,
    practical_marks: 0,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'Computer Education',
    code: 'COMP-JR',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    periods_per_week: 3,
    theory_marks: 40,
    practical_marks: 10,
    classes: ['Class 6', 'Class 7', 'Class 8']
  },
  {
    name: 'Physics',
    code: 'PHY',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    periods_per_week: 5,
    theory_marks: 60,
    practical_marks: 15,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'Chemistry',
    code: 'CHEM',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    periods_per_week: 5,
    theory_marks: 60,
    practical_marks: 15,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'Biology',
    code: 'BIO',
    mandatory: false,
    subject_type: 'Elective',
    stream: 'Science (Biology)',
    elective_group: 'Science Elective (Bio / CS)',
    periods_per_week: 5,
    theory_marks: 60,
    practical_marks: 15,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'Computer Science',
    code: 'CS',
    mandatory: false,
    subject_type: 'Elective',
    stream: 'Science (Computer)',
    elective_group: 'Science Elective (Bio / CS)',
    periods_per_week: 5,
    theory_marks: 50,
    practical_marks: 25,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'General Science (Arts)',
    code: 'SCI-ARTS',
    mandatory: false,
    subject_type: 'Elective',
    stream: 'Arts / Humanities',
    elective_group: 'Arts Group',
    periods_per_week: 5,
    theory_marks: 75,
    practical_marks: 0,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'Sindhi',
    code: 'SND',
    mandatory: true,
    subject_type: 'Compulsory',
    stream: 'General',
    periods_per_week: 3,
    theory_marks: 75,
    practical_marks: 0,
    classes: ['Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 10']
  },
  {
    name: 'Arabic',
    code: 'ARB',
    mandatory: false,
    subject_type: 'Elective',
    stream: 'General',
    periods_per_week: 2,
    theory_marks: 50,
    practical_marks: 0,
    classes: ['Class 6', 'Class 7', 'Class 8']
  },
  {
    name: 'Art & Drawing',
    code: 'ART',
    mandatory: false,
    subject_type: 'Elective',
    stream: 'General',
    periods_per_week: 2,
    theory_marks: 50,
    practical_marks: 0,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8']
  }
];

export const formatClassesLabel = (classes = []) => {
  if (!classes || classes.length === 0) return 'All Classes';
  if (classes.length === 10) return 'Class 1-10';
  if (classes.length === 1) return classes[0];
  const nums = classes
    .map((c) => parseInt(c.replace(/\D/g, ''), 10))
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);
  if (nums.length === classes.length) {
    const isConsecutive = nums.every((val, i, arr) => i === 0 || val === arr[i - 1] + 1);
    if (isConsecutive && nums.length > 2) {
      return `Class ${nums[0]}-${nums[nums.length - 1]}`;
    }
  }
  return classes.map((c) => c.replace(/Class\s*/i, 'C')).join(', ');
};
