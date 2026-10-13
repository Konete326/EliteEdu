const express = require('express');
const { addTeacher, getTeachers } = require('../controllers/teacherController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, authorizeRoles('Admin'), addTeacher);
router.get('/', authMiddleware, authorizeRoles('Admin'), getTeachers);

module.exports = router;
