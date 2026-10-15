const DEFAULT_CLASSES = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10'
];

const CURRICULUM_TIERS = {
  'Class 1-2': ['English', 'Urdu', 'Islamiat', 'Social Studies', 'Science', 'Drawing', 'Math'],
  'Class 3-5': ['English', 'Urdu', 'Islamiat', 'Science', 'Social Studies', 'Math', 'Sindhi', 'Drawing'],
  'Class 6-8': ['English', 'Urdu', 'Islamiat', 'Social Studies', 'Science', 'Drawing', 'Math', 'Arabic', 'Sindhi'],
  'Class 9': ['English', 'Urdu', 'Islamiat', 'Biology', 'Chemistry', 'Math', 'Physics', 'Computer Science'],
  'Class 10': ['English', 'Pakistan Studies', 'Sindhi', 'Chemistry', 'Biology', 'Physics', 'Computer Science']
};

const DEFAULT_SUBJECTS = [
  {
    name: 'English',
    code: 'ENG',
    mandatory: true,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
  },
  {
    name: 'Urdu',
    code: 'URDU',
    mandatory: true,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9']
  },
  {
    name: 'Islamiat',
    code: 'ISL',
    mandatory: true,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9']
  },
  {
    name: 'Social Studies',
    code: 'SST',
    mandatory: true,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8']
  },
  {
    name: 'Science',
    code: 'SCI',
    mandatory: true,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8']
  },
  {
    name: 'Drawing',
    code: 'DRW',
    mandatory: false,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8']
  },
  {
    name: 'Math',
    code: 'MATH',
    mandatory: true,
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9']
  },
  {
    name: 'Sindhi',
    code: 'SND',
    mandatory: true,
    classes: ['Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 10']
  },
  {
    name: 'Arabic',
    code: 'ARB',
    mandatory: false,
    classes: ['Class 6', 'Class 7', 'Class 8']
  },
  {
    name: 'Biology',
    code: 'BIO',
    mandatory: true,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'Chemistry',
    code: 'CHEM',
    mandatory: true,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'Physics',
    code: 'PHY',
    mandatory: true,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'Computer Science',
    code: 'CS',
    mandatory: true,
    classes: ['Class 9', 'Class 10']
  },
  {
    name: 'Pakistan Studies',
    code: 'PST',
    mandatory: true,
    classes: ['Class 10']
  }
];

module.exports = { DEFAULT_CLASSES, CURRICULUM_TIERS, DEFAULT_SUBJECTS };
