const express = require('express');
const { login, getMe } = require('../controllers/authController');
const { updateProfile } = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.get('/profile', authMiddleware, getMe);
router.put('/profile', authMiddleware, updateProfile);
router.patch('/profile', authMiddleware, updateProfile);

module.exports = router;
