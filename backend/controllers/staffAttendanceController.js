const { getStaffSheet, getMyHistory } = require('./staffAttendanceQueryController');
const { markBulkStaff, scanStaffCard, resetStaffAttendance } = require('./staffAttendanceMutationController');

module.exports = {
  getStaffSheet,
  getMyHistory,
  markBulkStaff,
  scanStaffCard,
  resetStaffAttendance
};
