const mongoose = require('mongoose');
const Student = require('../models/Student');
const { getTeacherAllowedGradeIds } = require('../utils/attendanceAccessHelper');
const { generateNextGrNumber } = require('../utils/grNumberGenerator');
const { generateNextFamilyNumber } = require('../utils/familyNumberGenerator');
const { sanitizeStudentPayload } = require('../utils/sanitizeData');

const checkGradeAccess = async (user, gradeId) => {
  if (user.role === 'Admin' || user.role === 'SuperAdmin') return true;
  const allowed = await getTeacherAllowedGradeIds(user);
  const target = String(gradeId || '').toLowerCase().trim();
  return allowed.some((g) => String(g._id) === String(gradeId) || String(g.name).toLowerCase().trim() === target);
};

const getTeacherStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.studentId, school_id: req.user.school_id })
      .populate('current_grade', 'name sections')
      .populate('campus_id', 'name code address contact_number')
      .lean();
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const hasAccess = await checkGradeAccess(req.user, student.current_grade?._id || student.current_grade);
    if (!hasAccess) return res.status(403).json({ success: false, message: 'Access to this student record is restricted' });

    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch student profile', error: error.message });
  }
};

const createTeacherStudent = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const { name, father_name, current_grade, current_section, campus_id, ...rest } = req.body;
    if (!name?.trim() || !father_name?.trim()) {
      return res.status(400).json({ success: false, message: 'Student Name and Father Name are required' });
    }

    const allowed = await getTeacherAllowedGradeIds(req.user);
    let targetGradeId = current_grade;
    if (!targetGradeId && allowed.length > 0) targetGradeId = allowed[0]._id;
    if (req.user.role === 'Teacher') {
      const isAllowed = allowed.some((g) => String(g._id) === String(targetGradeId) || String(g.name).toLowerCase().trim() === String(targetGradeId).toLowerCase().trim());
      if (!isAllowed) return res.status(403).json({ success: false, message: 'Cannot add student outside your assigned classes' });
    }

    let finalCampusId = campus_id || req.user.campus_id;
    if (!finalCampusId) {
      const defCampus = await mongoose.model('Campus').findOne({ school_id: schoolId }).lean();
      if (defCampus) finalCampusId = defCampus._id;
    }

    const finalGr = req.body.gr_number?.trim() || (await generateNextGrNumber(schoolId));
    const finalFamily = req.body.family_number?.trim() || (await generateNextFamilyNumber(schoolId));
    const rawStudent = {
      ...rest,
      school_id: schoolId,
      campus_id: finalCampusId,
      name: name.trim(),
      father_name: father_name.trim(),
      current_grade: targetGradeId,
      current_section: current_section?.trim() || 'A',
      gr_number: finalGr,
      family_number: finalFamily,
      portal_username: req.body.portal_username || `${finalGr}${name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6)}`,
      portal_temp_password: req.body.portal_password || req.body.portal_temp_password || `Edu@${finalGr}`
    };

    const student = await Student.create(sanitizeStudentPayload(rawStudent));
    const populated = await Student.findById(student._id).populate('current_grade', 'name sections').populate('campus_id', 'name');
    res.status(201).json({ success: true, message: 'Student enrolled successfully', student: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create student', error: error.message });
  }
};

const updateTeacherStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.studentId, school_id: req.user.school_id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const hasAccess = await checkGradeAccess(req.user, student.current_grade);
    if (!hasAccess) return res.status(403).json({ success: false, message: 'Unauthorized to modify student outside assigned class' });

    const cleanPayload = sanitizeStudentPayload(req.body);
    if (req.user.role === 'Teacher') {
      delete cleanPayload.school_id;
      delete cleanPayload.monthly_fee;
      delete cleanPayload.discount;
    }

    const updated = await Student.findByIdAndUpdate(req.params.studentId, cleanPayload, { new: true, runValidators: true })
      .populate('current_grade', 'name sections')
      .populate('campus_id', 'name code address contact_number');

    res.status(200).json({ success: true, message: 'Student profile updated successfully', student: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update student profile', error: error.message });
  }
};

module.exports = { getTeacherStudentById, createTeacherStudent, updateTeacherStudent };
