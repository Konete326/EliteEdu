const QuestionBank = require('../models/QuestionBank');

const getQuestions = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { grade_id, subject_id, chapter_id, question_type, difficulty, search } = req.query;
    const query = { school_id };
    if (grade_id) query.grade_id = grade_id;
    if (subject_id) query.subject_id = subject_id;
    if (chapter_id) query.chapter_id = chapter_id;
    if (question_type) query.question_type = question_type;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.question_text = { $regex: search, $options: 'i' };

    const questions = await QuestionBank.find(query).populate('chapter_id', 'chapter_no title').sort({ createdAt: -1 }).lean();
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions', error: error.message });
  }
};

const createQuestion = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { grade_id, subject_id, chapter_id, question_type, difficulty, question_text, options, correct_answer, marks } = req.body;
    if (!grade_id || !subject_id || !question_text) {
      return res.status(400).json({ message: 'Grade, Subject, and Question Text are required' });
    }
    const question = await QuestionBank.create({
      school_id, grade_id, subject_id, chapter_id: chapter_id || null,
      question_type: question_type || 'MCQ', difficulty: difficulty || 'Medium',
      question_text, options: Array.isArray(options) ? options : [],
      correct_answer: correct_answer || '', marks: Number(marks) || 1, created_by: req.user._id
    });
    res.status(201).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create question', error: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await QuestionBank.findOneAndUpdate(
      { _id: id, school_id: req.user.school_id },
      req.body,
      { new: true }
    ).lean();
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update question', error: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await QuestionBank.findOneAndDelete({ _id: id, school_id: req.user.school_id });
    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete question', error: error.message });
  }
};

const seedSampleQuestions = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { grade_id, subject_id, chapter_id } = req.body;
    if (!grade_id || !subject_id) return res.status(400).json({ message: 'Grade and Subject are required' });
    const samples = [
      { question_type: 'MCQ', difficulty: 'Easy', question_text: 'Which of the following is the primary SI unit of measurement for length?', options: ['Kilogram', 'Meter', 'Second', 'Ampere'], correct_answer: 'Meter', marks: 1 },
      { question_type: 'MCQ', difficulty: 'Medium', question_text: 'Identify the state of matter characterized by definite volume but indefinite shape:', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], correct_answer: 'Liquid', marks: 1 },
      { question_type: 'Short', difficulty: 'Medium', question_text: 'Define Newton’s First Law of Motion with one practical example.', correct_answer: 'An object remains at rest unless acted upon by an external net force.', marks: 3 },
      { question_type: 'Short', difficulty: 'Easy', question_text: 'Differentiate between scalar and vector physical quantities.', correct_answer: 'Scalar has magnitude only; vector possesses both magnitude and direction.', marks: 3 },
      { question_type: 'Long', difficulty: 'Hard', question_text: 'State and prove the Law of Conservation of Energy with a detailed mathematical derivation.', correct_answer: 'Total mechanical energy remains constant in an isolated system.', marks: 8 }
    ];
    const created = await QuestionBank.insertMany(samples.map(s => ({
      ...s, school_id, grade_id, subject_id, chapter_id: chapter_id || null, created_by: req.user._id
    })));
    res.json({ success: true, questions: created });
  } catch (error) {
    res.status(500).json({ message: 'Failed to seed sample questions', error: error.message });
  }
};

module.exports = { getQuestions, createQuestion, updateQuestion, deleteQuestion, seedSampleQuestions };
