const ExamMark = require('../models/ExamMark');
const Student = require('../models/Student');

const syncStudentLatestPercentages = async (schoolId, studentIds) => {
  if (!Array.isArray(studentIds) || !studentIds.length) return;
  try {
    const aggregates = await ExamMark.aggregate([
      { $match: { school_id: schoolId, student_id: { $in: studentIds } } },
      {
        $group: {
          _id: '$student_id',
          totalObtained: { $sum: '$total_obtained' },
          totalMax: { $sum: '$max_marks' }
        }
      }
    ]);

    const ops = aggregates.map((agg) => {
      const pct = agg.totalMax > 0 ? Math.round((agg.totalObtained / agg.totalMax) * 100) : 0;
      return {
        updateOne: {
          filter: { _id: agg._id, school_id: schoolId },
          update: { $set: { latest_exam_percentage: pct } }
        }
      };
    });

    if (ops.length > 0) {
      await Student.bulkWrite(ops);
    }
  } catch {}
};

module.exports = { syncStudentLatestPercentages };
