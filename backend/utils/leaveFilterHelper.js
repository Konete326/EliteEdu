const { getTeacherAllowedGradeIds } = require('./attendanceAccessHelper');

const buildLeaveFilter = async (user, query) => {
  const filter = { school_id: user.school_id };
  if (query.campus_id && query.campus_id !== 'all') filter.campus_id = query.campus_id;
  if (query.status && query.status !== 'all') filter.status = query.status;
  if (query.applicant_type && query.applicant_type !== 'all') filter.applicant_type = query.applicant_type;

  if (user.role === 'Teacher') {
    const allowedGrades = await getTeacherAllowedGradeIds(user);
    const allowedIds = allowedGrades.map((g) => g._id);
    if (query.applicant_type === 'Staff') {
      filter.staff_id = user.id;
    } else if (query.applicant_type === 'Student') {
      filter.grade_id = query.grade_id && query.grade_id !== 'all' ? query.grade_id : { $in: allowedIds };
    } else {
      filter.$or = [{ staff_id: user.id }, { grade_id: { $in: allowedIds } }];
    }
  } else if (query.grade_id && query.grade_id !== 'all') {
    filter.grade_id = query.grade_id;
  }
  return filter;
};

module.exports = { buildLeaveFilter };
