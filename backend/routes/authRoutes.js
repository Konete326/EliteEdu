const express = require('express');
const { login, getMe } = require('../controllers/authController');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { updateActiveCampus } = require('../controllers/authActiveCampusHelper');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.patch('/active-campus', authMiddleware, updateActiveCampus);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.patch('/profile', authMiddleware, updateProfile);

module.exports = router;
