const mongoose = require('mongoose');
const StaffAttendance = require('../models/StaffAttendance');
const User = require('../models/User');
const { buildSummary } = require('./staffAttendanceQueryController');

const formatTimeNow = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

const resolveStaffMember = async (code, school_id) => {
  let staffId = null;
  const urlMatch = code.match(/(?:verify\/staff|staff)\/([a-f\d]{24})/i);
  if (urlMatch) staffId = urlMatch[1];
  else if (mongoose.Types.ObjectId.isValid(code) && code.length === 24) staffId = code;

  if (staffId) {
    return User.findOne({ _id: staffId, school_id, role: 'Teacher' }).populate('campus_id', 'name').lean();
  }
  return User.findOne({
    school_id, role: 'Teacher',
    $or: [{ employee_code: code }, { personal_id: code }, { cnic: code }]
  }).populate('campus_id', 'name').lean();
};

const markBulkStaff = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const marked_by = req.user.id || req.user._id;
    const date = req.body.date || new Date().toISOString().slice(0, 10);
    const attendances = req.body.attendances || req.body.records || [];
    if (!date || !Array.isArray(attendances)) return res.status(400).json({ message: 'Date and attendances required' });

    const operations = attendances.map((item) => {
      const sId = item.staff_id || item.staff?._id || item.staff?.id || item._id;
      return {
        updateOne: {
          filter: { school_id, staff_id: sId, date },
          update: {
            $set: {
              campus_id: item.campus_id || null,
              status: item.status || 'P',
              check_in_time: item.check_in_time || '',
              check_out_time: item.check_out_time || '',
              marked_via: item.marked_via || 'Manual',
              remarks: item.remarks || '',
              marked_by,
              scan_time: new Date()
            }
          },
          upsert: true
        }
      };
    }).filter((op) => op.updateOne.filter.staff_id);

    if (operations.length > 0) await StaffAttendance.bulkWrite(operations, { ordered: false });
    res.json({ success: true, message: `Updated attendance for ${operations.length} staff members` });
  } catch (err) {
    res.status(500).json({ message: 'Bulk attendance update failed', error: err.message });
  }
};

const scanStaffCard = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const marked_by = req.user.id || req.user._id;
    const { code, date, status = 'P' } = req.body;
    if (!code || !date) return res.status(400).json({ message: 'Code and date are required' });

    const staff = await resolveStaffMember(code.trim(), school_id);
    if (!staff) return res.status(404).json({ message: 'Staff member not found or does not belong to school' });

    const existing = await StaffAttendance.findOne({ school_id, staff_id: staff._id, date });
    const timeNow = formatTimeNow();
    let check_in = existing?.check_in_time || timeNow;
    let check_out = existing?.check_out_time || '';
    if (existing && existing.check_in_time && existing.check_in_time !== timeNow) check_out = timeNow;

    const attendance = await StaffAttendance.findOneAndUpdate(
      { school_id, staff_id: staff._id, date },
      {
        $set: {
          campus_id: staff.campus_id?._id || staff.campus_id || null,
          status, check_in_time: check_in, check_out_time: check_out,
          marked_via: 'Card_Scan', marked_by, scan_time: new Date()
        }
      },
      { upsert: true, new: true }
    );

    const [totalStaff, allAttendances] = await Promise.all([
      User.countDocuments({ school_id, role: 'Teacher', status: 'Active' }),
      StaffAttendance.find({ school_id, date }).lean()
    ]);

    const summary = buildSummary(allAttendances, totalStaff);
    res.json({
      success: true, staff, attendance, summary,
      message: `${staff.name} marked ${status === 'P' ? 'Present' : status}`
    });
  } catch (err) {
    res.status(500).json({ message: 'Staff card scan failed', error: err.message });
  }
};

const resetStaffAttendance = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { date } = req.body;
    if (!date) return res.status(400).json({ message: 'Date is required' });
    await StaffAttendance.deleteMany({ school_id, date });
    res.json({ success: true, message: 'Attendance reset for selected date' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset attendance', error: err.message });
  }
};

module.exports = { markBulkStaff, scanStaffCard, resetStaffAttendance };
