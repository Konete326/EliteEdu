const computeStudentAggregate = (students, tests) => {
  const studentMap = new Map();
  students.forEach((s) => {
    studentMap.set(String(s._id), {
      student_id: s._id,
      name: s.name,
      father_name: s.father_name,
      gr_number: s.gr_number,
      roll_number: s.roll_number,
      tests_appeared: 0,
      total_tests: tests.length,
      total_max: 0,
      total_obtained: 0,
      failed_tests: 0
    });
  });

  tests.forEach((t) => {
    (t.marks || []).forEach((m) => {
      const sId = String(m.student_id);
      if (studentMap.has(sId)) {
        const item = studentMap.get(sId);
        if (!m.is_absent && m.pass_status !== 'ABSENT') {
          item.tests_appeared += 1;
          item.total_max += t.total_marks || 25;
          item.total_obtained += m.obtained_marks || 0;
          if (m.pass_status === 'FAIL') item.failed_tests += 1;
        }
      }
    });
  });

  return Array.from(studentMap.values()).map((row) => {
    const pct = row.total_max > 0 ? Math.round((row.total_obtained / row.total_max) * 100) : 0;
    const grade = pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B+' : pct >= 50 ? 'B' : pct >= 40 ? 'C' : pct >= 33 ? 'D' : 'F';
    const status = pct >= 33 && row.failed_tests === 0 ? 'PASS' : 'FAIL';
    return { ...row, percentage: pct, grade_letter: grade, pass_status: status };
  }).sort((a, b) => b.percentage - a.percentage);
};

const computeSubjectAverages = (tests) => {
  const subMap = new Map();
  tests.forEach((t) => {
    const sName = t.subject_id?.name || 'General';
    if (!subMap.has(sName)) subMap.set(sName, { totalObtained: 0, totalMax: 0 });
    const sub = subMap.get(sName);
    (t.marks || []).forEach((m) => {
      if (!m.is_absent) {
        sub.totalObtained += m.obtained_marks || 0;
        sub.totalMax += t.total_marks || 25;
      }
    });
  });

  return Array.from(subMap.entries()).map(([subject, data]) => ({
    subject,
    average_percentage: data.totalMax > 0 ? Math.round((data.totalObtained / data.totalMax) * 100) : 0
  }));
};

module.exports = { computeStudentAggregate, computeSubjectAverages };
