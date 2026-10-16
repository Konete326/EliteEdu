const Student = require('../models/Student');
const StudentAttendance = require('../models/StudentAttendance');
const { getTeacherAllowedGradeIds, verifyClassAccess } = require('../utils/attendanceAccessHelper');

const getAllowedClasses = async (req, res) => {
  try {
    const classes = await getTeacherAllowedGradeIds(req.user);
    res.status(200).json({ success: true, classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAttendanceSheet = async (req, res) => {
  try {
    const { grade_id, section = 'A', date = new Date().toISOString().slice(0, 10), campus_id } = req.query;
    if (!grade_id) return res.status(400).json({ success: false, message: 'grade_id is required' });

    const hasAccess = await verifyClassAccess(req.user, grade_id);
    if (!hasAccess) return res.status(403).json({ success: false, message: 'Access denied to this class' });

    const studentFilter = { school_id: req.user.school_id, current_grade: grade_id, status: 'Active' };
    if (section) studentFilter.current_section = section;
    if (campus_id) studentFilter.campus_id = campus_id;

    const [students, attendanceRecords] = await Promise.all([
      Student.find(studentFilter)
        .select('name father_name gr_number serial_no photo_url current_grade current_section campus_id')
        .sort({ name: 1 })
        .lean(),
      StudentAttendance.find({
        school_id: req.user.school_id,
        grade_id,
        section,
        date
      }).lean()
    ]);

    const recordMap = new Map(attendanceRecords.map((r) => [String(r.student_id), r]));

    let present = 0;
    let absent = 0;
    let leave = 0;
    let late = 0;
    let halfDay = 0;
    let holiday = 0;
    let markedCount = 0;

    const enriched = students.map((s) => {
      const record = recordMap.get(String(s._id));
      const isMarked = Boolean(record);
      const status = record ? record.status : 'P';

      if (isMarked) {
        markedCount++;
        if (status === 'P') present++;
        else if (status === 'A') absent++;
        else if (status === 'L') leave++;
        else if (status === 'LT') late++;
        else if (status === 'HD') halfDay++;
        else if (status === 'Hol') holiday++;
      }

      return {
        ...s,
        status,
        is_marked: isMarked,
        marked_via: record?.marked_via || null,
        scan_time: record?.scan_time || null,
        remarks: record?.remarks || ''
      };
    });

    const total = students.length;
    const unmarked = total - markedCount;

    res.status(200).json({
      success: true,
      date,
      grade_id,
      section,
      students: enriched,
      stats: { total, present, absent, leave, late, halfDay, holiday, unmarked, markedCount }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllowedClasses, getAttendanceSheet };
