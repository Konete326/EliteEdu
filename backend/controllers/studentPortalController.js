const Student = require('../models/Student');
const StudentAttendance = require('../models/StudentAttendance');
const FeeInvoice = require('../models/FeeInvoice');
const LmsItem = require('../models/LmsItem');
const TimetableSlot = require('../models/TimetableSlot');
const MarkSheet = require('../models/MarkSheet');
const ClassTest = require('../models/ClassTest');

const getStudentPortalOverview = async (req, res) => {
  try {
    const isStudent = req.user?.role === 'Student';
    const targetId = isStudent ? (req.user.student_id || req.user.id) : req.query.student_id;
    let student = null;

    if (targetId) {
      student = await Student.findOne({ _id: targetId, school_id: req.schoolId })
        .populate('current_grade', 'name code')
        .populate('campus_id', 'name')
        .lean();
    } else {
      student = await Student.findOne({
        school_id: req.schoolId,
        $or: [{ portal_username: req.user?.name }, { email: req.user?.email }]
      }).populate('current_grade', 'name code').populate('campus_id', 'name').lean();

      if (!student) {
        student = await Student.findOne({ school_id: req.schoolId, status: 'Active' })
          .populate('current_grade', 'name code')
          .populate('campus_id', 'name')
          .lean();
      }
    }

    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const sId = student._id;
    const gId = student.current_grade?._id;
    const sec = student.current_section || 'A';

    const [attendanceDocs, invoices, lmsItems, timetable, markSheets, classTests] = await Promise.all([
      StudentAttendance.find({ school_id: req.schoolId, 'records.student_id': sId }).select('date records').lean(),
      FeeInvoice.find({ school_id: req.schoolId, student_id: sId }).sort({ due_date: -1 }).lean(),
      LmsItem.find({ school_id: req.schoolId, grade_id: gId, section: sec, status: { $ne: 'Archived' } })
        .populate('subject_id', 'name code')
        .populate('teacher_id', 'name')
        .sort({ due_date: -1, createdAt: -1 })
        .lean(),
      TimetableSlot.find({ school_id: req.schoolId, grade_id: gId, section: sec })
        .populate('subject_id', 'name code')
        .populate('teacher_id', 'name')
        .sort({ day_of_week: 1, period_no: 1 })
        .lean(),
      MarkSheet.find({ school_id: req.schoolId, 'records.student_id': sId })
        .populate('exam_id', 'name term academic_year')
        .populate('subject_id', 'name')
        .lean(),
      ClassTest.find({ school_id: req.schoolId, grade_id: gId, section: sec, 'scores.student_id': sId })
        .populate('subject_id', 'name')
        .sort({ test_date: -1 })
        .lean()
    ]);

    let present = 0, absent = 0, leave = 0, late = 0;
    attendanceDocs.forEach((doc) => {
      const rec = (doc.records || []).find((r) => String(r.student_id) === String(sId));
      if (rec) {
        if (rec.status === 'Present') present++;
        else if (rec.status === 'Absent') absent++;
        else if (rec.status === 'Leave') leave++;
        else if (rec.status === 'Late') late++;
      }
    });
    const totalAtt = present + absent + leave + late;
    const attendancePct = totalAtt ? Math.round((present / totalAtt) * 100) : 100;

    res.status(200).json({
      success: true,
      student,
      attendance: { present, absent, leave, late, totalDays: totalAtt, attendancePct },
      invoices,
      lmsItems,
      timetable,
      markSheets,
      classTests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitStudentHomework = async (req, res) => {
  try {
    const { lmsId } = req.params;
    const { student_id, remarks = '', submission_text = '', answers = [] } = req.body;
    const targetStudentId = student_id || req.user?.id;

    const item = await LmsItem.findOne({ _id: lmsId, school_id: req.schoolId });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const existingIdx = item.submissions.findIndex((s) => String(s.student_id) === String(targetStudentId));
    const subRecord = {
      student_id: targetStudentId,
      status: 'Submitted',
      remarks: remarks || submission_text,
      updated_at: new Date()
    };

    if (existingIdx >= 0) item.submissions[existingIdx] = { ...item.submissions[existingIdx], ...subRecord };
    else item.submissions.push(subRecord);

    await item.save();
    res.status(200).json({ success: true, message: 'Submission uploaded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStudentPortalOverview, submitStudentHomework };
