const cleanEmptyValues = (obj, objectIdKeys = [], dateKeys = [], numberKeys = []) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const result = { ...obj };

  objectIdKeys.forEach((key) => {
    if (result[key] === '' || result[key] === undefined || result[key] === 'all') {
      result[key] = null;
    }
  });

  dateKeys.forEach((key) => {
    if (result[key] === '' || result[key] === undefined) {
      result[key] = null;
    }
  });

  numberKeys.forEach((key) => {
    if (result[key] === '' || result[key] === undefined) {
      result[key] = 0;
    } else if (typeof result[key] === 'string' && !isNaN(Number(result[key]))) {
      result[key] = Number(result[key]);
    }
  });

  return result;
};

const sanitizeTeacherPayload = (data) => {
  const objectIdKeys = ['campus_id', 'supervisor'];
  const dateKeys = ['dob', 'cnic_expiry', 'joining_date', 'regularization_date', 'appointment_date'];
  const numberKeys = ['basic_salary'];
  return cleanEmptyValues(data, objectIdKeys, dateKeys, numberKeys);
};

const sanitizeStudentPayload = (data) => {
  const objectIdKeys = ['campus_id', 'grade_admitted', 'current_grade'];
  const dateKeys = ['dob', 'admission_date'];
  const numberKeys = ['monthly_fee', 'discount', 'total_siblings'];
  return cleanEmptyValues(data, objectIdKeys, dateKeys, numberKeys);
};

const sanitizeApplicantPayload = (data) => {
  const objectIdKeys = ['campus_id', 'replacement_staff', 'converted_user_id'];
  const dateKeys = ['dob', 'applied_on', 'added_on'];
  const numberKeys = ['expected_salary', 'approved_salary', 'experience_years'];
  return cleanEmptyValues(data, objectIdKeys, dateKeys, numberKeys);
};

const sanitizeGradePayload = (data) => {
  const objectIdKeys = ['campus_id', 'class_teacher'];
  return cleanEmptyValues(data, objectIdKeys, [], []);
};

const sanitizePayload = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const objectIdKeys = ['campus_id', 'grade_admitted', 'current_grade', 'class_teacher', 'replacement_staff', 'supervisor', 'converted_user_id'];
  const dateKeys = ['dob', 'admission_date', 'joining_date', 'regularization_date', 'appointment_date', 'cnic_expiry', 'applied_on', 'added_on'];
  const numberKeys = ['basic_salary', 'monthly_fee', 'discount', 'total_siblings', 'expected_salary', 'approved_salary', 'experience_years'];
  return cleanEmptyValues(obj, objectIdKeys, dateKeys, numberKeys);
};

sanitizePayload.cleanEmptyValues = cleanEmptyValues;
sanitizePayload.sanitizeTeacherPayload = sanitizeTeacherPayload;
sanitizePayload.sanitizeStudentPayload = sanitizeStudentPayload;
sanitizePayload.sanitizeApplicantPayload = sanitizeApplicantPayload;
sanitizePayload.sanitizeGradePayload = sanitizeGradePayload;

sanitizePayload.sanitizePayload = sanitizePayload;
sanitizePayload.sanitizeTeacherPayload = sanitizePayload;

module.exports = sanitizePayload;
