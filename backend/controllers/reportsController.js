const Student = require('../models/Student');
const { calculateAge, resolveTeacherGrades, getInstitutionHeader } = require('../utils/reportHelpers');

const buildMasterFilter = async (req) => {
  const { academic_session, grade_id, section, gender, status, search, religion, transport_route, discount_reference, sub_report, campus_id } = req.query;
  const filter = { school_id: req.user.school_id };
  if (campus_id && campus_id !== 'all') filter.campus_id = campus_id;
  const teacherGradeIds = await resolveTeacherGrades(req.user);
  if (teacherGradeIds) filter.current_grade = { $in: teacherGradeIds };
  if (grade_id && grade_id !== 'all') filter.current_grade = grade_id;
  if (section && section !== 'all') filter.current_section = section;
  if (academic_session) filter.academic_session = academic_session;
  if (gender && gender !== 'all') filter.gender = gender;
  if (status && status !== 'all') filter.status = status;
  if (religion && religion !== 'all') filter.religion = religion;
  if (transport_route) filter.transport_route = new RegExp(transport_route.trim(), 'i');
  if (discount_reference) filter.discount_reference = new RegExp(discount_reference.trim(), 'i');
  if (search) {
    const s = search.trim();
    filter.$or = [
      { name: new RegExp(s, 'i') },
      { father_name: new RegExp(s, 'i') },
      { gr_number: new RegExp(s, 'i') },
      { contact_number: new RegExp(s, 'i') }
    ];
  }
  if (sub_report === 'registration_list') filter.status = 'Registered';
  else if (sub_report === 'dropout_left') filter.status = 'Left';
  else if (sub_report === 'free_students') filter.$or = [{ discount: { $gte: 100 } }, { monthly_fee: 0 }];
  else if (sub_report === 'siblings_report') filter.total_siblings = { $gt: 0 };
  return filter;
};

const getStudentMaster = async (req, res) => {
  try {
    const filter = await buildMasterFilter(req);
    const students = await Student.find(filter)
      .populate('current_grade', 'name')
      .populate('campus_id', 'name contact_number')
      .sort({ gr_number: 1, name: 1 })
      .lean();

    const baseScope = { school_id: req.user.school_id };
    if (req.query.campus_id && req.query.campus_id !== 'all') baseScope.campus_id = req.query.campus_id;
    const teacherGradeIds = await resolveTeacherGrades(req.user);
    if (teacherGradeIds) baseScope.current_grade = { $in: teacherGradeIds };

    const [activeCount, registeredCount, inactiveCount, suspendedCount, leftCount] = await Promise.all([
      Student.countDocuments({ ...baseScope, status: 'Active' }),
      Student.countDocuments({ ...baseScope, status: 'Registered' }),
      Student.countDocuments({ ...baseScope, status: 'Inactive' }),
      Student.countDocuments({ ...baseScope, status: 'Suspended' }),
      Student.countDocuments({ ...baseScope, status: 'Left' })
    ]);

    const header = await getInstitutionHeader(req.user.school_id, req.query.campus_id);

    const rows = students.map((s, idx) => ({
      sr: idx + 1,
      id: s._id,
      gr_number: s.gr_number || '',
      name: s.name || '',
      father_name: s.father_name || '',
      class_name: s.current_grade?.name || 'Unassigned',
      section: s.current_section || 'A',
      gender: s.gender || 'Male',
      age: calculateAge(s.dob),
      dob: s.dob ? new Date(s.dob).toISOString().split('T')[0] : '',
      phone: s.contact_number || '',
      father_contact: s.father_details?.mobile_no || s.parents_cnic?.father_cnic || s.contact_number || '',
      status: s.status || 'Active',
      admission_date: s.admission_date ? new Date(s.admission_date).toISOString().split('T')[0] : '',
      date_of_leaving: s.date_of_leaving ? new Date(s.date_of_leaving).toISOString().split('T')[0] : '',
      leaving_reason: s.leaving_reason || '',
      academic_session: s.academic_session || '2026-2027',
      email: s.email || '',
      registration_date: s.registration_date ? new Date(s.registration_date).toISOString().split('T')[0] : ''
    }));

    return res.status(200).json({
      success: true,
      data: rows,
      total: rows.length,
      counters: { activeCount, registeredCount, inactiveCount, suspendedCount, leftCount },
      header
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStudentMaster };
