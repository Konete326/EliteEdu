const StaffAttendance = require('../models/StaffAttendance');
const User = require('../models/User');
const School = require('../models/School');

const resolveSchoolId = async (req) => {
  if (req.user?.school_id) return req.user.school_id;
  const s = await School.findOne().sort({ createdAt: 1 }).select('_id').lean();
  return s?._id || null;
};

const buildSummary = (attendances, totalStaff) => {
  const summary = { total: totalStaff, present: 0, absent: 0, leave: 0, shortLeave: 0, late: 0, halfDay: 0, holiday: 0, unmarked: 0 };
  attendances.forEach((a) => {
    if (a.status === 'P') summary.present += 1;
    else if (a.status === 'A') summary.absent += 1;
    else if (a.status === 'L') summary.leave += 1;
    else if (a.status === 'SL') summary.shortLeave += 1;
    else if (a.status === 'Late' || a.status === 'LT') summary.late += 1;
    else if (a.status === 'H' || a.status === 'HD') summary.halfDay += 1;
    else if (a.status === 'Hol' || a.status === 'Off') summary.holiday += 1;
    else if (a.status === 'U') summary.unmarked += 1;
  });
  const marked = summary.present + summary.absent + summary.leave + summary.shortLeave + summary.late + summary.halfDay + summary.holiday;
  summary.unmarked = Math.max(0, totalStaff - marked);
  return summary;
};

const getStaffSheet = async (req, res) => {
  try {
    const school_id = await resolveSchoolId(req);
    const { date, campus_id, designation, department, search } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const staffQuery = { school_id, role: { $in: ['Teacher', 'Staff', 'Employee', 'Admin'] }, status: { $ne: 'Inactive' } };
    if (campus_id && campus_id !== 'ALL') staffQuery.campus_id = campus_id;
    if (designation && designation !== 'ALL') staffQuery.designation = designation;
    if (department && department !== 'ALL' && department !== 'All Departments') staffQuery.department = department;

    if (search && search.trim()) {
      const q = search.trim();
      staffQuery.$or = [
        { name: { $regex: q, $options: 'i' } },
        { father_name: { $regex: q, $options: 'i' } },
        { employee_code: { $regex: q, $options: 'i' } },
        { personal_id: { $regex: q, $options: 'i' } }
      ];
    }

    const staffMembers = await User.find(staffQuery)
      .select('name father_name designation bps_grade employee_code personal_id cnic photo_url campus_id department contact_number')
      .populate('campus_id', 'name')
      .sort({ name: 1 })
      .lean();

    const staffIds = staffMembers.map((s) => s._id);
    const existingAttendances = await StaffAttendance.find({ school_id, date, staff_id: { $in: staffIds } }).lean();
    const attendanceMap = new Map();
    existingAttendances.forEach((a) => attendanceMap.set(String(a.staff_id), a));

    const records = staffMembers.map((staff) => {
      const existing = attendanceMap.get(String(staff._id));
      return {
        staff,
        status: existing?.status || 'A',
        check_in_time: existing?.check_in_time || '',
        check_out_time: existing?.check_out_time || '',
        marked_via: existing?.marked_via || 'Manual',
        remarks: existing?.remarks || '',
        is_existing: Boolean(existing)
      };
    });

    const summary = buildSummary(existingAttendances.length > 0 ? existingAttendances : records, staffMembers.length);
    res.json({ success: true, date, total: staffMembers.length, summary, records });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve staff attendance sheet', error: err.message });
  }
};

const getMyHistory = async (req, res) => {
  try {
    const school_id = await resolveSchoolId(req);
    const staff_id = req.user.id || req.user._id;
    const { from, to, limit = 60 } = req.query;

    const query = { school_id, staff_id };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = from;
      if (to) query.date.$lte = to;
    }

    const history = await StaffAttendance.find(query).sort({ date: -1 }).limit(Number(limit)).lean();
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve personal attendance history', error: err.message });
  }
};

module.exports = { getStaffSheet, getMyHistory, buildSummary, resolveSchoolId };
