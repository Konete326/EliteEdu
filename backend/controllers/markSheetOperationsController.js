const MarkSheet = require('../models/MarkSheet');

const saveMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks, status } = req.body;
    const sheet = await MarkSheet.findOne({ _id: id, school_id: req.user.school_id });
    if (!sheet) return res.status(404).json({ message: 'Mark sheet not found' });
    if (sheet.results_locked && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'This mark sheet is locked from edits' });
    }

    if (Array.isArray(marks)) {
      sheet.marks = marks.map(m => {
        const obt = Number(m.obtained_marks) || 0;
        const max = sheet.max_marks || 100;
        const pct = Math.round((obt / max) * 100);
        return {
          student_id: m.student_id?._id || m.student_id,
          obtained_marks: obt,
          percentage: pct,
          grade: m.grade || (pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 33 ? 'D' : 'F'),
          status_color: m.status_color || (pct >= 33 ? '#16A34A' : '#DC2626'),
          is_absent: !!m.is_absent,
          teacher_remarks: m.teacher_remarks || '',
          principal_remarks: m.principal_remarks || ''
        };
      });
    }

    if (status) sheet.status = status;
    await sheet.save();

    res.json({ success: true, message: 'Marks saved successfully', markSheet: sheet });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save marks', error: error.message });
  }
};

const toggleLock = async (req, res) => {
  try {
    const sheet = await MarkSheet.findOne({ _id: req.params.id, school_id: req.user.school_id });
    if (!sheet) return res.status(404).json({ message: 'Mark sheet not found' });
    sheet.results_locked = !sheet.results_locked;
    sheet.status = sheet.results_locked ? 'Locked' : 'Submitted';
    await sheet.save();
    res.json({ success: true, locked: sheet.results_locked, message: `Marks sheet ${sheet.results_locked ? 'locked' : 'unlocked'}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle lock', error: error.message });
  }
};

module.exports = { saveMarks, toggleLock };
