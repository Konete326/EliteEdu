import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

const QuestionModal = ({ isOpen, onClose, onSave, question, gradeId, subjectId, chapters }) => {
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('MCQ');
  const [difficulty, setDifficulty] = useState('Medium');
  const [chapterId, setChapterId] = useState('');
  const [marks, setMarks] = useState(1);
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (question) {
      setQuestionText(question.question_text || '');
      setQuestionType(question.question_type || 'MCQ');
      setDifficulty(question.difficulty || 'Medium');
      setChapterId(question.chapter_id?._id || question.chapter_id || '');
      setMarks(question.marks || 1);
      setOptions(question.options?.length ? question.options : ['', '', '', '']);
      setCorrectAnswer(question.correct_answer || '');
    } else {
      setQuestionText('');
      setQuestionType('MCQ');
      setDifficulty('Medium');
      setChapterId('');
      setMarks(1);
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
    }
  }, [question, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setSaving(true);
    await onSave({
      question_text: questionText.trim(), question_type: questionType,
      difficulty, chapter_id: chapterId || null, marks: Number(marks) || 1,
      options: questionType === 'MCQ' ? options.filter(o => o.trim()) : [],
      correct_answer: correctAnswer.trim(), grade_id: gradeId, subject_id: subjectId
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl max-h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-white">{question ? 'Edit Question' : 'Add Question'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Type</label>
              <select value={questionType} onChange={(e) => { setQuestionType(e.target.value); if (e.target.value !== 'MCQ') setMarks(e.target.value === 'Short' ? 3 : 8); else setMarks(1); }} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <option value="MCQ">MCQ</option>
                <option value="Short">Short Answer</option>
                <option value="Long">Long / Essay</option>
                <option value="Fill_Blank">Fill in the Blank</option>
                <option value="True_False">True / False</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Marks</label>
              <input type="number" min="1" value={marks} onChange={(e) => setMarks(e.target.value)} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Subject Chapter</label>
            <select value={chapterId} onChange={(e) => setChapterId(e.target.value)} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <option value="">General (No specific chapter)</option>
              {(chapters || []).map(ch => <option key={ch._id} value={ch._id}>Ch. {ch.chapter_no}: {ch.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Question Statement *</label>
            <textarea rows={3} value={questionText} onChange={(e) => setQuestionText(e.target.value)} required placeholder="Write the question prompt clearly..." className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
          </div>
          {questionType === 'MCQ' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">MCQ Options (4 Choices)</label>
              <div className="grid grid-cols-2 gap-2">
                {options.map((opt, i) => (
                  <input key={i} type="text" value={opt} onChange={(e) => { const cp = [...options]; cp[i] = e.target.value; setOptions(cp); }} placeholder={`Option ${String.fromCharCode(65 + i)}`} className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Correct Answer / Solution Key</label>
            <input type="text" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} placeholder="Correct answer or answer criteria" className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-primary text-white hover:bg-primary-hover shadow-xs">
              <Save size={14} /> {saving ? 'Saving...' : 'Save Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
