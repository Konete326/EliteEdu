const Student = require('../models/Student');
const User = require('../models/User');
const StudentAttendance = require('../models/StudentAttendance');
const StaffAttendance = require('../models/StaffAttendance');
const { resolveUniversalCode } = require('../utils/scannerLookupHelper');
const { verifyClassAccess } = require('../utils/attendanceAccessHelper');
const { formatStandardTime } = require('../utils/timeFormatter');

const universalLookup = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !String(code).trim()) {
      return res.status(400).json({ success: false, message: 'Please provide or scan a code' });
    }
    const result = await resolveUniversalCode(code, req.user);
    if (!result) {
      return res.status(404).json({ success: false, message: `No student or staff found for "${code}"` });
    }
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const quickMarkAttendance = async (req, res) => {
  try {
    const { type, id, status = 'P' } = req.body;
    const date = req.body.date || new Date().toISOString().slice(0, 10);
    const school_id = req.user.school_id;

    if (type === 'student') {
      const student = await Student.findOne({ _id: id, school_id });
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

      const isAdmin = ['Admin', 'SuperAdmin'].includes(req.user.role);
      if (!isAdmin) {
        const hasAccess = await verifyClassAccess(req.user, student.current_grade);
        if (!hasAccess) return res.status(403).json({ success: false, message: 'Permission denied to mark attendance for this grade' });
      }

      await StudentAttendance.findOneAndUpdate(
        { school_id, student_id: student._id, date },
        {
          school_id,
          campus_id: student.campus_id || null,
          grade_id: student.current_grade,
          section: student.current_section || 'A',
          student_id: student._id,
          date,
          status,
          marked_via: 'Card_Scan',
          scan_time: new Date(),
          marked_by: req.user.id || req.user._id
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return res.status(200).json({
        success: true,
        message: `${student.name} marked ${status === 'P' ? 'Present' : status === 'L' ? 'Late' : 'Absent'}`,
        status
      });
    }

    if (type === 'staff') {
      const isAdmin = ['Admin', 'SuperAdmin'].includes(req.user.role);
      if (!isAdmin) return res.status(403).json({ success: false, message: 'Admin permissions required to mark staff attendance' });

      const staff = await User.findOne({ _id: id, school_id });
      if (!staff) return res.status(404).json({ success: false, message: 'Staff member not found' });

      const now = formatStandardTime();
      await StaffAttendance.findOneAndUpdate(
        { school_id, staff_id: staff._id, date },
        {
          $set: {
            campus_id: staff.campus_id || null,
            status,
            check_in_time: now,
            marked_via: 'Card_Scan',
            marked_by: req.user.id || req.user._id,
            scan_time: new Date()
          }
        },
        { upsert: true, new: true }
      );

      return res.status(200).json({
        success: true,
        message: `${staff.name} marked ${status === 'P' ? 'Present' : status === 'L' ? 'Late' : 'Absent'}`,
        status
      });
    }

    res.status(400).json({ success: false, message: 'Invalid entity type' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { universalLookup, quickMarkAttendance };
