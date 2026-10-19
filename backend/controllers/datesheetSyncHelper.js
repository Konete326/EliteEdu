const mongoose = require('mongoose');
const MarkSheet = require('../models/MarkSheet');
const Notification = require('../models/Notification');

const syncMarkSheetsForExam = async (exam, schoolId, userId) => {
  try {
    if (!exam || !Array.isArray(exam.papers) || exam.papers.length === 0) return;
    for (const paper of exam.papers) {
      try {
        const gradeId = paper.grade_id || exam.grade_id || exam.target_classes?.[0]?.grade_id;
        if (!gradeId || !paper.subject_id) continue;
        if (!mongoose.Types.ObjectId.isValid(gradeId) || !mongoose.Types.ObjectId.isValid(paper.subject_id)) continue;

        const rawSection = paper.section || exam.section || 'A';
        const cleanSection = (!rawSection || rawSection === 'All' || rawSection === 'All Sections') ? 'A' : rawSection;

        const query = {
          school_id: schoolId,
          exam_id: exam._id,
          grade_id: gradeId,
          subject_id: paper.subject_id
        };

        const updateData = {
          campus_id: exam.campus_id && mongoose.Types.ObjectId.isValid(exam.campus_id) ? exam.campus_id : null,
          exam_category_id: exam.exam_category_id && mongoose.Types.ObjectId.isValid(exam.exam_category_id) ? exam.exam_category_id : null,
          section: cleanSection,
          examiner_id: paper.examiner_id && mongoose.Types.ObjectId.isValid(paper.examiner_id) ? paper.examiner_id : null,
          exam_date: paper.exam_date || exam.start_date || new Date(),
          max_marks: paper.total_marks || 100,
          passing_marks: paper.passing_marks || 33,
          question_paper_id: paper.question_paper_id && mongoose.Types.ObjectId.isValid(paper.question_paper_id) ? paper.question_paper_id : null
        };

        await MarkSheet.findOneAndUpdate(
          query,
          { $set: updateData, $setOnInsert: { status: 'Draft', created_by: userId, marks: [] } },
          { upsert: true, new: true }
        );
      } catch {}
    }
  } catch {}
};

const notifyStaffForExam = async (exam, schoolId, userId) => {
  try {
    if (!exam || !Array.isArray(exam.papers) || exam.papers.length === 0) return;
    const notified = new Set();
    for (const paper of exam.papers) {
      const staffIds = [paper.examiner_id, paper.invigilator_id, paper.teacher_id].filter(
        (id) => id && mongoose.Types.ObjectId.isValid(id) && !notified.has(String(id))
      );
      for (const sid of staffIds) {
        notified.add(String(sid));
        try {
          await Notification.create({
            school_id: schoolId,
            user_id: sid,
            title: `Exam Duty Assigned: ${exam.title || 'Exam Schedule'}`,
            message: `You have been assigned as examiner/invigilator for ${paper.subject_name || 'Subject'} on ${paper.day_name || ''} (${exam.academic_session}).`,
            type: 'EXAM',
            sender_id: userId
          });
        } catch {}
      }
    }
  } catch {}
};

module.exports = { syncMarkSheetsForExam, notifyStaffForExam };
