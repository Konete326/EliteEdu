const express = require('express');
const { verifyStudent } = require('../controllers/publicVerificationController');
const { verifyStaff } = require('../controllers/publicStaffVerificationController');
const { verifyCertificate } = require('../controllers/certificateVerificationController');

const router = express.Router();

router.get('/verify-student/:id', verifyStudent);
router.get('/verify-staff/:id', verifyStaff);
router.get('/verify-certificate/:certNo', verifyCertificate);

module.exports = router;
