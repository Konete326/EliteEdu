const { DEFAULT_SCALE } = require('../models/GradingPolicy');

const evaluateGrade = (percentage, scale = null) => {
  const num = Math.max(0, Math.min(100, Number(percentage) || 0));
  const activeScale = Array.isArray(scale) && scale.length > 0 ? scale : DEFAULT_SCALE;

  for (const item of activeScale) {
    if (num >= item.percent_from && num <= item.percent_upto) {
      return {
        grade_letter: item.grade,
        status: item.status || (item.grade === 'F' ? 'FAIL' : 'PASS'),
        remarks: item.remarks || ''
      };
    }
  }

  if (num >= 80) return { grade_letter: 'A+', status: 'PASS', remarks: 'Outstanding' };
  if (num >= 70) return { grade_letter: 'A', status: 'PASS', remarks: 'Excellent' };
  if (num >= 60) return { grade_letter: 'B+', status: 'PASS', remarks: 'Very Good' };
  if (num >= 50) return { grade_letter: 'B', status: 'PASS', remarks: 'Good' };
  if (num >= 40) return { grade_letter: 'C', status: 'PASS', remarks: 'Fair' };
  if (num >= 33) return { grade_letter: 'D', status: 'PASS', remarks: 'Satisfactory' };
  return { grade_letter: 'F', status: 'FAIL', remarks: 'Needs Improvement' };
};

module.exports = { evaluateGrade };
