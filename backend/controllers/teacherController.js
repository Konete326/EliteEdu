const bcrypt = require('bcryptjs');
const User = require('../models/User');

const addTeacher = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const schoolId = req.user?.school_id;
  if (!schoolId) {
    return res.status(403).json({ message: 'Admin is not associated with any school' });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const defaultPassword = 'Teacher123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const teacher = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'Teacher',
      school_id: schoolId
    });

    res.status(201).json({
      message: 'Teacher added successfully',
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        school_id: teacher.school_id
      },
      temporaryPassword: defaultPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add teacher', error: error.message });
  }
};

const getTeachers = async (req, res) => {
  const schoolId = req.user?.school_id;

  if (!schoolId) {
    return res.status(403).json({ message: 'Admin is not associated with any school' });
  }

  try {
    const teachers = await User.find({ role: 'Teacher', school_id: schoolId })
      .sort({ createdAt: -1 })
      .select('-password')
      .lean();

    res.status(200).json({ teachers });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teachers', error: error.message });
  }
};

module.exports = { addTeacher, getTeachers };
