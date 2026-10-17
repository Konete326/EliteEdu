const mongoose = require('mongoose');
const Student = require('../models/Student');
const StudentAttendance = require('../models/StudentAttendance');
const { verifyClassAccess } = require('../utils/attendanceAccessHelper');
const { createSystemNotification } = require('../utils/notificationDispatcher');

const markBulkAttendance = async (req, res) => {
  try {
    const { grade_id, section = 'A', date = new Date().toISOString().slice(0, 10), records = [] } = req.body;
    if (!grade_id) return res.status(400).json({ success: false, message: 'grade_id is required' });

    const hasAccess = await verifyClassAccess(req.user, grade_id);
    if (!hasAccess) return res.status(403).json({ success: false, message: 'Access denied to this class' });

    if (records.length === 0) return res.status(200).json({ success: true, count: 0 });

    const ops = records.map((r) => ({
      updateOne: {
        filter: { school_id: req.user.school_id, student_id: r.student_id, date },
        update: {
          $set: {
            school_id: req.user.school_id,
            grade_id,
            section,
            student_id: r.student_id,
            date,
            status: r.status || 'P',
            remarks: r.remarks || '',
            marked_via: r.marked_via || 'Manual',
            marked_by: req.user.id
          }
        },
        upsert: true
      }
    }));

    await StudentAttendance.bulkWrite(ops);
    createSystemNotification({
      school_id: req.user.school_id,
      title: 'Attendance Sheet Submitted',
      message: `Attendance for ${records.length} students recorded for date ${date}.`,
      type: 'Attendance',
      target_audience: 'Admins',
      action_url: '/admin/attendance/students',
      created_by: req.user.id
    });
    res.status(200).json({ success: true, count: records.length, message: 'Attendance sheet saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const scanCard = async (req, res) => {
  try {
    const { code, date = new Date().toISOString().slice(0, 10), status = 'P' } = req.body;
    if (!code || !String(code).trim()) {
      return res.status(400).json({ success: false, message: 'Scan code is required' });
    }

    let clean = String(code).trim();
    if (clean.includes('/verify/student/')) {
      const parts = clean.split('/verify/student/');
      clean = parts[parts.length - 1].split('?')[0].trim();
    }

    const isValidId = mongoose.Types.ObjectId.isValid(clean);
    const orClauses = [{ gr_number: clean }, { serial_no: clean }];
    if (isValidId) orClauses.push({ _id: clean });

    const student = await Student.findOne({
      school_id: req.user.school_id,
      $or: orClauses
    }).populate('current_grade', 'name sections').lean();

    if (!student) return res.status(404).json({ success: false, message: `Student code "${clean}" not found` });

    const gradeId = student.current_grade?._id || student.current_grade;
    const hasAccess = await verifyClassAccess(req.user, gradeId);
    if (!hasAccess) {
      return res.status(403).json({ success: false, message: `Access denied to student's class (${student.current_grade?.name || 'Class'})` });
    }

    const record = await StudentAttendance.findOneAndUpdate(
      { school_id: req.user.school_id, student_id: student._id, date },
      {
        school_id: req.user.school_id,
        campus_id: student.campus_id || null,
        grade_id: gradeId,
        section: student.current_section || 'A',
        student_id: student._id,
        date,
        status,
        marked_via: 'Card_Scan',
        scan_time: new Date(),
        marked_by: req.user.id
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      student,
      record,
      message: `✓ Marked ${status === 'P' ? 'Present' : status}: ${student.name} (GR: ${student.gr_number})`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { markBulkAttendance, scanCard };
