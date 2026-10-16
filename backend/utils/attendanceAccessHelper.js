const Grade = require('../models/Grade');
const User = require('../models/User');

const getTeacherAllowedGradeIds = async (user) => {
  if (!user || !user.school_id) return [];
  if (user.role === 'Admin' || user.role === 'SuperAdmin') {
    const allGrades = await Grade.find({ school_id: user.school_id }).select('_id name sections campus_id class_teacher status').populate('class_teacher', 'name email').lean();
    return allGrades;
  }

  const userDoc = await User.findById(user.id).select('grades class_assignments').lean();
  const assignedIds = (userDoc?.grades || []).map((id) => String(id));
  const classAssignmentGradeIds = (userDoc?.class_assignments || []).map((ca) => String(ca.grade_id)).filter(Boolean);

  const teacherGrades = await Grade.find({
    school_id: user.school_id,
    $or: [
      { class_teacher: user.id },
      { _id: { $in: [...assignedIds, ...classAssignmentGradeIds] } }
    ]
  }).select('_id name sections campus_id class_teacher status').populate('class_teacher', 'name email').lean();

  return teacherGrades;
};

const verifyClassAccess = async (user, gradeId) => {
  if (!user || !gradeId) return false;
  if (user.role === 'Admin' || user.role === 'SuperAdmin') {
    const grade = await Grade.findOne({ _id: gradeId, school_id: user.school_id }).lean();
    return Boolean(grade);
  }

  const allowed = await getTeacherAllowedGradeIds(user);
  return allowed.some((g) => String(g._id) === String(gradeId));
};

module.exports = { getTeacherAllowedGradeIds, verifyClassAccess };
