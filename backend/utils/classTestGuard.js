const canTeacherAccessClassTest = (user, gradeId, section, subjectId, testTeacherId) => {
  if (!user) return false;
  if (user.role === 'Admin' || user.role === 'SuperAdmin') return true;
  if (testTeacherId && String(testTeacherId) === String(user._id || user.id)) return true;

  const assignedClasses = user.class_assignments || [];
  const assignedGrades = (user.grades || []).map((g) => String(g._id || g));
  const assignedSubjects = (user.subjects || []).map((s) => String(s._id || s));

  const strGrade = String(gradeId || '');
  const strSubj = String(subjectId || '');

  const matchesAssignment = assignedClasses.some((ca) => {
    const gMatch = String(ca.grade_id?._id || ca.grade_id) === strGrade;
    const sMatch = !subjectId || String(ca.subject_id?._id || ca.subject_id) === strSubj;
    const secMatch = !section || !ca.section || ca.section === section;
    return gMatch && sMatch && secMatch;
  });

  if (matchesAssignment) return true;
  if (assignedGrades.includes(strGrade) && (!subjectId || assignedSubjects.includes(strSubj))) return true;

  return false;
};

const buildTeacherFilter = (user) => {
  if (!user || user.role === 'Admin' || user.role === 'SuperAdmin') return {};
  const userId = user._id || user.id;
  const assignedGrades = (user.grades || []).map((g) => g._id || g);
  const caGrades = (user.class_assignments || []).map((ca) => ca.grade_id).filter(Boolean);
  const allGrades = Array.from(new Set([...assignedGrades, ...caGrades]));

  return {
    $or: [
      { teacher_id: userId },
      { created_by: userId },
      { grade_id: { $in: allGrades } }
    ]
  };
};

module.exports = { canTeacherAccessClassTest, buildTeacherFilter };
