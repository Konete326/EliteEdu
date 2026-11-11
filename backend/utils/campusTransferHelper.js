const CampusTransferLog = require('../models/CampusTransferLog');
const Student = require('../models/Student');
const User = require('../models/User');
const Campus = require('../models/Campus');
const Grade = require('../models/Grade');
const FeeInvoice = require('../models/FeeInvoice');
const TimetableSlot = require('../models/TimetableSlot');

const generateTransferNo = async (schoolId) =>
  `TRF-${new Date().getFullYear()}-${String((await CampusTransferLog.countDocuments({ school_id: schoolId })) + 1).padStart(4, '0')}`;

const executeStudentTransfer = async (payload, { schoolId, userId }) => {
  const { student_id, to_campus_id, to_grade_id, to_section = 'A', transfer_date, reason, transfer_unpaid_dues = true } = payload;
  const student = await Student.findOne({ _id: student_id, school_id: schoolId });
  if (!student) throw new Error('Student record not found');
  const prevCamp = student.campus_id;
  if (prevCamp && String(prevCamp) === String(to_campus_id)) throw new Error('Destination branch cannot be the same');

  const [fromCampus, toCampus, curGrade] = await Promise.all([
    prevCamp ? Campus.findById(prevCamp).select('name').lean() : null,
    Campus.findById(to_campus_id).select('name').lean(),
    student.current_grade ? Grade.findById(student.current_grade).select('name').lean() : null
  ]);
  if (!toCampus) throw new Error('Target destination campus not found');

  let destGradeId = to_grade_id;
  if (!destGradeId && curGrade) {
    const match = await Grade.findOne({ school_id: schoolId, campus_id: to_campus_id, name: { $regex: `^${curGrade.name.trim()}$`, $options: 'i' } }).select('_id').lean();
    if (match) destGradeId = match._id;
  }
  if (!destGradeId) destGradeId = student.current_grade;

  const destSec = to_section || student.current_section || 'A';
  student.campus_id = to_campus_id;
  student.current_grade = destGradeId;
  student.current_section = destSec;
  await student.save();

  if (transfer_unpaid_dues) {
    await FeeInvoice.updateMany({ school_id: schoolId, student_id: student._id, status: { $in: ['Unpaid', 'Partial', 'Overdue'] } }, { $set: { campus_id: to_campus_id } });
  }

  const targetGrade = destGradeId ? await Grade.findById(destGradeId).select('name').lean() : null;
  return CampusTransferLog.create({
    school_id: schoolId,
    transfer_no: await generateTransferNo(schoolId),
    entity_type: 'Student',
    student_id: student._id,
    person_name: student.name,
    identifier_code: student.gr_number || '',
    from_campus_id: prevCamp || null,
    from_campus_name: fromCampus?.name || 'Main Campus',
    to_campus_id,
    to_campus_name: toCampus.name,
    from_class_or_role: `${curGrade?.name || 'Class'} (${student.current_section || 'A'})`,
    to_grade_id: destGradeId,
    to_section: destSec,
    to_class_or_role: `${targetGrade?.name || curGrade?.name || 'Class'} (${destSec})`,
    transfer_date: transfer_date ? new Date(transfer_date) : new Date(),
    reason: String(reason || 'Inter-campus relocation').trim(),
    transfer_unpaid_dues: Boolean(transfer_unpaid_dues),
    approved_by: userId || null
  });
};

const executeStaffTransfer = async (payload, { schoolId, userId }) => {
  const { staff_id, to_campus_id, transfer_date, reason } = payload;
  const staff = await User.findOne({ _id: staff_id, school_id: schoolId });
  if (!staff) throw new Error('Staff record not found');
  const prevCamp = staff.campus_id;
  if (prevCamp && String(prevCamp) === String(to_campus_id)) throw new Error('Destination branch cannot be the same');

  const [fromCampus, toCampus] = await Promise.all([
    prevCamp ? Campus.findById(prevCamp).select('name').lean() : null,
    Campus.findById(to_campus_id).select('name').lean()
  ]);
  if (!toCampus) throw new Error('Target destination campus not found');

  if (prevCamp) {
    await TimetableSlot.deleteMany({ school_id: schoolId, campus_id: prevCamp, teacher_id: staff._id });
    await Grade.updateMany({ school_id: schoolId, campus_id: prevCamp, class_teacher: staff._id }, { $set: { class_teacher: null } });
    await Grade.updateMany({ school_id: schoolId, campus_id: prevCamp, 'section_teachers.teacher_id': staff._id }, { $set: { 'section_teachers.$[elem].teacher_id': null } }, { arrayFilters: [{ 'elem.teacher_id': staff._id }] });
  }

  staff.campus_id = to_campus_id;
  if (!Array.isArray(staff.assigned_campuses)) staff.assigned_campuses = [];
  if (!staff.assigned_campuses.some((c) => String(c) === String(to_campus_id))) staff.assigned_campuses.push(to_campus_id);
  await staff.save();

  return CampusTransferLog.create({
    school_id: schoolId,
    transfer_no: await generateTransferNo(schoolId),
    entity_type: 'Staff',
    staff_id: staff._id,
    person_name: staff.name,
    identifier_code: staff.employee_code || staff.email || '',
    from_campus_id: prevCamp || null,
    from_campus_name: fromCampus?.name || 'Main Branch',
    to_campus_id,
    to_campus_name: toCampus.name,
    from_class_or_role: staff.designation || staff.role,
    to_class_or_role: staff.designation || staff.role,
    transfer_date: transfer_date ? new Date(transfer_date) : new Date(),
    reason: String(reason || 'Branch reassignment').trim(),
    transfer_unpaid_dues: false,
    approved_by: userId || null
  });
};

module.exports = { generateTransferNo, executeStudentTransfer, executeStaffTransfer };
