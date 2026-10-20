const Grade = require('../models/Grade');
const User = require('../models/User');
const School = require('../models/School');

const resolveSchoolId = async (user) => {
  if (user?.school_id) return user.school_id;
  const s = await School.findOne().sort({ createdAt: 1 }).select('_id').lean();
  return s?._id || null;
};

const getTeacherAllowedGradeIds = async (user) => {
  if (!user) return [];
  const schoolId = await resolveSchoolId(user);
  if (!schoolId) return [];

  if (user.role === 'Admin' || user.role === 'SuperAdmin') {
    return Grade.find({ school_id: schoolId })
      .select('_id name sections campus_id class_teacher status')
      .populate('class_teacher', 'name email')
      .lean();
  }

  const userDoc = await User.findById(user.id).select('grades class_assignments').lean();
  const assignedIds = (userDoc?.grades || []).map((id) => String(id));
  const classAssignmentGradeIds = (userDoc?.class_assignments || [])
    .map((ca) => String(ca.grade_id))
    .filter(Boolean);
  const classNames = (userDoc?.class_assignments || [])
    .map((ca) => ca.class_name || ca.grade_name || ca.name)
    .filter(Boolean);

  const orConditions = [
    { class_teacher: user.id },
    { _id: { $in: [...assignedIds, ...classAssignmentGradeIds] } }
  ];
  if (classNames.length > 0) {
    orConditions.push({ name: { $in: classNames } });
  }

  return Grade.find({
    school_id: schoolId,
    $or: orConditions
  })
    .select('_id name sections campus_id class_teacher status')
    .populate('class_teacher', 'name email')
    .lean();
};

const verifyClassAccess = async (user, gradeId) => {
  if (!user || !gradeId) return false;
  const schoolId = await resolveSchoolId(user);
  if (user.role === 'Admin' || user.role === 'SuperAdmin') {
    const grade = await Grade.findOne({
      ...(schoolId ? { school_id: schoolId } : {}),
      $or: [{ _id: gradeId }, { name: gradeId }]
    }).lean();
    return Boolean(grade);
  }

  const allowed = await getTeacherAllowedGradeIds(user);
  const target = String(gradeId).toLowerCase().trim();
  return allowed.some(
    (g) => String(g._id) === String(gradeId) || String(g.name).toLowerCase().trim() === target
  );
};

module.exports = { getTeacherAllowedGradeIds, verifyClassAccess };
