const { getStudents, getStudentById } = require('./studentQueryController');
const { createStudent, updateStudent } = require('./studentMutationController');

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent
};
