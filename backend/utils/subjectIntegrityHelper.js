const Subject = require('../models/Subject');
const TimetableSlot = require('../models/TimetableSlot');
const Exam = require('../models/Exam');
const ExamMark = require('../models/ExamMark');
const Homework = require('../models/Homework');
const LmsItem = require('../models/LmsItem');

const checkSubjectUsage = async (schoolId, subjectId) => {
  const [slotCount, examCount, markCount, hwCount, lmsCount] = await Promise.all([
    TimetableSlot.countDocuments({ school_id: schoolId, subject_id: subjectId }),
    Exam.countDocuments({ school_id: schoolId, 'papers.subject_id': subjectId }),
    ExamMark.countDocuments({ school_id: schoolId, subject_id: subjectId }),
    Homework.countDocuments({ school_id: schoolId, subject_id: subjectId }),
    LmsItem.countDocuments({ school_id: schoolId, subject_id: subjectId })
  ]);

  const breakdown = {
    timetable: slotCount,
    exams: examCount,
    marks: markCount,
    homework: hwCount,
    lms: lmsCount
  };

  const totalLinked = slotCount + examCount + markCount + hwCount + lmsCount;
  const parts = [];
  if (slotCount > 0) parts.push(`${slotCount} timetable ${slotCount === 1 ? 'period' : 'periods'}`);
  if (examCount > 0) parts.push(`${examCount} ${examCount === 1 ? 'exam' : 'exams'}`);
  if (markCount > 0) parts.push(`${markCount} student ${markCount === 1 ? 'mark' : 'marks'}`);
  if (hwCount > 0) parts.push(`${hwCount} homework ${hwCount === 1 ? 'task' : 'tasks'}`);
  if (lmsCount > 0) parts.push(`${lmsCount} LMS ${lmsCount === 1 ? 'topic' : 'topics'}`);

  return {
    totalLinked,
    breakdown,
    summaryText: parts.join(', ')
  };
};

const findCodeCollision = async (schoolId, code, excludeId = null, campusId = null) => {
  if (!code || !code.trim()) return null;
  const base = code.trim().toUpperCase();
  const query = { school_id: schoolId, code: base };
  if (excludeId) query._id = { $ne: excludeId };
  if (campusId) {
    query.$or = [{ campus_id: campusId }, { campus_id: null }];
  }
  const existing = await Subject.findOne(query).select('name code').lean();
  if (!existing) return null;

  let suffix = 2;
  const root = base.replace(/-\d+$/, '');
  while (await Subject.exists({ school_id: schoolId, code: `${root}-${suffix}` })) {
    suffix++;
  }
  return {
    existing,
    suggested_code: `${root}-${suffix}`
  };
};

module.exports = {
  checkSubjectUsage,
  findCodeCollision
};
