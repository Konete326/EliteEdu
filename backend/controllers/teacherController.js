const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Campus = require('../models/Campus');
const Subject = require('../models/Subject');
const Grade = require('../models/Grade');
const { generateNextEmployeeCode } = require('../utils/employeeCodeGenerator');

const getTeachers = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { campus_id, designation, bps_grade, search } = req.query;
    const filter = { school_id: schoolId, role: 'Teacher' };

    if (campus_id && campus_id !== 'all' && mongoose.Types.ObjectId.isValid(campus_id)) {
      filter.campus_id = campus_id;
    }
    if (designation && designation !== 'all') {
      filter.designation = designation;
    }
    if (bps_grade && bps_grade !== 'all') {
      filter.bps_grade = bps_grade;
    }
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
      .select('-password');

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teacher', error: error.message });
  }
};

const addTeacher = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { email, name, password, employee_code, ...rest } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const finalCode = employee_code?.trim() || (await generateNextEmployeeCode(schoolId));
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'Teacher123', salt);

    const teacher = await User.create({
      ...rest,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      employee_code: finalCode,
      role: 'Teacher',
      school_id: schoolId,
      status: rest.status || 'Active',
      is_active: rest.status !== 'Inactive'
    });

    res.status(201).json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add teacher', error: error.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { id } = req.params;
    const { password, email, ...updateData } = req.body;

    if (email) {
      const conflict = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: id } });
      if (conflict) return res.status(409).json({ message: 'Email is already used by another user' });
      updateData.email = email.toLowerCase().trim();
    }

    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password.trim(), salt);
    }

    if (updateData.status) {
      updateData.is_active = updateData.status === 'Active';
    }

    const teacher = await User.findOneAndUpdate(
      { _id: id, school_id: schoolId, role: 'Teacher' },
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update teacher', error: error.message });
  }
};

module.exports = { getTeachers, getTeacherById, addTeacher, updateTeacher };
