const express = require('express');
const { login, getMe } = require('../controllers/authController');
const { getProfile, updateProfile, uploadAvatar } = require('../controllers/profileController');
const { updateActiveCampus } = require('../controllers/authActiveCampusHelper');
const { completeOnboarding } = require('../controllers/onboardingController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.patch('/active-campus', authMiddleware, updateActiveCampus);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.patch('/profile', authMiddleware, updateProfile);
router.post('/upload-avatar', authMiddleware, uploadAvatar);
router.post('/complete-onboarding', authMiddleware, completeOnboarding);

module.exports = router;
