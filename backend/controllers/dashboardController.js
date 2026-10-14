const School = require('../models/School');
const User = require('../models/User');

const getSuperAdminStats = async (req, res) => {
  try {
    const [totalSchools, totalUsers, privateSchools, governmentSchools, totalTeachers, totalAdmins] = await Promise.all([
      School.countDocuments(),
      User.countDocuments(),
      School.countDocuments({ school_type: 'Private' }),
      School.countDocuments({ school_type: 'Government' }),
      User.countDocuments({ role: 'Teacher' }),
      User.countDocuments({ role: 'Admin' })
    ]);

    res.status(200).json({
      totalSchools,
      totalUsers,
      privateSchools,
      governmentSchools,
      totalTeachers,
      totalAdmins
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
};

const getAdminStats = async (req, res) => {
  const schoolId = req.user?.school_id;
  if (!schoolId) {
    return res.status(403).json({ message: 'Admin is not associated with any school' });
  }

  try {
    const [totalTeachers, totalStudents] = await Promise.all([
      User.countDocuments({ role: 'Teacher', school_id: schoolId }),
      User.countDocuments({ role: 'Student', school_id: schoolId })
    ]);

    res.status(200).json({
      totalTeachers,
      totalStudents
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
};

module.exports = { getSuperAdminStats, getAdminStats };
