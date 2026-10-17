const Campus = require('../models/Campus');
const Grade = require('../models/Grade');
const Subject = require('../models/Subject');
const User = require('../models/User');
const Student = require('../models/Student');
const { GradingPolicy, DEFAULT_SCALE } = require('../models/GradingPolicy');

const getPrerequisites = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const campusId = req.query.campus_id;
    const campusFilter = { school_id: schoolId };
    if (campusId) campusFilter._id = campusId;

    const [campuses, grades, subjects, teachers, studentsCount, policy] = await Promise.all([
      Campus.find({ school_id: schoolId }).select('name code is_main').lean(),
      Grade.find({ school_id: schoolId }).select('name sections campus_id').sort({ name: 1 }).lean(),
      Subject.find({ school_id: schoolId }).select('name code grade_id').sort({ name: 1 }).lean(),
      User.find({ school_id: schoolId, role: 'Teacher', status: { $ne: 'Inactive' } })
        .select('name email employee_code designation photo_url')
        .sort({ name: 1 })
        .lean(),
      Student.countDocuments({ school_id: schoolId, status: 'Active' }),
      GradingPolicy.findOne({ school_id: schoolId }).lean()
    ]);

    res.status(200).json({
      success: true,
      data: {
        campuses,
        grades,
        subjects,
        teachers,
        studentsCount,
        gradingPolicy: policy || { grading_scale: DEFAULT_SCALE, fail_criteria: { subject_percentage: 33 } }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPrerequisites };
