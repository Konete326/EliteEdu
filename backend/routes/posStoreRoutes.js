const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  getSales,
  checkout
} = require('../controllers/posStoreController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope);

router.get('/items', getItems);
router.post('/items', createItem);
router.put('/items/:id', updateItem);
router.delete('/items/:id', deleteItem);

router.post('/checkout', checkout);
router.post('/sales', checkout);
router.get('/sales', getSales);

module.exports = router;
