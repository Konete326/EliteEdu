const mongoose = require('mongoose');
const User = require('../models/User');
const StaffAttendance = require('../models/StaffAttendance');
const { getInstitutionHeader } = require('../utils/reportHelpers');

const getStaffInfoReport = async (req, res) => {
  try {
    const { campus_id, designation, status, search } = req.query;
    const school_id = req.user.school_id;
    const filter = { school_id, role: { $in: ['Teacher', 'Admin', 'Staff'] } };

    if (campus_id && campus_id !== 'all' && mongoose.Types.ObjectId.isValid(campus_id)) {
      filter.campus_id = campus_id;
    }
    if (designation && designation !== 'all') {
      filter.designation = designation;
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (search && search.trim()) {
      const s = search.trim();
      filter.$or = [
        { name: new RegExp(s, 'i') },
        { employee_code: new RegExp(s, 'i') },
        { email: new RegExp(s, 'i') },
        { contact_number: new RegExp(s, 'i') }
      ];
    }

    const staffList = await User.find(filter)
      .populate('campus_id', 'name')
      .populate('grades', 'name')
      .sort({ name: 1 })
      .lean();

    const todayStr = new Date().toISOString().split('T')[0];
    const baseKpiFilter = { school_id, role: { $in: ['Teacher', 'Admin', 'Staff'] } };
    if (campus_id && campus_id !== 'all' && mongoose.Types.ObjectId.isValid(campus_id)) {
      baseKpiFilter.campus_id = campus_id;
    }

    const [totalStaff, activeTeachers, onLeaveToday, salaryAgg] = await Promise.all([
      User.countDocuments(baseKpiFilter),
      User.countDocuments({ ...baseKpiFilter, role: 'Teacher', status: 'Active' }),
      StaffAttendance.countDocuments({ school_id, date: todayStr, status: 'L' }),
      User.aggregate([
        { $match: { ...baseKpiFilter, status: 'Active' } },
        { $group: { _id: null, totalBudget: { $sum: '$basic_salary' } } }
      ])
    ]);

    const header = await getInstitutionHeader(school_id, campus_id);
    const totalPayrollBudget = salaryAgg[0]?.totalBudget || 0;

    const rows = staffList.map((u, idx) => ({
      sr: idx + 1,
      id: u._id,
      name: u.name,
      photo_url: u.photo_url || '',
      employee_code: u.employee_code || '—',
      role: u.role,
      designation: u.designation || u.role,
      bps_grade: u.bps_grade ? `BPS-${u.bps_grade}` : '—',
      department: u.department || 'Academics',
      campus_name: u.campus_id?.name || 'Main Campus',
      contact_number: u.contact_number || '—',
      email: u.email || '—',
      basic_salary: u.basic_salary || 0,
      joining_date: u.joining_date ? new Date(u.joining_date).toISOString().split('T')[0] : '—',
      status: u.status || 'Active',
      qualification: u.qualification || '—',
      gender: u.gender || 'Male',
      assigned_classes: (u.grades || []).map((g) => g.name).join(', ') || 'General'
    }));

    return res.status(200).json({
      success: true,
      data: rows,
      kpis: {
        totalStaff,
        activeTeachers,
        onLeaveToday,
        totalPayrollBudget
      },
      header: {
        ...header,
        school_name: header.schoolName,
        campus_name: header.campusName,
        address: header.campusAddress
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStaffInfoReport };
