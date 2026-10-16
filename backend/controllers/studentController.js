const { getStudents, getStudentById, getNextFamilyNumber } = require('./studentQueryController');
const { createStudent, updateStudent } = require('./studentMutationController');

module.exports = {
  getStudents,
  getStudentById,
  getNextFamilyNumber,
  createStudent,
  updateStudent
};
