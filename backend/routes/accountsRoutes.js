const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const {
  getAccountHeads,
  createAccountHead,
  updateAccountHead,
  deleteAccountHead
} = require('../controllers/accountHeadsController');
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  updateTransactionStatus
} = require('../controllers/accountTransactionsController');
const { getFinancialStatements } = require('../controllers/financialStatementController');

const protect = authMiddleware.protect || authMiddleware;

router.use(protect);
router.use(enforceTenantScope);

router.get('/heads', getAccountHeads);
router.post('/heads', createAccountHead);
router.put('/heads/:id', updateAccountHead);
router.delete('/heads/:id', deleteAccountHead);

router.get('/transactions', getTransactions);
router.post('/transactions', createTransaction);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);
router.patch('/transactions/:id/status', updateTransactionStatus);

router.get('/statements', getFinancialStatements);

module.exports = router;
