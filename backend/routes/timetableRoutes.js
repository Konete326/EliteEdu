const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { getBellSchedule, saveBellSchedule } = require('../controllers/bellScheduleController');
const {
  getTimetableSlots,
  getMySchedule,
  assignTimetableSlot,
  deleteTimetableSlot
} = require('../controllers/timetableController');
const {
  getSubstitutions,
  assignSubstitution,
  createQuickAdjustment,
  cancelSubstitution
} = require('../controllers/timetableSubstitutionController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope, authorizeRoles('Admin', 'Teacher', 'SuperAdmin'));

router.get('/bell-schedule', getBellSchedule);
router.put('/bell-schedule', saveBellSchedule);
router.get('/my-schedule', getMySchedule);
router.get('/substitutions', getSubstitutions);
router.post('/substitutions', assignSubstitution);
router.post('/quick-adjustment', createQuickAdjustment);
router.delete('/substitutions/:id', cancelSubstitution);
router.post('/assign', assignTimetableSlot);
router.get('/', getTimetableSlots);
router.post('/', assignTimetableSlot);
router.delete('/:id', deleteTimetableSlot);

module.exports = router;
