const Student = require('../models/Student');
const Grade = require('../models/Grade');
const { resolveTeacherGrades, getInstitutionHeader } = require('../utils/reportHelpers');

const getParentContactInfo = async (req, res) => {
  try {
    const { campus_id, grade_id, section, search } = req.query;
    const filter = { school_id: req.user.school_id };
    if (campus_id && campus_id !== 'all') filter.campus_id = campus_id;
    const teacherGradeIds = await resolveTeacherGrades(req.user);
    if (teacherGradeIds) filter.current_grade = { $in: teacherGradeIds };
    if (grade_id && grade_id !== 'all') filter.current_grade = grade_id;
    if (section && section !== 'all') filter.current_section = section;
    if (search) {
      const s = search.trim();
      filter.$or = [
        { name: new RegExp(s, 'i') },
        { father_name: new RegExp(s, 'i') },
        { gr_number: new RegExp(s, 'i') },
        { 'father_details.mobile_no': new RegExp(s, 'i') },
        { 'mother_details.mobile_no': new RegExp(s, 'i') }
      ];
    }

    const students = await Student.find(filter).populate('current_grade', 'name').sort({ gr_number: 1 }).lean();
    const gradeScope = { school_id: req.user.school_id };
    if (campus_id && campus_id !== 'all') gradeScope.campus_id = campus_id;
    const totalClasses = await Grade.countDocuments(gradeScope);

    const baseCountFilter = { school_id: req.user.school_id };
    if (campus_id && campus_id !== 'all') baseCountFilter.campus_id = campus_id;
    if (teacherGradeIds) baseCountFilter.current_grade = { $in: teacherGradeIds };

    const [totalStudents, fatherMobileCount, motherMobileCount] = await Promise.all([
      Student.countDocuments(baseCountFilter),
      Student.countDocuments({
        ...baseCountFilter,
        $or: [{ 'father_details.mobile_no': { $exists: true, $ne: '' } }, { contact_number: { $exists: true, $ne: '' } }]
      }),
      Student.countDocuments({
        ...baseCountFilter,
        'mother_details.mobile_no': { $exists: true, $ne: '' }
      })
    ]);

    const header = await getInstitutionHeader(req.user.school_id, campus_id);

    const rows = students.map((s, idx) => ({
      sr: idx + 1,
      id: s.gr_number || String(idx + 1),
      _id: s._id,
      name: s.name || '',
      class_name: s.current_grade?.name || 'Unassigned',
      section: s.current_section || 'A',
      father_name: s.father_name || s.father_details?.name || '—',
      father_cnic: s.parents_cnic?.father_cnic || s.father_details?.national_id || '—',
      father_education: s.father_details?.education || '—',
      father_mobile: s.father_details?.mobile_no || s.contact_number || '—',
      father_occupation: s.father_details?.occupation || '—',
      father_profession: s.father_details?.profession || '—',
      father_income: s.father_details?.income ? `Rs. ${Number(s.father_details.income).toLocaleString()}` : '—',
      mother_name: s.mother_guardian_name || s.mother_details?.name || '—',
      mother_cnic: s.parents_cnic?.mother_cnic || s.mother_details?.national_id || '—',
      mother_education: s.mother_details?.education || '—',
      mother_mobile: s.mother_details?.mobile_no || '—',
      mother_occupation: s.mother_details?.occupation || '—',
      mother_profession: s.mother_details?.profession || '—',
      mother_income: s.mother_details?.income ? `Rs. ${Number(s.mother_details.income).toLocaleString()}` : '—'
    }));

    return res.status(200).json({
      success: true,
      data: rows,
      kpis: { totalStudents, fatherMobileCount, motherMobileCount, totalClasses },
      header
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getParentContactInfo };
