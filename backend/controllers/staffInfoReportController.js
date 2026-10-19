const mongoose = require('mongoose');
const User = require('../models/User');
const StaffAttendance = require('../models/StaffAttendance');
const { getInstitutionHeader } = require('../utils/reportHelpers');

const getStaffInfoReport = async (req, res) => {
  try {
    const { campus_id, designation, role, status, search } = req.query;
    const school_id = req.user.school_id;
    const filter = { school_id: new mongoose.Types.ObjectId(school_id), role: { $ne: 'Student' } };

    if (campus_id && campus_id !== 'all' && mongoose.Types.ObjectId.isValid(campus_id)) {
      filter.$or = [{ campus_id: new mongoose.Types.ObjectId(campus_id) }, { campus_id: null }];
    }
    if (role && role !== 'all') {
      filter.role = new RegExp('^' + role.trim() + '$', 'i');
    }
    if (designation && designation !== 'all') {
      filter.designation = new RegExp('^' + designation.trim() + '$', 'i');
    }
    if (status && status !== 'all') {
      filter.status = new RegExp('^' + status.trim() + '$', 'i');
    }
    if (search && search.trim()) {
      const s = search.trim();
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { name: new RegExp(s, 'i') },
          { employee_code: new RegExp(s, 'i') },
          { email: new RegExp(s, 'i') },
          { contact_number: new RegExp(s, 'i') },
          { cnic: new RegExp(s, 'i') }
        ]
      });
    }

    const staffList = await User.find(filter)
      .populate('campus_id', 'name')
      .sort({ name: 1 })
      .lean();

    const monthPrefix = new Date().toISOString().slice(0, 7);
    const attAgg = await StaffAttendance.aggregate([
      { $match: { school_id: new mongoose.Types.ObjectId(school_id), date: { $regex: `^${monthPrefix}` } } },
      { $group: { _id: { staff_id: '$staff_id', status: '$status' }, count: { $sum: 1 } } }
    ]);

    const attMap = {};
    attAgg.forEach((a) => {
      const sid = String(a._id.staff_id);
      if (!attMap[sid]) attMap[sid] = { P: 0, A: 0, L: 0, LT: 0 };
      attMap[sid][a._id.status] = a.count;
    });

    const baseKpi = { school_id: new mongoose.Types.ObjectId(school_id), role: { $ne: 'Student' } };
    if (campus_id && campus_id !== 'all' && mongoose.Types.ObjectId.isValid(campus_id)) {
      baseKpi.$or = [{ campus_id: new mongoose.Types.ObjectId(campus_id) }, { campus_id: null }];
    }

    const [totalStaff, activeTeachers, supportAndAdminStaff, salaryAgg] = await Promise.all([
      User.countDocuments(baseKpi),
      User.countDocuments({ ...baseKpi, role: 'Teacher', status: { $regex: '^active$', $options: 'i' } }),
      User.countDocuments({ ...baseKpi, role: { $in: ['Admin', 'Staff', 'SuperAdmin'] } }),
      User.aggregate([
        { $match: { ...baseKpi, status: { $regex: '^active$', $options: 'i' } } },
        { $group: { _id: null, total: { $sum: '$basic_salary' } } }
      ])
    ]);

    const header = await getInstitutionHeader(school_id, campus_id);
    const totalMonthlyPayroll = salaryAgg[0]?.total || 0;

    const rows = staffList.map((u, idx) => {
      const a = attMap[String(u._id)] || { P: 0, A: 0, L: 0, LT: 0 };
      const presentDays = (a.P || 0) + (a.LT || 0);
      const absentDays = a.A || 0;
      const leaveDays = a.L || 0;
      return {
        sr: idx + 1,
        id: u._id,
        emp_code: u.employee_code || `EMP-${idx + 101}`,
        name: u.name,
        role: u.role,
        designation: u.designation || u.role,
        qualification: u.qualification || '—',
        contact_number: u.contact_number || u.phone || '—',
        email: u.email || '—',
        cnic: u.cnic || '—',
        joining_date: u.joining_date ? new Date(u.joining_date).toISOString().split('T')[0] : '—',
        present_mtd: `${presentDays} days`,
        absent_leave_mtd: `${absentDays}A / ${leaveDays}L`,
        basic_salary: u.basic_salary ? `PKR ${u.basic_salary.toLocaleString()}` : 'PKR 0',
        status: u.status || 'Active'
      };
    });

    return res.status(200).json({
      success: true,
      data: rows,
      kpis: {
        totalStaff,
        activeTeachers,
        supportAndAdminStaff,
        totalMonthlyPayroll
      },
      header
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStaffInfoReport };
