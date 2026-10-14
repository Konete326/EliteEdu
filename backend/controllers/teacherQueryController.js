const mongoose = require('mongoose');
const User = require('../models/User');

const getTeachers = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { campus_id, designation, bps_grade, search } = req.query;
    const filter = { school_id: schoolId, role: 'Teacher' };

    if (campus_id && campus_id !== 'all' && mongoose.Types.ObjectId.isValid(campus_id)) {
      filter.campus_id = campus_id;
    }
    if (designation && designation !== 'all') filter.designation = designation;
    if (bps_grade && bps_grade !== 'all') filter.bps_grade = bps_grade;

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { contact_number: { $regex: q, $options: 'i' } },
        { employee_code: { $regex: q, $options: 'i' } },
        { cnic: { $regex: q, $options: 'i' } }
      ];
    }

    const teachers = await User.find(filter)
      .populate('campus_id', 'name')
      .populate('subjects', 'name code')
      .populate('grades', 'name sections')
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teachers', error: error.message });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const teacher = await User.findOne({ _id: req.params.id, school_id: schoolId, role: 'Teacher' })
      .populate('campus_id', 'name')
      .populate('subjects', 'name code')
      .populate('grades', 'name sections')
      .populate('class_assignments.subject_id', 'name code')
      .populate('class_assignments.grade_id', 'name sections')
      .select('-password');

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teacher', error: error.message });
  }
};

module.exports = { getTeachers, getTeacherById };
