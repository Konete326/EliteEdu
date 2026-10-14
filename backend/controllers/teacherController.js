const { getTeachers, getTeacherById } = require('./teacherQueryController');
const { addTeacher, updateTeacher } = require('./teacherMutationController');

module.exports = {
  getTeachers,
  getTeacherById,
  addTeacher,
  updateTeacher
};
