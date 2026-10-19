const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { universalLookup, quickMarkAttendance } = require('../controllers/universalScannerController');

const router = express.Router();

router.use(protect);

router.post('/lookup', universalLookup);
router.post('/mark-attendance', quickMarkAttendance);

module.exports = router;
