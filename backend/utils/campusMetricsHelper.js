const mongoose = require('mongoose');
const Student = require('../models/Student');
const User = require('../models/User');
const Grade = require('../models/Grade');

const enrichCampusesWithCounts = async (campuses, schoolId) => {
  if (!campuses || !campuses.length) return [];

  const schoolObj = mongoose.Types.ObjectId.isValid(schoolId)
    ? new mongoose.Types.ObjectId(String(schoolId))
    : schoolId;
  const schoolFilter = { $in: [schoolObj, String(schoolId)] };

  const [studentCounts, teacherCounts, gradeCounts] = await Promise.all([
    Student.aggregate([
      { $match: { school_id: schoolFilter } },
      { $group: { _id: '$campus_id', count: { $sum: 1 } } }
    ]),
    User.aggregate([
      { $match: { school_id: schoolFilter, role: { $in: ['Teacher', 'Admin', 'Staff'] } } },
      { $group: { _id: '$campus_id', count: { $sum: 1 } } }
    ]),
    Grade.aggregate([
      { $match: { school_id: schoolFilter } },
      { $group: { _id: '$campus_id', count: { $sum: 1 } } }
    ])
  ]);

  const sMap = new Map(studentCounts.filter((s) => s._id).map((s) => [String(s._id), s.count]));
  const tMap = new Map(teacherCounts.filter((t) => t._id).map((t) => [String(t._id), t.count]));
  const gMap = new Map(gradeCounts.filter((g) => g._id).map((g) => [String(g._id), g.count]));

  return campuses.map((c) => {
    const obj = c.toObject ? c.toObject() : { ...c };
    const id = String(obj._id);
    obj.students_count = sMap.get(id) || 0;
    obj.teachers_count = tMap.get(id) || 0;
    obj.grades_count = gMap.get(id) || 0;
    return obj;
  });
};

module.exports = { enrichCampusesWithCounts };
