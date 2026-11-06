const Subject = require('../models/Subject');
const Student = require('../models/Student');

const resolveGradeSubjectsForStudents = async (schoolId, targetGrade, students = []) => {
  if (!targetGrade || !students.length) return [];
  const targetGradeId = String(targetGrade._id || targetGrade.id || targetGrade);
  const gradeName = targetGrade.name ? targetGrade.name.toLowerCase().trim() : '';

  const subjects = await Subject.find({
    school_id: schoolId,
    status: 'Active'
  }).lean();

  if (!subjects.length) return [];

  const gradeFiltered = subjects.filter((s) => {
    if (!s.classes || s.classes.length === 0) return true;
    return s.classes.some((c) => {
      const cStr = String(c).toLowerCase().trim();
      return cStr === gradeName || cStr === targetGradeId;
    });
  });

  const pool = gradeFiltered.length > 0 ? gradeFiltered : subjects;

  return students.map((student) => {
    const stream = student.elective_stream || 'None';
    const assigned = pool.filter((s) => {
      if (s.subject_type === 'Compulsory' || s.mandatory) return true;
      if (!stream || stream === 'None' || stream === 'General') return false;
      if (stream === 'Science (Biology)') {
        return s.stream === 'Science (Biology)' || s.code === 'BIO' || (s.name && s.name.toLowerCase().includes('bio'));
      }
      if (stream === 'Science (Computer)') {
        return s.stream === 'Science (Computer)' || s.code === 'CS' || (s.name && s.name.toLowerCase().includes('comp'));
      }
      if (stream === 'Arts / Humanities') {
        return s.stream === 'Arts / Humanities' || (s.name && (s.name.toLowerCase().includes('art') || s.name.toLowerCase().includes('human')));
      }
      if (stream === 'Commerce') {
        return s.stream === 'Commerce' || (s.name && s.name.toLowerCase().includes('comm'));
      }
      return false;
    });
    return {
      student_id: student._id,
      subject_ids: assigned.map((s) => s._id)
    };
  });
};

const buildPromotionBulkOps = async ({ schoolId, toPromoteIds, targetGrade, target_section, fromName, transitionLabel }) => {
  const studentsToPromote = await Student.find({
    _id: { $in: toPromoteIds },
    school_id: schoolId
  }).select('_id elective_stream').lean();

  const mappings = await resolveGradeSubjectsForStudents(schoolId, targetGrade, studentsToPromote);
  const subjectMap = new Map(mappings.map((m) => [String(m.student_id), m.subject_ids]));

  return toPromoteIds.map((id) => {
    const newSubjects = subjectMap.get(String(id));
    const setFields = {
      previous_grade_name: fromName,
      current_grade: targetGrade._id,
      current_section: target_section,
      last_promoted_at: new Date(),
      last_promotion_label: transitionLabel,
      promotion_status: 'Promoted',
      'academic_history.last_class': fromName
    };
    if (newSubjects && newSubjects.length > 0) {
      setFields.subjects = newSubjects;
    }
    return {
      updateOne: {
        filter: { _id: id, school_id: schoolId },
        update: { $set: setFields }
      }
    };
  });
};

module.exports = { resolveGradeSubjectsForStudents, buildPromotionBulkOps };
