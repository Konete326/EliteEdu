const User = require('../models/User');
const Grade = require('../models/Grade');
const Student = require('../models/Student');

const getTeacherPortalMe = async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.user.id,
      school_id: req.user.school_id
    })
      .select('-password')
      .populate('campus_id', 'name code address contact_number')
      .populate('subjects', 'name code')
      .populate('grades', 'name sections');

    if (!teacher || teacher.status === 'Inactive') {
      return res.status(403).json({ success: false, message: 'Teacher profile not accessible' });
    }

    const classTeacherGrades = await Grade.find({
      school_id: req.user.school_id,
      class_teacher: req.user.id
    }).select('name sections campus_id');

    const permissions = teacher.app_settings || teacher.app_permissions || {};

    res.status(200).json({
      success: true,
      teacher,
      class_teacher_grades: classTeacherGrades,
      permissions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load teacher profile', error: error.message });
  }
};

const getTeacherStudents = async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.user.id,
      school_id: req.user.school_id
    }).select('class_assignments grades campus_id');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const classTeacherGrades = await Grade.find({
      school_id: req.user.school_id,
      class_teacher: req.user.id
    }).select('_id');

    const assignedGradeIds = new Set();
    const specificSectionsByGrade = {};

    classTeacherGrades.forEach((g) => assignedGradeIds.add(String(g._id)));

    if (Array.isArray(teacher.grades)) {
      teacher.grades.forEach((gId) => assignedGradeIds.add(String(gId)));
    }

    if (Array.isArray(teacher.class_assignments)) {
      teacher.class_assignments.forEach((ca) => {
        if (ca.grade_id) {
          const gIdStr = String(ca.grade_id);
          assignedGradeIds.add(gIdStr);
          if (ca.section) {
            if (!specificSectionsByGrade[gIdStr]) specificSectionsByGrade[gIdStr] = new Set();
            specificSectionsByGrade[gIdStr].add(ca.section);
          }
        }
      });
    }

    const gradeIdArray = Array.from(assignedGradeIds);
    if (gradeIdArray.length === 0) {
      return res.status(200).json({ success: true, students: [], total: 0 });
    }

    const filter = {
      school_id: req.user.school_id,
      current_grade: { $in: gradeIdArray },
      status: 'Active'
    };

    if (teacher.campus_id) {
      filter.campus_id = teacher.campus_id;
    }

    const students = await Student.find(filter)
      .populate('current_grade', 'name')
      .populate('campus_id', 'name')
      .select('name father_name gr_number current_grade current_section contact_number emergency_contact_no photo_url status')
      .sort({ current_section: 1, name: 1 })
      .lean();

    const filtered = students.filter((s) => {
      const gIdStr = String(s.current_grade?._id || s.current_grade || '');
      const allowedSections = specificSectionsByGrade[gIdStr];
      if (!allowedSections || allowedSections.size === 0) return true;
      return allowedSections.has(s.current_section);
    });

    res.status(200).json({ success: true, students: filtered, total: filtered.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch students', error: error.message });
  }
};

module.exports = { getTeacherPortalMe, getTeacherStudents };
