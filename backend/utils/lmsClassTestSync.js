const ClassTest = require('../models/ClassTest');

const evaluateGradeLetter = (pct) => {
  if (pct >= 85) return 'A+';
  if (pct >= 70) return 'A';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  if (pct >= 40) return 'D';
  return 'F';
};

const syncSubmissionsToClassTest = async (item, submissions, schoolId, userId) => {
  if (!item || !item.grade_id || !item.subject_id) return null;
  const gradeId = item.grade_id?._id || item.grade_id;
  const subjectId = item.subject_id?._id || item.subject_id;
  const section = item.section || 'A';
  const totalMax = Number(item.max_marks || 25);
  const passMarks = Math.round(totalMax * 0.33);
  const testTitle = `LMS: ${item.title}`.trim();

  let classTest = await ClassTest.findOne({
    school_id: schoolId,
    grade_id: gradeId,
    section,
    subject_id: subjectId,
    title: testTitle
  });

  if (!classTest) {
    classTest = new ClassTest({
      school_id: schoolId,
      campus_id: item.campus_id || null,
      title: testTitle,
      topic: item.title,
      test_date: item.due_date || new Date(),
      grade_id: gradeId,
      section,
      subject_id: subjectId,
      teacher_id: item.teacher_id || userId,
      total_marks: totalMax,
      passing_marks: passMarks,
      status: 'Published'
    });
  }

  const compiledMarks = (submissions || []).map((s) => {
    const isAbsent = s.status === 'Absent';
    const obtained = isAbsent ? 0 : Math.min(totalMax, Math.max(0, Number(s.obtained_marks) || 0));
    const pct = totalMax > 0 ? Math.round((obtained / totalMax) * 100) : 0;
    const gradeLetter = evaluateGradeLetter(pct);
    const passStatus = isAbsent ? 'ABSENT' : (obtained >= passMarks ? 'PASS' : 'FAIL');
    return {
      student_id: s.student_id,
      obtained_marks: obtained,
      is_absent: isAbsent,
      percentage: pct,
      grade_letter: gradeLetter,
      pass_status: passStatus,
      remarks: s.remarks || 'Synced from LMS Submission'
    };
  });

  classTest.marks = compiledMarks;
  classTest.status = 'Published';
  classTest.total_marks = totalMax;
  classTest.passing_marks = passMarks;
  await classTest.save();
  return classTest;
};

module.exports = { syncSubmissionsToClassTest };
