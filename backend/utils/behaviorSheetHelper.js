const BADGE_MAP = {
  Exemplary: 'Merit_Star',
  Good: 'Good_Conduct',
  Satisfactory: 'Needs_Counseling',
  'Needs Improvement': 'Disciplinary_Warning'
};

const CONDUCT_MAP = {
  Merit_Star: 'Exemplary',
  Good_Conduct: 'Good',
  Needs_Counseling: 'Satisfactory',
  Disciplinary_Warning: 'Needs Improvement'
};

const compileClassSheet = (students, records, meta) => {
  const recordsMap = new Map(records.map((r) => [String(r.student_id), r]));
  let exemplaryCount = 0;
  let needsAttention = 0;
  let scoreSum = 0;

  const sheet = students.map((s) => {
    const rec = recordsMap.get(String(s._id));
    const conduct = rec?.general_conduct || 'Good';
    if (conduct === 'Exemplary') exemplaryCount++;
    if (conduct === 'Needs Improvement') needsAttention++;
    const aff = rec?.affective_ratings || { punctuality: 5, discipline: 5, neatness: 5, obedience: 5, teamwork: 5 };
    scoreSum += ((aff.punctuality || 5) + (aff.discipline || 5) + (aff.neatness || 5) + (aff.obedience || 5) + (aff.teamwork || 5)) / 5;

    return {
      student: s,
      behaviorRecord: rec || {
        student_id: s._id,
        grade_id: meta.grade_id,
        section: meta.section,
        term_name: meta.term,
        academic_session: meta.academic_session,
        general_conduct: 'Good',
        affective_ratings: { punctuality: 5, discipline: 5, neatness: 5, obedience: 5, teamwork: 5 },
        psychomotor_ratings: { handwriting: 5, communication: 5, sports: 5, creativity: 5, computer_skills: 5 },
        teacher_observation: ''
      }
    };
  });

  const classAverage = students.length ? (scoreSum / students.length).toFixed(1) : '5.0';
  return { sheet, kpis: { totalStudents: students.length, exemplaryCount, classAverage, needsAttention } };
};

module.exports = { BADGE_MAP, CONDUCT_MAP, compileClassSheet };
