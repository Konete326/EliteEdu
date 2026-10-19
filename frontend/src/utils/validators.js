export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^.{6,}$/;
export const PHONE_REGEX = /^(\+92|0)?[0-9]{10,11}$/;
export const CODE_REGEX = /^[A-Za-z0-9_-]{2,10}$/;
export const WEBSITE_REGEX = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
export const SUBJECT_NAME_REGEX = /^[a-zA-Z0-9\s\-&]{1,50}$/;
export const SUBJECT_CODE_REGEX = /^[a-zA-Z0-9\s\-]{1,20}$/;
export const GRADE_NAME_REGEX = /^[A-Za-z0-9\s\-()]{1,40}$/;
export const SECTION_NAME_REGEX = /^[A-Za-z0-9\s\-_]{1,25}$/;
export const CAMPUS_NAME_REGEX = /^[A-Za-z0-9\s\-&/.,()]{2,60}$/;
export const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;
export const IBAN_ACCOUNT_REGEX = /^[A-Za-z0-9\s\-]{8,34}$/;

export const isValidEmail = (email) => {
  return EMAIL_REGEX.test(String(email).trim());
};

export const isValidPassword = (password) => {
  return PASSWORD_REGEX.test(String(password));
};

export const isValidPhone = (phone) => {
  if (!phone) return true;
  return PHONE_REGEX.test(String(phone).replace(/[\s-]/g, ''));
};

export const isValidCode = (code) => {
  return CODE_REGEX.test(String(code).trim());
};

export const isValidWebsite = (url) => {
  if (!url || !String(url).trim()) return true;
  return WEBSITE_REGEX.test(String(url).trim());
};

export const isValidSubjectName = (name) => {
  if (!name) return false;
  return SUBJECT_NAME_REGEX.test(String(name).trim());
};

export const isValidSubjectCode = (code) => {
  if (!code) return false;
  return SUBJECT_CODE_REGEX.test(String(code).trim());
};

export const isValidGradeName = (name) => {
  if (!name || !String(name).trim()) return false;
  return GRADE_NAME_REGEX.test(String(name).trim());
};

export const isValidCampusName = (name) => {
  if (!name || !String(name).trim()) return false;
  return CAMPUS_NAME_REGEX.test(String(name).trim());
};

export const isValidSections = (sections) => {
  if (!Array.isArray(sections) || sections.length === 0) return false;
  return sections.every(
    (s) => typeof s === 'string' && s.trim().length >= 1 && SECTION_NAME_REGEX.test(s.trim())
  );
};

export const formatCnic = (val) => {
  if (!val) return '';
  const digits = String(val).replace(/\D/g, '').slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
};

export const isValidCnic = (val) => {
  if (!val || !String(val).trim()) return true;
  const trimmed = String(val).trim();
  return CNIC_REGEX.test(trimmed) || /^\d{13}$/.test(trimmed);
};

export const isValidIbanOrAccount = (val) => {
  if (!val || !String(val).trim()) return true;
  return IBAN_ACCOUNT_REGEX.test(String(val).trim());
};

export const generateSubjectCode = (name) => {
  if (!name || !name.trim()) return '';
  const clean = name.replace(/[^\w\s-]/g, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const acronym = words.map((w) => w[0]).join('').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (acronym.length >= 2) return acronym.slice(0, 10);
  }
  const single = (words[0] || name).toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!single) return '';
  if (single.length <= 4) return single;
  const commonMap = {
    MATHEMATICS: 'MATH', PHYSICS: 'PHY', CHEMISTRY: 'CHEM', BIOLOGY: 'BIO',
    ISLAMIYAT: 'ISL', ISLAMIAT: 'ISL', ENGLISH: 'ENG', SCIENCE: 'SCI',
    ARABIC: 'ARB', SINDHI: 'SND', DRAWING: 'DRW', MATH: 'MATH',
    HISTORY: 'HIST', GEOGRAPHY: 'GEOG', PAKISTAN: 'PST', COMPUTER: 'COMP',
    ECONOMICS: 'ECON', ACCOUNTING: 'ACC', STATISTICS: 'STAT', COMMERCE: 'COMM',
    URDU: 'URDU'
  };
  return commonMap[single] || single.slice(0, 4);
};
