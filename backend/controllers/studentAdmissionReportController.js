const Student = require('../models/Student');
const Grade = require('../models/Grade');
const { calculateAge, resolveTeacherGrades, getInstitutionHeader } = require('../utils/reportHelpers');

const getStudentAdmissionInfo = async (req, res) => {
  try {
    const { campus_id, grade_id, section, search, status } = req.query;
    const filter = { school_id: req.user.school_id };
    if (campus_id && campus_id !== 'all') filter.campus_id = campus_id;
    const teacherGradeIds = await resolveTeacherGrades(req.user);
    if (teacherGradeIds) filter.current_grade = { $in: teacherGradeIds };
    if (grade_id && grade_id !== 'all') filter.current_grade = grade_id;
    if (section && section !== 'all') filter.current_section = section;
    if (status && status !== 'all') filter.status = status;
    if (search) {
      const s = search.trim();
      filter.$or = [{ name: new RegExp(s, 'i') }, { father_name: new RegExp(s, 'i') }, { gr_number: new RegExp(s, 'i') }];
    }

    const students = await Student.find(filter).populate('current_grade', 'name').sort({ gr_number: 1 }).lean();
    const gradeScope = { school_id: req.user.school_id };
    if (campus_id && campus_id !== 'all') gradeScope.campus_id = campus_id;
    const totalClasses = await Grade.countDocuments(gradeScope);

    const baseCountFilter = { school_id: req.user.school_id };
    if (campus_id && campus_id !== 'all') baseCountFilter.campus_id = campus_id;
    if (teacherGradeIds) baseCountFilter.current_grade = { $in: teacherGradeIds };

    const [totalStudents, activeStudents, inactiveStudents] = await Promise.all([
      Student.countDocuments(baseCountFilter),
      Student.countDocuments({ ...baseCountFilter, status: 'Active' }),
      Student.countDocuments({ ...baseCountFilter, status: { $in: ['Inactive', 'Suspended', 'Left'] } })
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
      kpis: { totalStudents, activeStudents, inactiveStudents, totalClasses },
      header
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStudentAdmissionInfo };
