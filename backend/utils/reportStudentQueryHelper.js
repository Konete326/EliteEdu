const mongoose = require('mongoose');
const Student = require('../models/Student');
const { resolveTeacherGrades } = require('./reportHelpers');

const buildFlexibleStudentFilter = async (req) => {
  const {
    academic_session,
    grade_id,
    section,
    gender,
    status,
    search,
    religion,
    transport_route,
    discount_reference,
    campus_id
  } = req.query;

  const filter = { school_id: req.user.school_id };

  if (campus_id && campus_id !== 'all') {
    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [
        { campus_id: new mongoose.Types.ObjectId(campus_id) },
        { campus_id: null },
        { campus_id: { $exists: false } }
      ]
    });
  }

  const teacherGradeIds = await resolveTeacherGrades(req.user);
  if (teacherGradeIds) filter.current_grade = { $in: teacherGradeIds };
  if (grade_id && grade_id !== 'all') filter.current_grade = grade_id;
  if (section && section !== 'all') filter.current_section = new RegExp('^' + section.trim() + '$', 'i');

  if (academic_session && academic_session !== 'all') {
    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [
        { academic_session },
        { academic_session: null },
        { academic_session: '' },
        { academic_session: { $exists: false } }
      ]
    });
  }

  if (gender && gender !== 'all') {
    filter.gender = new RegExp('^' + gender.trim() + '$', 'i');
  }

  if (status && status !== 'all') {
    filter.status = new RegExp('^' + status.trim() + '$', 'i');
  }

  if (religion && religion !== 'all') {
    filter.religion = new RegExp('^' + religion.trim() + '$', 'i');
  }

  if (transport_route && transport_route.trim()) {
    filter.transport_route = new RegExp(transport_route.trim(), 'i');
  }

  if (discount_reference && discount_reference.trim()) {
    filter.discount_reference = new RegExp(discount_reference.trim(), 'i');
  }

  if (search && search.trim()) {
    const s = search.trim();
    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [
        { name: new RegExp(s, 'i') },
        { father_name: new RegExp(s, 'i') },
        { gr_number: new RegExp(s, 'i') },
        { contact_number: new RegExp(s, 'i') }
      ]
    });
  }

  return filter;
};

const getStudentCounters = async (schoolId, campusId, teacherGradeIds) => {
  const base = { school_id: schoolId };
  if (campusId && campusId !== 'all') {
    base.$or = [
      { campus_id: new mongoose.Types.ObjectId(campusId) },
      { campus_id: null },
      { campus_id: { $exists: false } }
    ];
  }
  if (teacherGradeIds) base.current_grade = { $in: teacherGradeIds };

  const [activeCount, registeredCount, inactiveCount, suspendedCount, leftCount] = await Promise.all([
    Student.countDocuments({ ...base, status: { $regex: '^active$', $options: 'i' } }),
    Student.countDocuments({ ...base, status: { $regex: '^registered$', $options: 'i' } }),
    Student.countDocuments({ ...base, status: { $regex: '^inactive$', $options: 'i' } }),
    Student.countDocuments({ ...base, status: { $regex: '^suspended$', $options: 'i' } }),
    Student.countDocuments({ ...base, status: { $regex: '^left$', $options: 'i' } })
  ]);

  return { activeCount, registeredCount, inactiveCount, suspendedCount, leftCount };
};

module.exports = {
  buildFlexibleStudentFilter,
  getStudentCounters
};
