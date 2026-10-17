const { createSystemNotification } = require('./notificationDispatcher');

const dispatchExaminerAlerts = (exam, schoolId, creatorId) => {
  if (!Array.isArray(exam.papers)) return;
  const uniqueExaminers = new Map();
  exam.papers.forEach((p) => {
    if (p.examiner_id && !uniqueExaminers.has(String(p.examiner_id))) {
      uniqueExaminers.set(String(p.examiner_id), p);
    }
  });

  uniqueExaminers.forEach((paper, examinerId) => {
    createSystemNotification({
      school_id: schoolId,
      campus_id: exam.campus_id || null,
      title: 'Exam Paper Assigned',
      message: `You are assigned as examiner for ${paper.subject_name} (${paper.grade_name || 'Class'}) in ${exam.title}.`,
      type: 'Academic',
      priority: 'Important',
      target_audience: 'Specific_User',
      target_user_id: examinerId,
      action_url: '/teacher/exams',
      created_by: creatorId
    });
  });
};

module.exports = { dispatchExaminerAlerts };
