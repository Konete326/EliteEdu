const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const School = require('../models/School');
const User = require('../models/User');

const registerSchool = async (req, res) => {
  const { schoolData, adminData } = req.body;

  if (!schoolData || !adminData) {
    return res.status(400).json({ message: 'School data and admin data are required' });
  }

  const { name, code, school_type, board, address, contact_number, email } = schoolData;
  const { name: adminName, email: adminEmail, password: adminPassword } = adminData;

  if (!name || !code || !school_type || !adminName || !adminEmail || !adminPassword) {
    return res.status(400).json({ message: 'Required school or admin fields missing' });
  }

  if (!['Government', 'Private'].includes(school_type)) {
    return res.status(400).json({ message: 'School type must be Government or Private' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingSchool = await School.findOne({ code: code.toUpperCase().trim() }).session(session);
    if (existingSchool) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: 'School code already exists' });
    }

    const existingUser = await User.findOne({ email: adminEmail.toLowerCase().trim() }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: 'Admin email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const [school] = await School.create(
      [
        {
          name: name.trim(),
          code: code.toUpperCase().trim(),
          school_type,
          board: board ? board.trim() : undefined,
          address,
          contact_number,
          email
        }
      ],
      { session }
    );

    const [admin] = await User.create(
      [
        {
          name: adminName.trim(),
          email: adminEmail.toLowerCase().trim(),
          password: hashedPassword,
          role: 'Admin',
          school_id: school._id
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      school: {
        id: school._id,
        name: school.name,
        code: school.code,
        school_type: school.school_type,
        board: school.board
      },
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Failed to register school and admin', error: error.message });
  }
};

const getSchools = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database connecting, please retry shortly' });
  }

  try {
    const [schools, admins] = await Promise.all([
      School.find().sort({ createdAt: -1 }).lean(),
      User.find({ role: 'Admin' }).select('name email school_id').lean()
    ]);
    const adminMap = new Map(
      admins.filter((a) => a && a.school_id).map((a) => [String(a.school_id), a])
    );
    const result = schools.map((s) => ({ ...s, admin: adminMap.get(String(s._id)) || null }));
    res.status(200).json({ schools: result });
  } catch (error) {
    console.error('getSchools error:', error);
    res.status(500).json({ message: 'Failed to fetch schools', error: error.message });
  }
};

module.exports = { registerSchool, getSchools };
