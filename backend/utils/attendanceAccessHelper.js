const Grade = require('../models/Grade');
const User = require('../models/User');
const School = require('../models/School');
const TimetableSlot = require('../models/TimetableSlot');
const TimetableSubstitution = require('../models/TimetableSubstitution');

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

  const userDoc = await User.findById(user.id).select('grades class_assignments campus_id').lean();
  const assignedIds = (userDoc?.grades || []).map((id) => String(id));
  const classAssignmentGradeIds = (userDoc?.class_assignments || [])
    .map((ca) => String(ca.grade_id))
    .filter(Boolean);
  const classNames = (userDoc?.class_assignments || [])
    .map((ca) => ca.class_name || ca.grade_name || ca.name)
    .filter(Boolean);

  const [timetableSlots, substitutions] = await Promise.all([
    TimetableSlot.find({ school_id: schoolId, teacher_id: user.id })
      .select('grade_id section period_no')
      .lean(),
    TimetableSubstitution.find({
      school_id: schoolId,
      substitute_teacher_id: user.id,
      status: { $ne: 'Cancelled' }
    })
      .select('grade_id section period_no')
      .lean()
  ]);

  const timetableGradeIds = timetableSlots.map((s) => String(s.grade_id)).filter(Boolean);
  const subGradeIds = substitutions.map((s) => String(s.grade_id)).filter(Boolean);

  const orConditions = [
    { class_teacher: user.id },
    { _id: { $in: [...assignedIds, ...classAssignmentGradeIds, ...timetableGradeIds, ...subGradeIds] } }
  ];
  if (classNames.length > 0) {
    orConditions.push({ name: { $in: classNames } });
  }

  let grades = await Grade.find({
    school_id: schoolId,
    $or: orConditions
  })
    .select('_id name sections campus_id class_teacher status')
    .populate('class_teacher', 'name email')
    .lean();

  if (grades.length === 0 && assignedIds.length === 0 && classAssignmentGradeIds.length === 0 && timetableGradeIds.length === 0 && subGradeIds.length === 0) {
    grades = await Grade.find({ school_id: schoolId, status: { $ne: 'Inactive' } })
      .select('_id name sections campus_id class_teacher status')
      .populate('class_teacher', 'name email')
      .lean();
  }

  return grades;
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
