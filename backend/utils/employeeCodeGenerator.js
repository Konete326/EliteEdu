const User = require('../models/User');

const generateNextEmployeeCode = async (schoolId) => {
  const teachers = await User.find({ school_id: schoolId, role: 'Teacher' })
    .select('employee_code')
    .lean();

  let maxNum = 0;
  for (const t of teachers) {
    if (t.employee_code && t.employee_code.startsWith('EMP')) {
      const numPart = parseInt(t.employee_code.replace('EMP', ''), 10);
      if (!isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    }
  }

  const nextNum = maxNum + 1;
  return `EMP${String(nextNum).padStart(3, '0')}`;
};

module.exports = { generateNextEmployeeCode };
