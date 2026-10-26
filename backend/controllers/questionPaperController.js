const QuestionPaper = require('../models/QuestionPaper');
const QuestionBank = require('../models/QuestionBank');

const getPapers = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { grade_id, subject_id, status } = req.query;
    const query = { school_id };
    if (grade_id) query.grade_id = grade_id;
    if (subject_id) query.subject_id = subject_id;
    if (status) query.status = status;
    const papers = await QuestionPaper.find(query)
      .populate('grade_id', 'name')
      .populate('subject_id', 'name code')
      .populate('exam_category_id', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, papers });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch papers', error: error.message });
  }
};

const getPaperById = async (req, res) => {
  try {
    const paper = await QuestionPaper.findOne({ _id: req.params.id, school_id: req.user.school_id })
      .populate('grade_id', 'name')
      .populate('subject_id', 'name code')
      .populate('exam_category_id', 'name')
      .lean();
    if (!paper) return res.status(404).json({ message: 'Paper not found' });
    res.json({ success: true, paper });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch paper', error: error.message });
  }
};

const createPaper = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { title, grade_id, subject_id, total_marks } = req.body;
    if (!title || !grade_id || !subject_id) {
      return res.status(400).json({ message: 'Title, Grade, and Subject are required' });
    }
    const paper = await QuestionPaper.create({
      ...req.body, school_id, total_marks: Number(total_marks) || 100, created_by: req.user._id
    });
    res.status(201).json({ success: true, paper });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create paper', error: error.message });
  }
};

const updatePaper = async (req, res) => {
  try {
    const paper = await QuestionPaper.findOneAndUpdate(
      { _id: req.params.id, school_id: req.user.school_id },
      req.body,
      { new: true }
    ).lean();
    if (!paper) return res.status(404).json({ message: 'Paper not found' });
    res.json({ success: true, paper });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update paper', error: error.message });
  }
};

const deletePaper = async (req, res) => {
  try {
    await QuestionPaper.findOneAndDelete({ _id: req.params.id, school_id: req.user.school_id });
    res.json({ success: true, message: 'Question paper removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete paper', error: error.message });
  }
};

const autoGeneratePaper = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { title, grade_id, subject_id, chapter_ids, mcq_count, short_count, long_count, duration_minutes } = req.body;
    if (!grade_id || !subject_id) return res.status(400).json({ message: 'Grade and Subject are required' });
    const qFilter = { school_id, grade_id, subject_id };
    if (Array.isArray(chapter_ids) && chapter_ids.length > 0) qFilter.chapter_id = { $in: chapter_ids };

    const mcqs = await QuestionBank.find({ ...qFilter, question_type: 'MCQ' }).limit(Number(mcq_count) || 10).lean();
    const shorts = await QuestionBank.find({ ...qFilter, question_type: 'Short' }).limit(Number(short_count) || 5).lean();
    const longs = await QuestionBank.find({ ...qFilter, question_type: 'Long' }).limit(Number(long_count) || 2).lean();

    const mapQuestions = (list) => list.map(q => ({
      question_id: q._id, question_text: q.question_text, question_type: q.question_type,
      options: q.options, correct_answer: q.correct_answer, marks: q.marks, is_compulsory: true
    }));

    const secA = { title: 'Section A (Multiple Choice Questions)', instructions: 'Select the single best answer for each question.', questions: mapQuestions(mcqs) };
    const secB = { title: 'Section B (Short Answer Questions)', instructions: 'Attempt concise, complete answers for each query.', questions: mapQuestions(shorts) };
    const secC = { title: 'Section C (Long & Analytical Questions)', instructions: 'Answer in detail showing complete working/steps.', questions: mapQuestions(longs) };

    const totalMarks = [...secA.questions, ...secB.questions, ...secC.questions].reduce((acc, q) => acc + (q.marks || 1), 0) || 100;

    const paper = await QuestionPaper.create({
      school_id, title: title || 'Comprehensive Assessment Paper', grade_id, subject_id,
      duration_minutes: Number(duration_minutes) || 120, total_marks: totalMarks, passing_marks: Math.round(totalMarks * 0.33),
      sections: [secA, secB, secC], status: 'Published', created_by: req.user._id
    });

    res.status(201).json({ success: true, paper });
  } catch (error) {
    res.status(500).json({ message: 'Failed to auto-generate paper', error: error.message });
  }
};

module.exports = { getPapers, getPaperById, createPaper, updatePaper, deletePaper, autoGeneratePaper };
