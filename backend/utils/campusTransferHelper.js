const CampusTransferLog = require('../models/CampusTransferLog');
const Student = require('../models/Student');
const User = require('../models/User');
const Campus = require('../models/Campus');
const Grade = require('../models/Grade');
const FeeInvoice = require('../models/FeeInvoice');

const generateTransferNo = async (schoolId) => {
  const d = new Date();
  const year = d.getFullYear();
  const count = await CampusTransferLog.countDocuments({ school_id: schoolId });
  return `TRF-${year}-${String(count + 1).padStart(4, '0')}`;
};

const executeStudentTransfer = async (payload, { schoolId, userId }) => {
  const { student_id, to_campus_id, to_grade_id, to_section = 'A', transfer_date, reason, transfer_unpaid_dues = true } = payload;
  const student = await Student.findOne({ _id: student_id, school_id: schoolId });
  if (!student) throw new Error('Student record not found');

  const [fromCampus, toCampus, targetGrade, currentGrade] = await Promise.all([
    student.campus_id ? Campus.findById(student.campus_id).select('name').lean() : null,
    Campus.findById(to_campus_id).select('name').lean(),
    to_grade_id ? Grade.findById(to_grade_id).select('name').lean() : null,
    student.current_grade ? Grade.findById(student.current_grade).select('name').lean() : null
  ]);

  if (!toCampus) throw new Error('Target destination campus not found');

  const transferNo = await generateTransferNo(schoolId);
  const destGradeId = to_grade_id || student.current_grade;
  const destSection = to_section || student.current_section || 'A';

  student.campus_id = to_campus_id;
  student.current_grade = destGradeId;
  student.current_section = destSection;
  await student.save();

  if (transfer_unpaid_dues) {
    await FeeInvoice.updateMany(
      { school_id: schoolId, student_id: student._id, status: { $in: ['Unpaid', 'Partial', 'Overdue'] } },
      { $set: { campus_id: to_campus_id } }
    );
  }

  const log = await CampusTransferLog.create({
    school_id: schoolId,
    transfer_no: transferNo,
    entity_type: 'Student',
    student_id: student._id,
    person_name: student.name,
    identifier_code: student.gr_number || '',
    from_campus_id: student.campus_id || null,
    from_campus_name: fromCampus?.name || 'Main Campus',
    to_campus_id,
    to_campus_name: toCampus.name,
    from_class_or_role: `${currentGrade?.name || 'Class'} (${student.current_section || 'A'})`,
    to_grade_id: destGradeId,
    to_section: destSection,
    to_class_or_role: `${targetGrade?.name || currentGrade?.name || 'Class'} (${destSection})`,
    transfer_date: transfer_date ? new Date(transfer_date) : new Date(),
    reason: String(reason).trim(),
    transfer_unpaid_dues: Boolean(transfer_unpaid_dues),
    approved_by: userId || null
  });

  return log;
};

const executeStaffTransfer = async (payload, { schoolId, userId }) => {
  const { staff_id, to_campus_id, transfer_date, reason } = payload;
  const staff = await User.findOne({ _id: staff_id, school_id: schoolId });
  if (!staff) throw new Error('Staff record not found');

  const [fromCampus, toCampus] = await Promise.all([
    staff.campus_id ? Campus.findById(staff.campus_id).select('name').lean() : null,
    Campus.findById(to_campus_id).select('name').lean()
  ]);

  if (!toCampus) throw new Error('Target destination campus not found');

  const transferNo = await generateTransferNo(schoolId);
  staff.campus_id = to_campus_id;
  if (!Array.isArray(staff.assigned_campuses)) staff.assigned_campuses = [];
  if (!staff.assigned_campuses.some((c) => String(c) === String(to_campus_id))) {
    staff.assigned_campuses.push(to_campus_id);
  }
  await staff.save();

  const log = await CampusTransferLog.create({
    school_id: schoolId,
    transfer_no: transferNo,
    entity_type: 'Staff',
    staff_id: staff._id,
    person_name: staff.name,
    identifier_code: staff.employee_code || staff.email || '',
    from_campus_id: staff.campus_id || null,
    from_campus_name: fromCampus?.name || 'Main Branch',
    to_campus_id,
    to_campus_name: toCampus.name,
    from_class_or_role: staff.designation || staff.role,
    to_class_or_role: staff.designation || staff.role,
    transfer_date: transfer_date ? new Date(transfer_date) : new Date(),
    reason: String(reason).trim(),
    transfer_unpaid_dues: false,
    approved_by: userId || null
  });

  return log;
};

module.exports = { generateTransferNo, executeStudentTransfer, executeStaffTransfer };
