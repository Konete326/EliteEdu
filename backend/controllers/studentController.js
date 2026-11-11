const { getStudents, getStudentById, getNextFamilyNumber } = require('./studentQueryController');
const { createStudent, updateStudent } = require('./studentMutationController');
const { familyLookup } = require('./studentFamilyController');

module.exports = {
  getStudents,
  getStudentById,
  getNextFamilyNumber,
  createStudent,
  updateStudent,
  familyLookup
};
