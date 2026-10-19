const mongoose = require('mongoose');

const cleanObjectId = (val) => {
  if (!val || val === '') return null;
  if (typeof val === 'object' && val !== null) {
    if (val._id) return cleanObjectId(val._id);
    if (val.id) return cleanObjectId(val.id);
    if (val instanceof mongoose.Types.ObjectId) return val;
    return null;
  }
  const str = String(val).trim();
  return mongoose.Types.ObjectId.isValid(str) ? new mongoose.Types.ObjectId(str) : null;
};

const sanitizeExamPayload = (data = {}) => {
  const cleaned = { ...data };
  cleaned.grade_id = cleanObjectId(cleaned.grade_id);
  cleaned.exam_category_id = cleanObjectId(cleaned.exam_category_id);
  cleaned.grading_policy_id = cleanObjectId(cleaned.grading_policy_id);
  cleaned.campus_id = cleanObjectId(cleaned.campus_id);
  cleaned.start_date = cleaned.start_date ? new Date(cleaned.start_date) : null;
  cleaned.end_date = cleaned.end_date ? new Date(cleaned.end_date) : null;
  cleaned.academic_session = cleaned.academic_session || '2026-2027';
  cleaned.status = cleaned.status || 'Draft';
  cleaned.term_type = cleaned.term_type || 'Mid Term';

  if (Array.isArray(cleaned.target_classes) && cleaned.target_classes.length > 0) {
    cleaned.target_classes = cleaned.target_classes
      .map((tc) => ({
        grade_id: cleanObjectId(tc.grade_id),
        grade_name: tc.grade_name || '',
        section: tc.section || 'A'
      }))
      .filter((tc) => tc.grade_id !== null);
    if (!cleaned.grade_id && cleaned.target_classes.length > 0) {
      cleaned.grade_id = cleaned.target_classes[0].grade_id;
    }
  } else if (cleaned.grade_id) {
    cleaned.target_classes = [{
      grade_id: cleaned.grade_id,
      grade_name: cleaned.grade_name || 'Class',
      section: cleaned.section || 'All'
    }];
  } else {
    cleaned.target_classes = [];
  }

  if (Array.isArray(cleaned.papers)) {
    cleaned.papers = cleaned.papers
      .filter((p) => p && typeof p === 'object' && (p.subject_id || p.subject_name || p.exam_date || p.day_name || p.start_time))
      .map((p) => {
        const sid = cleanObjectId(p.subject_id);
        const gid = cleanObjectId(p.grade_id) || cleaned.grade_id || null;
        return {
          ...p,
          grade_id: gid,
          grade_name: p.grade_name || '',
          section: p.section || cleaned.section || 'A',
          subject_id: sid,
          subject_name: p.subject_name || (sid ? 'Subject' : 'Paper'),
          subject_code: p.subject_code || '',
          teacher_id: cleanObjectId(p.teacher_id),
          examiner_id: cleanObjectId(p.examiner_id) || cleanObjectId(p.teacher_id),
          examiner_name: p.examiner_name || '',
          invigilator_id: cleanObjectId(p.invigilator_id),
          invigilator_name: p.invigilator_name || '',
          question_paper_id: cleanObjectId(p.question_paper_id),
          exam_date: p.exam_date ? new Date(p.exam_date) : null,
          day_name: p.day_name || '',
          start_time: p.start_time || '09:00 AM',
          end_time: p.end_time || '12:00 PM',
          room_no: p.room_no || 'Hall 1',
          theory_marks: Number(p.theory_marks) || 0,
          practical_marks: Number(p.practical_marks) || 0,
          total_marks: Number(p.total_marks) || 100,
          passing_marks: Number(p.passing_marks) || 33,
          syllabus: p.syllabus || ''
        };
      });
  } else {
    cleaned.papers = [];
  }

  return cleaned;
};

module.exports = { sanitizeExamPayload, cleanObjectId };
