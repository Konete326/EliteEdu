const Subject = require('../models/Subject');
const TimetableSlot = require('../models/TimetableSlot');
const Grade = require('../models/Grade');
const { autoScheduleClass } = require('../utils/timetableAutoScheduler');

const autoGenerateTimetable = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user.school_id;
    const { grade_id, section = 'A', campus_id, assignments = [] } = req.body;

    if (!grade_id) {
      return res.status(400).json({ success: false, message: 'Grade / Class is required' });
    }

    if (!Array.isArray(assignments) || assignments.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one subject-teacher assignment is required' });
    }

    const result = await autoScheduleClass({
      school_id: schoolId,
      campus_id: campus_id || null,
      grade_id,
      section,
      assignments
    });

    res.status(200).json({
      success: true,
      message: `Successfully scheduled ${result.count} periods across the week without teacher clashes!`,
      count: result.count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getClassSubjectAssignments = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user.school_id;
    const { grade_id, section = 'A', campus_id } = req.query;

    if (!grade_id) {
      return res.status(400).json({ success: false, message: 'Grade ID is required' });
    }

    const grade = await Grade.findOne({ _id: grade_id, school_id: schoolId }).lean();
    const gradeName = grade?.name || '';

    const subjectFilter = { school_id: schoolId, status: 'Active' };
    if (campus_id) subjectFilter.campus_id = campus_id;
    if (gradeName) {
      subjectFilter.$or = [
        { classes: { $in: [gradeName] } },
        { classes: { $size: 0 } },
        { classes: { $exists: false } }
      ];
    }

    const [subjects, existingSlots] = await Promise.all([
      Subject.find(subjectFilter).populate('assigned_teacher', 'name email designation').lean(),
      TimetableSlot.find({ school_id: schoolId, grade_id, section }).lean()
    ]);

    const teacherBySubject = {};
    existingSlots.forEach((slot) => {
      if (slot.subject_id && slot.teacher_id) {
        teacherBySubject[String(slot.subject_id)] = String(slot.teacher_id);
      }
    });

    const assignments = subjects.map((sub) => {
      const currentTeacherId = teacherBySubject[String(sub._id)] || (sub.assigned_teacher ? String(sub.assigned_teacher._id) : '');
      return {
        subject_id: sub._id,
        subject_name: sub.name,
        subject_code: sub.code,
        subject_type: sub.subject_type || 'Compulsory',
        periods_per_week: sub.periods_per_week || 5,
        teacher_id: currentTeacherId,
        teacher_name: sub.assigned_teacher?.name || ''
      };
    });

    res.status(200).json({ success: true, grade_name: gradeName, section, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { autoGenerateTimetable, getClassSubjectAssignments };

