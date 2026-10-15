const express = require('express');
const { verifyStudent } = require('../controllers/publicVerificationController');

const router = express.Router();

router.get('/verify-student/:id', verifyStudent);

module.exports = router;
