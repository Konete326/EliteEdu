const mongoose = require('mongoose');
const Grade = require('../models/Grade');
const Campus = require('../models/Campus');
const Student = require('../models/Student');
const { sortGradesInSequence } = require('../utils/gradeSortHelper');

const getGrades = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { campus_id, search } = req.query;
    const schoolObj = mongoose.Types.ObjectId.isValid(schoolId) ? new mongoose.Types.ObjectId(String(schoolId)) : schoolId;
    const filter = { school_id: { $in: [schoolObj, String(schoolId)] } };

    if (campus_id && campus_id !== 'all' && mongoose.Types.ObjectId.isValid(campus_id)) {
      filter.campus_id = new mongoose.Types.ObjectId(String(campus_id));
    }
    if (search?.trim()) filter.name = { $regex: search.trim(), $options: 'i' };

    const [rawGrades, studentCounts] = await Promise.all([
      Grade.find(filter).populate('class_teacher', 'name email designation').populate('campus_id', 'name').lean(),
      Student.aggregate([
        { $match: { school_id: { $in: [schoolObj, String(schoolId)] } } },
        { $group: { _id: '$current_grade', count: { $sum: 1 } } }
      ])
    ]);

    const sMap = new Map(studentCounts.filter((s) => s._id).map((s) => [String(s._id), s.count]));
    const enriched = rawGrades.map((g) => ({ ...g, students_count: sMap.get(String(g._id)) || 0 }));
    const sortedGrades = sortGradesInSequence(enriched);
    res.status(200).json({ success: true, grades: sortedGrades, data: sortedGrades });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch grades', error: error.message });
  }
};

const createGrade = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { name, sections, campus_id, class_teacher, status = 'Active' } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Grade name is required' });

    let campusRef = null;
    if (campus_id && mongoose.Types.ObjectId.isValid(campus_id)) {
      const campus = await Campus.findOne({ _id: campus_id, school_id: schoolId });
      if (campus) campusRef = campus._id;
    }

    const count = await Grade.countDocuments({ school_id: schoolId });
    const grade = await Grade.create({
      school_id: schoolId,
      campus_id: campusRef,
      name: name.trim(),
      sections: Array.isArray(sections) && sections.length > 0 ? sections : ['A'],
      class_teacher: class_teacher && mongoose.Types.ObjectId.isValid(class_teacher) ? class_teacher : null,
      status: ['Active', 'Inactive'].includes(status) ? status : 'Active',
      order: count + 1
    });

    const populated = await Grade.findById(grade._id).populate('class_teacher', 'name email designation').populate('campus_id', 'name').lean();
    res.status(201).json({ success: true, grade: { ...populated, students_count: 0 } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create grade', error: error.message });
  }
};

const updateGrade = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { id } = req.params;
    const { name, sections, campus_id, class_teacher, status, order } = req.body;

    const update = {};
    if (name !== undefined) update.name = name.trim();
    if (sections !== undefined) update.sections = Array.isArray(sections) ? sections : ['A'];
    if (status !== undefined) update.status = status;
    if (order !== undefined) update.order = Number(order);
    if (class_teacher !== undefined) update.class_teacher = mongoose.Types.ObjectId.isValid(class_teacher) ? class_teacher : null;
    if (campus_id !== undefined) update.campus_id = mongoose.Types.ObjectId.isValid(campus_id) ? campus_id : null;

    const grade = await Grade.findOneAndUpdate({ _id: id, school_id: schoolId }, update, { new: true, runValidators: true })
      .populate('class_teacher', 'name email designation')
      .populate('campus_id', 'name')
      .lean();
    if (!grade) return res.status(404).json({ message: 'Grade not found' });

    const studentCount = await Student.countDocuments({ current_grade: grade._id });
    res.status(200).json({ success: true, grade: { ...grade, students_count: studentCount } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update grade', error: error.message });
  }
};

const deleteGrade = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const studentCount = await Student.countDocuments({ current_grade: req.params.id });
    if (studentCount > 0) {
      return res.status(400).json({
        message: `Cannot delete grade because ${studentCount} active student(s) are enrolled in it. Please reassign students first.`
      });
    }

    const grade = await Grade.findOneAndDelete({ _id: req.params.id, school_id: schoolId });
    if (!grade) return res.status(404).json({ message: 'Grade not found' });
    res.status(200).json({ success: true, message: 'Grade deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete grade', error: error.message });
  }
};

module.exports = { getGrades, createGrade, updateGrade, deleteGrade };
