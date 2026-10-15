const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  getApplicants,
  getApplicantById,
  createApplicant,
  updateApplicant,
  deleteApplicant
} = require('../controllers/staffApplicantController');
const {
  updateApplicantStatus,
  convertApplicantToTeacher
} = require('../controllers/staffApplicantActionController');

const router = express.Router();

router.use(authMiddleware, authorizeRoles('Admin'));

router.get('/', getApplicants);
router.get('/:id', getApplicantById);
router.post('/', createApplicant);
router.put('/:id', updateApplicant);
router.patch('/:id/status', updateApplicantStatus);
router.post('/:id/convert', convertApplicantToTeacher);
router.delete('/:id', deleteApplicant);

module.exports = router;
