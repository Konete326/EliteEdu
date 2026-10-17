const { evaluateGrade } = require('./gradingEvaluator');

const buildMarksUpsertOp = (r, exam, paper, schoolId, userId) => {
  const maxTheory = paper?.theory_marks ?? 75;
  const maxPractical = paper?.practical_marks ?? 25;
  const totalMax = paper?.total_marks ?? (maxTheory + maxPractical);
  const scale = exam.grading_policy_id?.grading_scale;
  const isAbsent = r.status === 'ABSENT';
  const tMarks = isAbsent ? 0 : Math.min(maxTheory, Math.max(0, Number(r.theory_obtained) || 0));
  const pMarks = isAbsent ? 0 : Math.min(maxPractical, Math.max(0, Number(r.practical_obtained) || 0));
  const totalObtained = isAbsent ? 0 : tMarks + pMarks;
  const pct = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
  const evalResult = isAbsent ? { grade_letter: 'F', status: 'ABSENT', remarks: 'Absent' } : evaluateGrade(pct, scale);

  return {
    updateOne: {
      filter: { exam_id: exam._id, grade_id: paper.grade_id, section: paper.section, subject_id: paper.subject_id, student_id: r.student_id, school_id: schoolId },
      update: {
        $set: {
          school_id: schoolId,
          exam_id: exam._id,
          grade_id: paper.grade_id,
          section: paper.section,
          subject_id: paper.subject_id,
          student_id: r.student_id,
          theory_obtained: tMarks,
          practical_obtained: pMarks,
          total_obtained: totalObtained,
          max_marks: totalMax,
          percentage: pct,
          grade_letter: evalResult.grade_letter,
          status: evalResult.status,
          remarks: r.remarks || evalResult.remarks || '',
          marked_by: userId
        }
      },
      upsert: true
    }
  };
};

module.exports = { buildMarksUpsertOp };
