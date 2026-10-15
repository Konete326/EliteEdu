export const DEFAULT_GRADING_SCALE = [
  { grade: 'A+', percent_from: 80, percent_upto: 100, status: 'PASS', remarks: 'Outstanding' },
  { grade: 'A', percent_from: 70, percent_upto: 79, status: 'PASS', remarks: 'Excellent' },
  { grade: 'B+', percent_from: 60, percent_upto: 69, status: 'PASS', remarks: 'Very Good' },
  { grade: 'B', percent_from: 50, percent_upto: 59, status: 'PASS', remarks: 'Good' },
  { grade: 'C', percent_from: 40, percent_upto: 49, status: 'PASS', remarks: 'Fair' },
  { grade: 'D', percent_from: 33, percent_upto: 39, status: 'PASS', remarks: 'Satisfactory' },
  { grade: 'F', percent_from: 0, percent_upto: 32, status: 'FAIL', remarks: 'Needs Improvement' }
];

export const DEFAULT_FAIL_CRITERIA = {
  overall_percentage: 40,
  subject_percentage: 33,
  min_failed_subjects: 1
};

export const getGradeForPercentage = (percentage, scale = DEFAULT_GRADING_SCALE) => {
  const rounded = Math.round(percentage);
  const match = scale.find((item) => rounded >= item.percent_from && rounded <= item.percent_upto);
  if (match) return match;
  if (percentage >= 100) return scale[0] || { grade: 'A+', status: 'PASS', remarks: 'Outstanding' };
  return scale[scale.length - 1] || { grade: 'F', status: 'FAIL', remarks: 'Needs Improvement' };
};

export const evaluateStudentResult = (subjectScores = [], policy = null) => {
  const scale = policy?.grading_scale?.length ? policy.grading_scale : DEFAULT_GRADING_SCALE;
  const criteria = policy?.fail_criteria || DEFAULT_FAIL_CRITERIA;

  let totalObtained = 0;
  let totalMax = 0;
  let failedSubjectsCount = 0;

  const evaluatedSubjects = subjectScores.map((subj) => {
    const obtained = Number(subj.obtained_marks) || 0;
    const max = Number(subj.total_marks) || 100;
    totalObtained += obtained;
    totalMax += max;

    const percentage = max > 0 ? (obtained / max) * 100 : 0;
    const gradeObj = getGradeForPercentage(percentage, scale);
    const isSubjectFailed = percentage <= criteria.subject_percentage;
    if (isSubjectFailed) failedSubjectsCount += 1;

    return {
      ...subj,
      percentage: Number(percentage.toFixed(1)),
      grade: gradeObj.grade,
      remarks: gradeObj.remarks,
      status: isSubjectFailed ? 'FAIL' : 'PASS'
    };
  });

  const overallPercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
  const overallGrade = getGradeForPercentage(overallPercentage, scale);

  let finalStatus = 'PASS';
  if (overallPercentage <= criteria.overall_percentage) {
    finalStatus = 'FAIL';
  } else if (failedSubjectsCount >= criteria.min_failed_subjects) {
    finalStatus = 'FAIL';
  }

  return {
    subjects: evaluatedSubjects,
    totalObtainedMarks: totalObtained,
    totalMaxMarks: totalMax,
    overallPercentage: Number(overallPercentage.toFixed(1)),
    overallGrade: overallGrade.grade,
    overallRemarks: overallGrade.remarks,
    failedSubjectsCount,
    isPassed: finalStatus === 'PASS',
    finalStatus,
    criteriaApplied: criteria
  };
};
