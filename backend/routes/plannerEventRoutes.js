const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const {
  getPlannersAndEvents,
  createPlannerOrEvent,
  updatePlannerOrEvent,
  deletePlannerOrEvent
} = require('../controllers/plannerEventController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope);

router.get('/', getPlannersAndEvents);
router.post('/', createPlannerOrEvent);
router.put('/:id', updatePlannerOrEvent);
router.delete('/:id', deletePlannerOrEvent);

module.exports = router;
