const Student = require('../models/Student');
const { GradingPolicy } = require('../models/GradingPolicy');
const PromotionLog = require('../models/PromotionLog');
const User = require('../models/User');

const getCandidates = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const { campus_id, grade_id, section, search } = req.query;

    const filter = { school_id: schoolId, status: 'Active' };
    if (campus_id && campus_id !== 'ALL') filter.campus_id = campus_id;
    if (grade_id && grade_id !== 'ALL') filter.current_grade = grade_id;
    if (section && section !== 'ALL') filter.current_section = section;

    if (req.user.role === 'Teacher') {
      const teacher = await User.findById(req.user.id).select('grades app_settings app_permissions custom_role_id').lean();
      const allowed = teacher?.app_settings?.student_promotion !== false && teacher?.app_permissions?.student_promotion !== false;
      if (!allowed) {
        return res.status(403).json({ success: false, message: 'Permission denied for student promotion' });
      }
      if (teacher?.grades?.length) {
        if (grade_id && !teacher.grades.some((g) => String(g) === String(grade_id))) {
          return res.status(403).json({ success: false, message: 'Access denied for this class' });
        }
        if (!grade_id || grade_id === 'ALL') {
          filter.current_grade = { $in: teacher.grades };
        }
      }
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { father_name: regex }, { gr_number: regex }];
    }

    const [students, gradingPolicy, recentPromotions] = await Promise.all([
      Student.find(filter)
        .populate('current_grade', 'name')
        .populate('campus_id', 'name')
        .sort({ name: 1 })
        .lean(),
      GradingPolicy.findOne({ school_id: schoolId }).lean(),
      PromotionLog.find({ school_id: schoolId }).sort({ createdAt: -1 }).limit(5).lean()
    ]);

    const passThreshold = gradingPolicy?.fail_criteria?.passing_marks || 33;

    const candidates = students.map((s) => {
      const score = typeof s.latest_exam_percentage === 'number' ? s.latest_exam_percentage : 70;
      return {
        ...s,
        calculated_exam_percentage: score,
        is_eligible_for_auto_promote: score >= passThreshold
      };
    });

    return res.status(200).json({
      success: true,
      students: candidates,
      passThreshold,
      recentPromotions
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCandidates };
