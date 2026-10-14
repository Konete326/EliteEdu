const Student = require('../models/Student');

const generateNextGrNumber = async (schoolId) => {
  const students = await Student.find({ school_id: schoolId })
    .select('gr_number')
    .lean();

  let maxNum = 183200;
  for (const s of students) {
    if (s.gr_number) {
      const numPart = parseInt(s.gr_number.replace(/\D/g, ''), 10);
      if (!isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    }
  }

  return String(maxNum + 1);
};

module.exports = { generateNextGrNumber };
