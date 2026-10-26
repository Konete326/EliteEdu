const mongoose = require('mongoose');
const School = require('../models/School');
const User = require('../models/User');
const Campus = require('../models/Campus');
const Subject = require('../models/Subject');
const Grade = require('../models/Grade');
const Homework = require('../models/Homework');
const Student = require('../models/Student');
const StudentAttendance = require('../models/StudentAttendance');
const StaffAttendance = require('../models/StaffAttendance');
const { buildAdminDashboardData } = require('../utils/dashboardDataBuilder');
const {
  getAggregatedFeeStats,
  getAggregatedExpenseStats,
  getAggregatedStudentStats
} = require('../utils/dashboardAggregationHelper');

const getSuperAdminStats = async (req, res) => {
  try {
    const [totalSchools, totalUsers, privateSchools, governmentSchools, totalTeachers, totalAdmins, recentSchools] = await Promise.all([
      School.countDocuments(),
      User.countDocuments(),
      School.countDocuments({ school_type: 'Private' }),
      School.countDocuments({ school_type: 'Government' }),
      User.countDocuments({ role: 'Teacher' }),
      User.countDocuments({ role: 'Admin' }),
      School.find().sort({ createdAt: -1 }).limit(5).lean()
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
    const schoolObjId = new mongoose.Types.ObjectId(String(schoolId));
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const curDay = now.getDate();
    const startOfToday = new Date(curYear, curMonth, curDay);
    const startOfMonth = new Date(curYear, curMonth, 1);
    const startOfYear = new Date(curYear, 0, 1);
    const todayStr = now.toISOString().slice(0, 10);

    const [
      school,
      campuses,
      teachers,
      totalSubjects,
      grades,
      homework,
      todayAttendance,
      todayStaffAttendance,
      studentStats,
      feeStats,
      expenseStats,
      spotlightStudents
    ] = await Promise.all([
      School.findById(schoolObjId).select('name school_type').lean(),
      Campus.find({ school_id: schoolObjId }).select('name address status').sort({ createdAt: -1 }).lean(),
      User.find({ school_id: schoolObjId, role: 'Teacher' }).select('name dob campus_id status is_active').lean(),
      Subject.countDocuments({ school_id: schoolObjId }),
      Grade.find({ school_id: schoolObjId }).select('name sections campus_id').lean(),
      Homework.find({ school_id: schoolObjId }).select('title status is_published campus_id grade_id due_date createdAt').lean(),
      StudentAttendance.find({ school_id: schoolObjId, date: todayStr }).select('status student_id campus_id').lean(),
      StaffAttendance.find({ school_id: schoolObjId, date: todayStr }).select('status staff_id campus_id').lean(),
      getAggregatedStudentStats(schoolObjId, curYear, curMonth, curDay),
      getAggregatedFeeStats(schoolObjId, startOfYear, startOfMonth, startOfToday),
      getAggregatedExpenseStats(schoolObjId, startOfYear, startOfMonth, startOfToday),
      Student.find({ school_id: schoolObjId, status: 'Active' }).select('name father_name current_grade current_section photo_url gr_number admission_date campus_id status elective_stream').populate('current_grade', 'name').populate('campus_id', 'name').sort({ createdAt: -1 }).limit(18).lean()
    ]);

    const dashboardData = buildAdminDashboardData({
      school,
      teachers,
      campuses,
      totalSubjects,
      grades,
      homework,
      todayAttendance,
      todayStaffAttendance,
      studentStats,
      feeStats,
      expenseStats
    });

    res.status(200).json({ ...dashboardData, spotlightStudents });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
};

module.exports = { getSuperAdminStats, getAdminStats };
