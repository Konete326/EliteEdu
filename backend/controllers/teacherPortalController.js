const mongoose = require('mongoose');
const User = require('../models/User');
const Grade = require('../models/Grade');
const Student = require('../models/Student');
const School = require('../models/School');

const normSec = (sec) => {
  if (!sec) return '';
  const s = String(sec).toUpperCase().trim();
  const cleaned = s.replace(/^(SEC(?:TION)?[\s-_:]*|CLASS\s*[\w\s]+-\s*SEC(?:TION)?[\s-_:]*)/i, '').trim();
  return cleaned || s;
};

const getTeacherPortalMe = async (req, res) => {
  try {
    const teacher = await User.findOne({ _id: req.user.id, school_id: req.user.school_id })
      .select('-password').populate('campus_id', 'name code').populate('subjects', 'name code')
      .populate('grades', 'name sections').populate('custom_role_id');
    if (!teacher || teacher.status === 'Inactive') {
      return res.status(403).json({ success: false, message: 'Teacher profile not accessible' });
    }
    const [ctGrades, school] = await Promise.all([
      Grade.find({ school_id: req.user.school_id, class_teacher: req.user.id }).select('name sections campus_id'),
      School.findById(req.user.school_id).select('theme_settings').lean()
    ]);
    const permissions = teacher.app_settings || teacher.app_permissions || {};
    res.status(200).json({
      success: true, teacher, class_teacher_grades: ctGrades, permissions,
      custom_role: teacher.custom_role_id || null,
      role_permissions: teacher.custom_role_id?.permissions || [],
      theme_settings: school?.theme_settings || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load teacher profile', error: error.message });
  }
};

const getTeacherStudents = async (req, res) => {
  try {
    const teacher = await User.findOne({ _id: req.user.id, school_id: req.user.school_id }).select('class_assignments grades campus_id');
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });

    const ctGrades = await Grade.find({ school_id: req.user.school_id, class_teacher: req.user.id }).select('_id name');
    const assignedIds = new Set(ctGrades.map((g) => String(g._id)));
    const assignedNames = new Set(ctGrades.map((g) => g.name.trim()));
    const sectionsByGrade = {};

    ctGrades.forEach((g) => {
      sectionsByGrade[String(g._id)] = new Set(['ALL']);
      sectionsByGrade[g.name.toLowerCase().trim()] = new Set(['ALL']);
    });
    (teacher.grades || []).forEach((gId) => {
      assignedIds.add(String(gId));
      sectionsByGrade[String(gId)] = new Set(['ALL']);
    });
    (teacher.class_assignments || []).forEach((ca) => {
      const gIdStr = ca.grade_id ? String(ca.grade_id) : '';
      const cName = (ca.class_name || ca.grade_name || '').trim();
      if (gIdStr) assignedIds.add(gIdStr);
      if (cName) assignedNames.add(cName);
      const secNorm = normSec(ca.section);
      [gIdStr, cName.toLowerCase()].filter(Boolean).forEach((k) => {
        if (!sectionsByGrade[k] || !sectionsByGrade[k].has('ALL')) {
          if (!sectionsByGrade[k]) sectionsByGrade[k] = new Set();
          if (secNorm) sectionsByGrade[k].add(secNorm);
        }
      });
    });

    const orClauses = [];
    if (assignedIds.size > 0) orClauses.push({ _id: { $in: Array.from(assignedIds).filter((id) => mongoose.Types.ObjectId.isValid(id)) } });
    if (assignedNames.size > 0) orClauses.push({ name: { $in: Array.from(assignedNames) } });
    if (orClauses.length === 0) return res.status(200).json({ success: true, students: [], total: 0 });

    const matchingGrades = await Grade.find({ school_id: req.user.school_id, $or: orClauses }).select('_id name').lean();
    matchingGrades.forEach((g) => { assignedIds.add(String(g._id)); assignedNames.add(g.name.trim()); });

    const finalGradeIds = Array.from(assignedIds).filter((id) => mongoose.Types.ObjectId.isValid(id)).map((id) => new mongoose.Types.ObjectId(id));
    const students = await Student.find({
      school_id: req.user.school_id,
      $or: [{ current_grade: { $in: finalGradeIds } }, { class_name: { $in: Array.from(assignedNames) } }, { current_grade: { $in: Array.from(assignedNames) } }],
      status: { $nin: ['Left', 'Deleted'] }
    }).populate('current_grade', 'name sections').populate('campus_id', 'name').sort({ current_section: 1, name: 1 }).lean();

    const filtered = students.filter((s) => {
      const gIdStr = String(s.current_grade?._id || s.current_grade || '');
      const gNameStr = String(s.current_grade?.name || s.class_name || '').toLowerCase().trim();
      const allowed = sectionsByGrade[gIdStr] || sectionsByGrade[gNameStr];
      if (!allowed || allowed.has('ALL') || allowed.size === 0) return true;
      const sSec = normSec(s.current_section);
      if (!sSec) return true;
      for (const a of allowed) {
        if (a === 'ALL' || a === sSec || normSec(a) === sSec || a === s.current_section) return true;
      }
      return false;
    });

    res.status(200).json({ success: true, students: filtered, total: filtered.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch students', error: error.message });
  }
};

module.exports = { getTeacherPortalMe, getTeacherStudents };
