const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enforceTenantScope, requireTeacherPermission } = require('../middlewares/tenantGuard');
const controller = require('../controllers/promotionController');

const router = express.Router();

router.use(authMiddleware, enforceTenantScope);

router.get('/candidates', requireTeacherPermission('student_promotion'), controller.getCandidates);
router.post('/promote', requireTeacherPermission('student_promotion'), controller.promoteStudents);

module.exports = router;
