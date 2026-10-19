const Student = require('../models/Student');
const { calculateAge, resolveTeacherGrades, getInstitutionHeader } = require('../utils/reportHelpers');
const { buildFlexibleStudentFilter, getStudentCounters } = require('../utils/reportStudentQueryHelper');
const { buildStrengthSummary, buildSiblingsReport, buildBirthdayList } = require('../utils/reportStudentSubBuildersA');
const { buildIdCardsStatus, buildFeeStatusSummary, buildFeeStudentWise, buildProfileSheet } = require('../utils/reportStudentSubBuildersB');

const mapMasterRows = (students) => students.map((s, idx) => ({
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

const getStudentMaster = async (req, res) => {
  try {
    const sub = req.query.sub_report || 'master_list';
    const filter = await buildFlexibleStudentFilter(req);

    if (sub === 'registration_list') {
      filter.status = { $regex: '^registered$', $options: 'i' };
    } else if (sub === 'dropout_left') {
      filter.status = { $in: [/^left$/i, /^inactive$/i, /^suspended$/i, 'Left', 'Inactive', 'Suspended'] };
    } else if (sub === 'free_students') {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [{ discount: { $gte: 100 } }, { monthly_fee: 0 }, { discount_reference: { $exists: true, $ne: '' } }]
      });
    }

    let sortOption = { gr_number: 1, name: 1 };
    if (sub === 'new_admissions') sortOption = { admission_date: -1, createdAt: -1 };
    else if (sub === 'registration_list') sortOption = { registration_date: -1, createdAt: -1 };

    const students = await Student.find(filter)
      .populate('current_grade', 'name')
      .populate('campus_id', 'name contact_number')
      .sort(sortOption)
      .lean();

    let result = null;
    if (sub === 'strength_summary') result = buildStrengthSummary(students);
    else if (sub === 'siblings_report') result = buildSiblingsReport(students);
    else if (sub === 'birthday_list') result = buildBirthdayList(students);
    else if (sub === 'id_cards_status') result = buildIdCardsStatus(students);
    else if (sub === 'fee_status_summary') result = buildFeeStatusSummary(students);
    else if (sub === 'fee_status_student_wise') result = buildFeeStudentWise(students);
    else if (sub === 'profile_sheet') result = buildProfileSheet(students);
    else {
      result = { rows: mapMasterRows(students) };
    }

    const teacherGradeIds = await resolveTeacherGrades(req.user);
    const counters = await getStudentCounters(req.user.school_id, req.query.campus_id, teacherGradeIds);
    const header = await getInstitutionHeader(req.user.school_id, req.query.campus_id);

    return res.status(200).json({
      success: true,
      sub_report: sub,
      columns: result.columns,
      data: result.rows,
      total: result.rows.length,
      counters,
      header
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStudentMaster };
