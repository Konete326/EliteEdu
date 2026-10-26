const Student = require('../models/Student');
const Grade = require('../models/Grade');
const PromotionLog = require('../models/PromotionLog');
const { createSystemNotification } = require('../utils/notificationDispatcher');

const promoteStudents = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const {
      mode = 'Manual',
      source_grade_id,
      target_grade_id,
      target_section = 'A',
      student_ids = [],
      pass_percentage = 33
    } = req.body;

    if (!target_grade_id) {
      return res.status(400).json({ success: false, message: 'Target grade is required' });
    }
    const [sourceGrade, targetGrade] = await Promise.all([
      source_grade_id ? Grade.findById(source_grade_id).lean() : null,
      Grade.findById(target_grade_id).lean()
    ]);
    if (!targetGrade) return res.status(404).json({ success: false, message: 'Target grade not found' });

    let toPromoteIds = [];
    let toRetainIds = [];
    if (mode === 'Auto_Criteria') {
      if (!source_grade_id) return res.status(400).json({ success: false, message: 'Source grade required for auto promotion' });
      const pool = await Student.find({ school_id: schoolId, current_grade: source_grade_id, status: 'Active' }).select('_id latest_exam_percentage').lean();
      pool.forEach((s) => {
        const score = typeof s.latest_exam_percentage === 'number' ? s.latest_exam_percentage : 70;
        if (score >= pass_percentage) {
          toPromoteIds.push(s._id);
        } else {
          toRetainIds.push(s._id);
        }
      });
    } else {
      toPromoteIds = student_ids;
    }

    if (!toPromoteIds.length) {
      return res.status(400).json({ success: false, message: 'No students qualified for promotion' });
    }

    const fromName = sourceGrade?.name || 'Previous Grade';
    const toName = targetGrade.name;
    const transitionLabel = `${fromName} → ${toName}`;

    await Student.updateMany(
      { _id: { $in: toPromoteIds }, school_id: schoolId },
      {
        $set: {
          previous_grade_name: fromName,
          current_grade: targetGrade._id,
          current_section: target_section,
          last_promoted_at: new Date(),
          last_promotion_label: transitionLabel,
          promotion_status: 'Promoted',
          'academic_history.last_class': fromName
        }
      }
    );

    if (toRetainIds.length > 0) {
      await Student.updateMany(
        { _id: { $in: toRetainIds }, school_id: schoolId },
        { $set: { promotion_status: 'Retained' } }
      );
    }

    const log = await PromotionLog.create({
      school_id: schoolId,
      campus_id: targetGrade.campus_id || null,
      from_grade: sourceGrade?._id || targetGrade._id,
      from_grade_name: fromName,
      to_grade: targetGrade._id,
      to_grade_name: toName,
      to_section: target_section,
      mode,
      pass_percentage_used: pass_percentage,
      promoted_count: toPromoteIds.length,
      retained_count: toRetainIds.length,
      student_ids: toPromoteIds,
      promoted_by: req.user.id
    });

    createSystemNotification({
      school_id: schoolId,
      campus_id: targetGrade.campus_id || null,
      title: 'Students Promoted',
      message: `${toPromoteIds.length} students promoted to ${toName} (${target_section}).`,
      type: 'Promotion',
      priority: 'Important',
      target_audience: 'All',
      action_url: '/admin/students/promote',
      created_by: req.user.id
    });

    return res.status(200).json({
      success: true,
      message: `Successfully promoted ${toPromoteIds.length} students to ${toName} (${target_section})!`,
      promoted_count: toPromoteIds.length,
      retained_count: toRetainIds.length,
      log
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { promoteStudents };
