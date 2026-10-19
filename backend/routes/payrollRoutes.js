const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const {
  getSlips,
  getMySlips,
  generateMonthPayroll,
  paySalarySlip,
  updateSalarySlip
} = require('../controllers/payrollController');
const {
  getLoans,
  createLoan,
  toggleLoanMonthHold,
  updateLoan,
  deleteLoan
} = require('../controllers/staffLoanController');

const protect = authMiddleware.protect || authMiddleware;

router.use(protect);
router.use(enforceTenantScope);

router.get('/slips', getSlips);
router.get('/my-slips', getMySlips);
router.post('/generate-month', generateMonthPayroll);
router.patch('/slips/:id/pay', paySalarySlip);
router.put('/slips/:id', updateSalarySlip);

router.get('/loans', getLoans);
router.post('/loans', createLoan);
router.put('/loans/:id', updateLoan);
router.delete('/loans/:id', deleteLoan);
router.patch('/loans/:id/hold', toggleLoanMonthHold);

module.exports = router;
