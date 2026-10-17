const Campus = require('../models/Campus');
const Grade = require('../models/Grade');
const Subject = require('../models/Subject');
const User = require('../models/User');

const getClassTestPrerequisites = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const isTeacher = req.user.role === 'Teacher';
    const gradeQuery = { school_id: schoolId };
    const subjectQuery = { school_id: schoolId };

    if (isTeacher) {
      const assignedGrades = (req.user.grades || []).map((g) => g._id || g);
      const caGrades = (req.user.class_assignments || []).map((ca) => ca.grade_id).filter(Boolean);
      const allG = Array.from(new Set([...assignedGrades, ...caGrades]));
      if (allG.length > 0) gradeQuery._id = { $in: allG };

      const assignedSubs = (req.user.subjects || []).map((s) => s._id || s);
      const caSubs = (req.user.class_assignments || []).map((ca) => ca.subject_id).filter(Boolean);
      const allS = Array.from(new Set([...assignedSubs, ...caSubs]));
      if (allS.length > 0) subjectQuery._id = { $in: allS };
    }

    const [campuses, grades, subjects, teachers] = await Promise.all([
      Campus.find({ school_id: schoolId }).select('name code address').lean(),
      Grade.find(gradeQuery).select('name code sections').lean(),
      Subject.find(subjectQuery).select('name code').lean(),
      User.find({ school_id: schoolId, role: 'Teacher', status: 'Active' }).select('name employee_code designation specialization class_assignments grades subjects').lean()
    ]);

    res.status(200).json({ success: true, campuses, grades, subjects, teachers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getClassTestPrerequisites };
