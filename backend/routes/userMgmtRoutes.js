const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const userMgmt = require('../controllers/userMgmtController');
const userActions = require('../controllers/userMgmtActionsController');
const userRoles = require('../controllers/userRoleController');
const sessionMgmt = require('../controllers/sessionMgmtController');
const sessionIp = require('../controllers/sessionIpController');

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles('Admin', 'SuperAdmin'));

router.get('/users', userMgmt.getUsers);
router.post('/users', userMgmt.createUser);
router.put('/users/:id', userMgmt.updateUser);
router.patch('/users/:id/status', userActions.toggleUserStatus);
router.patch('/users/:id/reset-password', userActions.resetUserPassword);
router.patch('/users/:id/assign-campus', userActions.assignUserCampuses);
router.delete('/users/:id', userActions.deleteUser);

router.get('/roles', userRoles.getRoles);
router.post('/roles', userRoles.createRole);
router.put('/roles/:id', userRoles.updateRole);
router.patch('/roles/:id/assign-dashboard', userRoles.assignDashboard);
router.post('/roles/:id/copy-to-campus', userRoles.copyRoleToCampus);
router.delete('/roles/:id', userRoles.deleteRole);

router.get('/sessions', sessionMgmt.getSessions);
router.patch('/sessions/:id/revoke', sessionMgmt.revokeSession);
router.post('/sessions/revoke-user/:userId', sessionMgmt.revokeUserSessions);
router.post('/sessions/revoke-all', sessionMgmt.revokeAllSessions);
router.post('/sessions/block-ip', sessionIp.blockIp);
router.delete('/sessions/block-ip/:ip', sessionIp.unblockIp);

module.exports = router;
