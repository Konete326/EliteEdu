const Student = require('../models/Student');

const generateNextFamilyNumber = async (schoolId) => {
  const students = await Student.find({ school_id: schoolId })
    .select('family_number')
    .lean();

  let maxNum = 0;
  for (const s of students) {
    if (s.family_number) {
      const numPart = parseInt(String(s.family_number).replace(/\D/g, ''), 10);
      if (!isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    }
  }

  const nextNum = maxNum + 1;
  return `FAM-${String(nextNum).padStart(4, '0')}`;
};

module.exports = { generateNextFamilyNumber };
