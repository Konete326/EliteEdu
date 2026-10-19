const mongoose = require('mongoose');
const Student = require('../models/Student');
const Grade = require('../models/Grade');
const { resolveTeacherGrades, getInstitutionHeader } = require('../utils/reportHelpers');
const { buildFlexibleStudentFilter } = require('../utils/reportStudentQueryHelper');

const getParentContactInfo = async (req, res) => {
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

    const [totalStudents, fatherMobileCount, motherMobileCount] = await Promise.all([
      Student.countDocuments(baseCount),
      Student.countDocuments({
        ...baseCount,
        $or: [{ 'father_details.mobile_no': { $exists: true, $ne: '' } }, { contact_number: { $exists: true, $ne: '' } }]
      }),
      Student.countDocuments({
        ...baseCount,
        'mother_details.mobile_no': { $exists: true, $ne: '' }
      })
    ]);

    const header = await getInstitutionHeader(req.user.school_id, campus_id);

    const rows = students.map((s, idx) => ({
      sr: idx + 1,
      id: s.gr_number || String(idx + 1),
      _id: s._id,
      name: s.name || '',
      student_name: s.name || '',
      gr_number: s.gr_number || '',
      class_name: s.current_grade?.name || 'Unassigned',
      section: s.current_section || 'A',
      father_name: s.father_name || s.father_details?.name || '—',
      father_cnic: s.parents_cnic?.father_cnic || s.father_details?.national_id || '—',
      father_education: s.father_details?.education || '—',
      father_mobile: s.father_details?.mobile_no || s.contact_number || '—',
      contact_number: s.contact_number || s.father_details?.mobile_no || '—',
      whatsapp_number: s.whatsapp_number || s.father_details?.mobile_no || s.contact_number || '—',
      father_occupation: s.father_details?.occupation || '—',
      father_profession: s.father_details?.profession || '—',
      mother_name: s.mother_details?.name || '—',
      mother_cnic: s.parents_cnic?.mother_cnic || s.mother_details?.national_id || '—',
      mother_mobile: s.mother_details?.mobile_no || '—',
      emergency_contact_no: s.emergency_contact_no || s.contact_number || '—',
      current_address: s.address?.street_address || s.address?.city || '—',
      blood_group: s.blood_group || '—'
    }));

    return res.status(200).json({
      success: true,
      data: rows,
      rows,
      kpis: { totalStudents, fatherMobileCount, motherMobileCount, totalClasses },
      header
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getParentContactInfo };
