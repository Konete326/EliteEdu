const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateNextEmployeeCode } = require('../utils/employeeCodeGenerator');

const syncAssignments = (data) => {
  if (Array.isArray(data.class_assignments)) {
    data.subjects = [...new Set(data.class_assignments.map((ca) => ca.subject_id).filter(Boolean))];
    data.grades = [...new Set(data.class_assignments.map((ca) => ca.grade_id).filter(Boolean))];
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

    const payload = {
      ...rest,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      employee_code: finalCode,
      role: 'Teacher',
      school_id: schoolId,
      status: rest.status || 'Active',
      is_active: rest.status !== 'Inactive'
    };

    syncAssignments(payload);
    const teacher = await User.create(payload);

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

    syncAssignments(updateData);

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

module.exports = { addTeacher, updateTeacher };
