const express = require('express');
const { verifyStudent } = require('../controllers/publicVerificationController');
const { verifyStaff } = require('../controllers/publicStaffVerificationController');

const router = express.Router();

router.get('/verify-student/:id', verifyStudent);
router.get('/verify-staff/:id', verifyStaff);

module.exports = router;
