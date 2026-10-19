const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope } = require('../middlewares/tenantGuard');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  assignStudent,
  getRoutePassengers,
  assignStudentToRoute,
  unassignStudentFromRoute
} = require('../controllers/transportController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope, authorizeRoles('Admin', 'SuperAdmin'));

router.get('/routes', getRoutes);
router.post('/routes', createRoute);
router.put('/routes/:id', updateRoute);
router.delete('/routes/:id', deleteRoute);
router.get('/routes/:id/passengers', getRoutePassengers);
router.post('/assign-student', assignStudent);
router.post('/routes/:id/assign-student', assignStudentToRoute);
router.delete('/routes/:id/unassign-student/:studentId', unassignStudentFromRoute);

module.exports = router;
