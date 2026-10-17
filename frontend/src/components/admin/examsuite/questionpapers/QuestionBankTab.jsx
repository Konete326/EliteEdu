import React, { useState } from 'react';
import { Plus, Sparkles, HelpCircle, Edit2, Trash2 } from 'lucide-react';
import QuestionModal from './QuestionModal';

const QuestionBankTab = ({ questions, grades, subjects, chapters, selectedGrade, selectedSubject, selectedChapter, onGradeChange, onSubjectChange, onChapterChange, onSaveQuestion, onDeleteQuestion, onSeedQuestions }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = questions.filter(q => !typeFilter || q.question_type === typeFilter);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <select value={selectedGrade} onChange={(e) => onGradeChange(e.target.value)} className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <option value="">All Classes</option>
            {grades.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
          <select value={selectedSubject} onChange={(e) => onSubjectChange(e.target.value)} className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <option value="">All Types</option>
            <option value="MCQ">MCQ</option>
            <option value="Short">Short</option>
            <option value="Long">Long</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          {selectedGrade && selectedSubject && (
            <button onClick={onSeedQuestions} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300 hover:bg-indigo-50">
              <Sparkles size={14} /> Seed Sample Questions
            </button>
          )}
          <button onClick={() => { setSelectedQuestion(null); setModalOpen(true); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs">
            <Plus size={15} /> Add Question
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-16 text-center border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <HelpCircle size={24} />
          </div>
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No questions found</h4>
          <p className="text-xs text-slate-400">Add or seed questions to power automated paper generation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map(q => (
            <div key={q._id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">{q.question_type}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">{q.difficulty}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mr-1">{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}</span>
                  <button onClick={() => { setSelectedQuestion(q); setModalOpen(true); }} className="p-1 hover:text-primary"><Edit2 size={13} /></button>
                  <button onClick={() => onDeleteQuestion(q._id)} className="p-1 hover:text-red-600"><Trash2 size={13} /></button>
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-white line-clamp-2">{q.question_text}</p>
              {q.question_type === 'MCQ' && q.options?.length > 0 && (
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 pt-1">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`px-2 py-1 rounded-md border ${opt === q.correct_answer ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 font-bold' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'}`}>
                      {String.fromCharCode(65 + i)}. {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <QuestionModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setSelectedQuestion(null); }} onSave={onSaveQuestion} question={selectedQuestion} gradeId={selectedGrade} subjectId={selectedSubject} chapters={chapters} />
    </div>
  );
};

export default QuestionBankTab;
