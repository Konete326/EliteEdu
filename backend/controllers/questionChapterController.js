const SubjectChapter = require('../models/SubjectChapter');

const getChapters = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { grade_id, subject_id, status } = req.query;
    const query = { school_id };
    if (grade_id) query.grade_id = grade_id;
    if (subject_id) query.subject_id = subject_id;
    if (status) query.status = status;
    const chapters = await SubjectChapter.find(query).sort({ chapter_no: 1 }).lean();
    res.json({ success: true, chapters });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chapters', error: error.message });
  }
};

const createChapter = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { grade_id, subject_id, chapter_no, title, description, status } = req.body;
    if (!grade_id || !subject_id || !title) {
      return res.status(400).json({ message: 'Grade, Subject, and Title are required' });
    }
    const chapter = await SubjectChapter.create({
      school_id, grade_id, subject_id, chapter_no: Number(chapter_no) || 1, title, description, status: status || 'Active'
    });
    res.status(201).json({ success: true, chapter });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create chapter', error: error.message });
  }
};

const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const chapter = await SubjectChapter.findOneAndUpdate(
      { _id: id, school_id: req.user.school_id },
      req.body,
      { new: true }
    ).lean();
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    res.json({ success: true, chapter });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update chapter', error: error.message });
  }
};

const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;
    await SubjectChapter.findOneAndDelete({ _id: id, school_id: req.user.school_id });
    res.json({ success: true, message: 'Chapter removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete chapter', error: error.message });
  }
};

const seedDefaultChapters = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { grade_id, subject_id } = req.body;
    if (!grade_id || !subject_id) return res.status(400).json({ message: 'Grade and Subject are required' });
    const existing = await SubjectChapter.find({ school_id, grade_id, subject_id }).lean();
    if (existing.length > 0) return res.json({ success: true, chapters: existing });
    const samples = [
      { chapter_no: 1, title: 'Introduction & Fundamentals', description: 'Core principles and definitions' },
      { chapter_no: 2, title: 'Theory & Key Concepts', description: 'Theoretical models and analysis' },
      { chapter_no: 3, title: 'Practical Applications', description: 'Real-world problem solving' },
      { chapter_no: 4, title: 'Advanced Topics & Evaluation', description: 'Synthesis and review' }
    ];
    const created = await SubjectChapter.insertMany(
      samples.map(s => ({ ...s, school_id, grade_id, subject_id, status: 'Active' }))
    );
    res.json({ success: true, chapters: created });
  } catch (error) {
    res.status(500).json({ message: 'Failed to seed chapters', error: error.message });
  }
};

module.exports = { getChapters, createChapter, updateChapter, deleteChapter, seedDefaultChapters };
