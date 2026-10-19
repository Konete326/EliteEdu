const mongoose = require('mongoose');
const Student = require('../models/Student');
const Grade = require('../models/Grade');
const { calculateAge, resolveTeacherGrades, getInstitutionHeader } = require('../utils/reportHelpers');
const { buildFlexibleStudentFilter } = require('../utils/reportStudentQueryHelper');

const getStudentAdmissionInfo = async (req, res) => {
  try {
    const { campus_id } = req.query;
    const filter = await buildFlexibleStudentFilter(req);

    const students = await Student.find(filter)
      .populate('current_grade', 'name')
      .sort({ gr_number: 1 })
      .lean();

    const gradeScope = { school_id: req.user.school_id };
    if (campus_id && campus_id !== 'all') {
      gradeScope.$or = [
        { campus_id: new mongoose.Types.ObjectId(campus_id) },
        { campus_id: null },
        { campus_id: { $exists: false } }
      ];
    }
    const totalClasses = await Grade.countDocuments(gradeScope);

    const teacherGradeIds = await resolveTeacherGrades(req.user);
    const baseCount = { school_id: req.user.school_id };
    if (campus_id && campus_id !== 'all') {
      baseCount.$or = [
        { campus_id: new mongoose.Types.ObjectId(campus_id) },
        { campus_id: null },
        { campus_id: { $exists: false } }
      ];
    }
    if (teacherGradeIds) baseCount.current_grade = { $in: teacherGradeIds };

    const [totalStudents, activeStudents, inactiveStudents] = await Promise.all([
      Student.countDocuments(baseCount),
      Student.countDocuments({ ...baseCount, status: { $regex: '^active$', $options: 'i' } }),
      Student.countDocuments({
        ...baseCount,
        status: { $in: [/^inactive$/i, /^suspended$/i, /^left$/i, 'Inactive', 'Suspended', 'Left'] }
      })
    ]);

    const header = await getInstitutionHeader(req.user.school_id, campus_id);

    const rows = students.map((s, idx) => ({
      sr: idx + 1,
      id: s._id,
      gr_number: s.gr_number || '',
      student_name: s.name || '',
      father_name: s.father_name || '',
      class_name: s.current_grade?.name || 'Unassigned',
      section: s.current_section || 'A',
      discount_in_fee: s.discount || 0,
      admission_date: s.admission_date ? new Date(s.admission_date).toISOString().split('T')[0] : '',
      dob: s.dob ? new Date(s.dob).toISOString().split('T')[0] : '',
      age: calculateAge(s.dob),
      gender: s.gender || 'Male',
      b_form: s.b_form || s.parents_cnic?.father_cnic || '—',
      religion: s.religion || 'Islam',
      cast: s.caste || '—',
      status: s.status || 'Active'
    }));

    return res.status(200).json({
      success: true,
      data: rows,
      rows,
      kpis: { totalStudents, activeStudents, inactiveStudents, totalClasses },
      header
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStudentAdmissionInfo };
