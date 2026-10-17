const MarkSheet = require('../models/MarkSheet');
const Notification = require('../models/Notification');

const syncMarkSheetsForExam = async (exam, schoolId, userId) => {
  if (!exam || !Array.isArray(exam.papers)) return;
  for (const paper of exam.papers) {
    const gradeId = paper.grade_id || exam.grade_id || exam.target_classes?.[0]?.grade_id;
    if (!gradeId || !paper.subject_id) continue;

    const query = {
      school_id: schoolId,
      exam_id: exam._id,
      grade_id: gradeId,
      subject_id: paper.subject_id
    };

    const updateData = {
      campus_id: exam.campus_id,
      exam_category_id: exam.exam_category_id,
      section: paper.section || exam.section || 'A',
      examiner_id: paper.examiner_id,
      exam_date: paper.exam_date || exam.start_date || new Date(),
      max_marks: paper.total_marks || 100,
      passing_marks: paper.passing_marks || 33,
      question_paper_id: paper.question_paper_id || null
    };

    await MarkSheet.findOneAndUpdate(
      query,
      { $set: updateData, $setOnInsert: { status: 'Draft', created_by: userId, marks: [] } },
      { upsert: true, new: true }
    );
  }
};

const notifyStaffForExam = async (exam, schoolId, userId) => {
  if (!exam || !Array.isArray(exam.papers)) return;
  const notified = new Set();
  for (const paper of exam.papers) {
    const staffIds = [paper.examiner_id, paper.invigilator_id].filter((id) => id && !notified.has(String(id)));
    for (const sid of staffIds) {
      notified.add(String(sid));
      try {
        await Notification.create({
          school_id: schoolId,
          user_id: sid,
          title: `Exam Duty Assigned: ${exam.title}`,
          message: `You have been assigned as examiner/invigilator for ${paper.subject_name || 'Subject'} on ${paper.day_name || ''} (${exam.academic_session}).`,
          type: 'EXAM',
          sender_id: userId
        });
      } catch {}
    }
  }
};

module.exports = { syncMarkSheetsForExam, notifyStaffForExam };
