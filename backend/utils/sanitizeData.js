const sanitizeEmptyFields = (obj, idFields = [], dateFields = []) => {
  if (!obj || typeof obj !== 'object') return obj;
  const clean = { ...obj };
  idFields.forEach((field) => {
    if (clean[field] === '' || clean[field] === undefined) {
      clean[field] = null;
    }
  });
  dateFields.forEach((field) => {
    if (clean[field] === '' || clean[field] === undefined) {
      clean[field] = null;
    }
  });
  return clean;
};

const sanitizeTeacherPayload = (data) => {
  const idFields = ['campus_id', 'supervisor'];
  const dateFields = ['dob', 'cnic_expiry', 'joining_date', 'regularization_date', 'appointment_date'];
  return sanitizeEmptyFields(data, idFields, dateFields);
};

const sanitizeStudentPayload = (data) => {
  const idFields = ['campus_id', 'grade_admitted', 'current_grade'];
  const dateFields = ['dob', 'admission_date'];
  return sanitizeEmptyFields(data, idFields, dateFields);
};

const sanitizeApplicantPayload = (data) => {
  const idFields = ['campus_id', 'replacement_staff', 'converted_user_id'];
  const dateFields = ['dob', 'applied_on', 'added_on'];
  return sanitizeEmptyFields(data, idFields, dateFields);
};

module.exports = {
  sanitizeEmptyFields,
  sanitizeTeacherPayload,
  sanitizeStudentPayload,
  sanitizeApplicantPayload
};
