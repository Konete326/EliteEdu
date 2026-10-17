const School = require('../models/School');
const Campus = require('../models/Campus');
const { getTeacherAllowedGradeIds } = require('../utils/attendanceAccessHelper');
const { aggregateClassSummary } = require('../utils/attendanceClassSummaryHelper');
const { buildStudentMonthlyMatrix, buildStaffMonthlyMatrix } = require('../utils/attendanceMonthlyMatrixHelper');

const getReportHeader = async (schoolId, campusId) => {
  const [school, campus] = await Promise.all([
    School.findById(schoolId).select('name logo_url address phone').lean(),
    campusId && campusId !== 'all' ? Campus.findById(campusId).select('name address phone').lean() : null
  ]);
  return {
    school_name: school?.name || 'Institution',
    school_logo: school?.logo_url || '',
    campus_name: campus?.name || 'All Campuses',
    address: campus?.address || school?.address || ''
  };
};

const getClassSummary = async (req, res) => {
  try {
    let allowedGradeIds = null;
    if (req.user.role === 'Teacher') {
      const allowed = await getTeacherAllowedGradeIds(req.user);
      allowedGradeIds = allowed.map((g) => g._id);
    }
    const header = await getReportHeader(req.user.school_id, req.query.campus_id);
    const data = await aggregateClassSummary(req.user.school_id, req.query.campus_id, req.query.date, allowedGradeIds);
    res.json({ success: true, header, ...data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getStudentMonthlyMatrix = async (req, res) => {
  try {
    const { month, grade_id, section, campus_id, search } = req.query;
    if (req.user.role === 'Teacher' && grade_id && grade_id !== 'all') {
      const allowed = await getTeacherAllowedGradeIds(req.user);
      const isAllowed = allowed.some((g) => String(g._id) === String(grade_id));
      if (!isAllowed) return res.status(403).json({ success: false, message: 'Unauthorized for this class' });
    }
    const header = await getReportHeader(req.user.school_id, campus_id);
    const data = await buildStudentMonthlyMatrix(req.user.school_id, campus_id, grade_id, section, month, search);
    res.json({ success: true, header, month: month || new Date().toISOString().slice(0, 7), ...data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getStaffMonthlyMatrix = async (req, res) => {
  try {
    const { month, campus_id, designation, search } = req.query;
    const staffIdLimit = req.user.role === 'Teacher' ? req.user.id : null;
    const header = await getReportHeader(req.user.school_id, campus_id);
    const data = await buildStaffMonthlyMatrix(req.user.school_id, campus_id, month, designation, search, staffIdLimit);
    res.json({ success: true, header, month: month || new Date().toISOString().slice(0, 7), ...data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getClassSummary, getStudentMonthlyMatrix, getStaffMonthlyMatrix };
