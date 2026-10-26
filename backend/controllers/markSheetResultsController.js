const MarkSheet = require('../models/MarkSheet');
const Student = require('../models/Student');
const RemarkPolicy = require('../models/RemarkPolicy');

const getAttendanceSummary = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { grade_id } = req.query;
    const query = { school_id };
    if (grade_id) query.grade_id = grade_id;

    const sheets = await MarkSheet.find(query)
      .populate('grade_id', 'name')
      .populate('subject_id', 'name')
      .populate('exam_category_id', 'name')
      .lean();

    const summary = sheets.map(s => {
      const total = s.marks?.length || 0;
      const absent = s.marks?.filter(m => m.is_absent).length || 0;
      const present = total - absent;
      const rate = total > 0 ? Math.round((present / total) * 100) : 100;
      return {
        sheet_id: s._id,
        class_name: s.grade_id?.name || 'Class',
        subject_name: s.subject_id?.name || 'Subject',
        category: s.exam_category_id?.name || 'Exam',
        exam_date: s.exam_date,
        total_enrolled: total,
        present_count: present,
        absent_count: absent,
        attendance_rate: rate
      };
    });

    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendance summary', error: error.message });
  }
};

const getClassResultsGazette = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { grade_id, exam_category_id } = req.query;
    if (!grade_id) return res.status(400).json({ message: 'Grade is required' });

    const q = { school_id, grade_id };
    if (exam_category_id) q.exam_category_id = exam_category_id;

    const sheets = await MarkSheet.find(q).populate('subject_id', 'name code').populate('marks.student_id', 'name roll_number first_name last_name').lean();
    const policies = await RemarkPolicy.find({ school_id }).lean();

    const studentMap = {};
    for (const sheet of sheets) {
      for (const entry of (sheet.marks || [])) {
        const sid = entry.student_id?._id?.toString();
        if (!sid) continue;
        if (!studentMap[sid]) {
          studentMap[sid] = {
            student_id: sid,
            roll_number: entry.student_id?.roll_number || 'N/A',
            name: `${entry.student_id?.first_name || ''} ${entry.student_id?.last_name || ''}`.trim() || entry.student_id?.name || 'Student',
            subjects: [],
            total_obtained: 0,
            total_max: 0
          };
        }
        studentMap[sid].subjects.push({
          subject_name: sheet.subject_id?.name || 'Subject',
          obtained: entry.is_absent ? 0 : entry.obtained_marks,
          max: sheet.max_marks || 100,
          grade: entry.grade,
          is_absent: entry.is_absent
        });
        studentMap[sid].total_obtained += (entry.is_absent ? 0 : entry.obtained_marks);
        studentMap[sid].total_max += (sheet.max_marks || 100);
      }
    }

    const students = Object.values(studentMap).map(st => {
      const pct = st.total_max > 0 ? Math.round((st.total_obtained / st.total_max) * 100) : 0;
      const tPolicy = policies.find(p => p.type === 'Teacher' && pct >= p.from_percent && pct <= p.to_percent);
      const pPolicy = policies.find(p => p.type === 'Principal' && pct >= p.from_percent && pct <= p.to_percent);
      return {
        ...st,
        percentage: pct,
        overall_grade: pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 33 ? 'D' : 'F',
        status: pct >= 33 ? 'PASSED' : 'FAILED',
        teacher_remark: tPolicy?.remark || 'Good progress.',
        principal_remark: pPolicy?.remark || 'Promoted.'
      };
    }).sort((a, b) => b.percentage - a.percentage);

    students.forEach((s, idx) => { s.rank = idx + 1; });

    res.json({ success: true, count: students.length, gazette: students });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate class results', error: error.message });
  }
};

module.exports = { getAttendanceSummary, getClassResultsGazette };
