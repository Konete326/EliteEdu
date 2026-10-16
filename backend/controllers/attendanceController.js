const query = require('./attendanceQueryController');
const mutation = require('./attendanceMutationController');

module.exports = {
  getAllowedClasses: query.getAllowedClasses,
  getAttendanceSheet: query.getAttendanceSheet,
  markBulkAttendance: mutation.markBulkAttendance,
  scanCard: mutation.scanCard
};
