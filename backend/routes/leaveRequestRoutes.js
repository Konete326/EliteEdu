const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveStatus,
  deleteLeaveRequest
} = require('../controllers/leaveRequestController');

router.use(authMiddleware);
router.route('/').get(getLeaveRequests).post(createLeaveRequest);
router.patch('/:id/status', updateLeaveStatus);
router.delete('/:id', deleteLeaveRequest);

module.exports = router;
