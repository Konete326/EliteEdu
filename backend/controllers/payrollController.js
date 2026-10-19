const { getSlips, getMySlips, updateSalarySlip } = require('./payrollQueryController');
const { generateMonthPayroll } = require('./payrollGenerateController');
const { paySalarySlip } = require('./payrollPaymentController');

module.exports = {
  getSlips,
  getMySlips,
  generateMonthPayroll,
  paySalarySlip,
  updateSalarySlip
};
