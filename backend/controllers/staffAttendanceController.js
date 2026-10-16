const { getStaffSheet, getMyHistory } = require('./staffAttendanceQueryController');
const { markBulkStaff, scanStaffCard } = require('./staffAttendanceMutationController');

module.exports = {
  getStaffSheet,
  getMyHistory,
  markBulkStaff,
  scanStaffCard
};
