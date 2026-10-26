const bcrypt = require('bcryptjs');
const User = require('../models/User');
const School = require('../models/School');
const Campus = require('../models/Campus');

const seedSuperAdmin = async () => {
  const superEmail = (process.env.SUPERADMIN_EMAIL || 'admin@eliteedu.com').toLowerCase().trim();
  const superPassword = process.env.SUPERADMIN_PASSWORD || 'AdminPassword123!';

  try {
    const salt = await bcrypt.genSalt(10);
    const superAdminExists = await User.findOne({ role: 'SuperAdmin' });

    if (!superAdminExists) {
      const hashedPassword = await bcrypt.hash(superPassword, salt);
      await User.create({
        name: 'Super Admin',
        email: superEmail,
        password: hashedPassword,
        role: 'SuperAdmin',
        school_id: null,
        status: 'Active',
        is_active: true
      });
    }

    const schoolCount = await School.countDocuments();
    if (schoolCount === 0) {
      const school = await School.create({
        name: 'Elite Educational System',
        code: 'EES-01',
        school_type: 'Private',
        email: 'admin@school.edu',
        contact_number: '042-35870011',
        address: '45-A Main Boulevard, Gulberg III, Lahore',
        is_active: true
      });

      const campus = await Campus.create({
        school_id: school._id,
        name: 'Main Campus',
        address: '45-A Main Boulevard, Gulberg III, Lahore',
        contact_number: '042-35870011',
        email: 'main.campus@school.edu',
        status: 'Active'
      });

      const adminPasswordHash = await bcrypt.hash('AdminPassword123!', salt);
      await User.create({
        name: 'School Administrator',
        email: 'admin@school.edu',
        password: adminPasswordHash,
        role: 'Admin',
        school_id: school._id,
        campus_id: campus._id,
        last_active_campus: campus._id,
        assigned_campuses: [campus._id],
        status: 'Active',
        is_active: true
      });
    }
  } catch (error) {
    console.error('Initialization error:', error.message);
  }
};

module.exports = seedSuperAdmin;
