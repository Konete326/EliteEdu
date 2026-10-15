const School = require('../models/School');
const User = require('../models/User');
const Campus = require('../models/Campus');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const Grade = require('../models/Grade');
const { buildAdminDashboardData } = require('../utils/dashboardDataBuilder');

const getSuperAdminStats = async (req, res) => {
  try {
    const [totalSchools, totalUsers, privateSchools, governmentSchools, totalTeachers, totalAdmins, recentSchools] = await Promise.all([
      School.countDocuments(),
      User.countDocuments(),
      School.countDocuments({ school_type: 'Private' }),
      School.countDocuments({ school_type: 'Government' }),
      User.countDocuments({ role: 'Teacher' }),
      User.countDocuments({ role: 'Admin' }),
      School.find().sort({ createdAt: -1 }).limit(5)
    ]);

    res.status(200).json({
      totalSchools,
      totalUsers,
      privateSchools,
      governmentSchools,
      totalTeachers,
      totalAdmins,
      recentSchools
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
    const [school, campuses, teachers, students, totalSubjects, grades] = await Promise.all([
      School.findById(schoolId).select('name school_type'),
      Campus.find({ school_id: schoolId }).select('name address status').sort({ createdAt: -1 }),
      User.find({ school_id: schoolId, role: 'Teacher' }).select('name dob campus_id status is_active'),
      Student.find({ school_id: schoolId }).select('name gender dob status campus_id monthly_fee discount admission_date address admission_test createdAt updatedAt'),
      Subject.countDocuments({ school_id: schoolId }),
      Grade.find({ school_id: schoolId }).select('name sections campus_id')
    ]);

    const dashboardData = buildAdminDashboardData(school, teachers, students, campuses, totalSubjects, grades);
    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
};

module.exports = { getSuperAdminStats, getAdminStats };
