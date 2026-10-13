const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedSuperAdmin = async () => {
  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  try {
    const existingSuperAdmin = await User.findOne({ role: 'SuperAdmin' });
    if (existingSuperAdmin) {
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name: 'Super Admin',
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'SuperAdmin',
      school_id: null
    });

    console.log('SuperAdmin initialized from .env');
  } catch (error) {
    console.error('Failed to seed SuperAdmin:', error.message);
  }
};

module.exports = seedSuperAdmin;
