import { useState, useEffect } from 'react';
import { Plus, Award, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { usePersistentFormDraft } from '../../../hooks/usePersistentFormDraft';
import api from '../../../utils/axiosConfig';
import { useToast } from '../../../context/ToastContext';
import HomeworkSubmissionsModal from './HomeworkSubmissionsModal';
import QuizQuestionsSelector from './QuizQuestionsSelector';
import QuizItemCard from './QuizItemCard';

const INITIAL = { title: '', grade_id: '', section: 'A', subject_id: '', due_date: '', duration_minutes: 30, max_marks: 20 };

const LmsQuizzesTab = ({ grades = [], subjects = [], items = [], onReload, user, campusId = '' }) => {
  const { showToast } = useToast();
  const [draft, setDraft, clearDraft] = usePersistentFormDraft(`lms_quiz_draft_${user?.school_id || 'v1'}`, INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!draft.subject_id) return;
    api.get(`/question-papers/questions?subject_id=${draft.subject_id}`)
      .then((res) => setAvailableQuestions(res.data?.questions || []))
      .catch(() => {});
  }, [draft.subject_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!draft.title || !draft.grade_id || !draft.subject_id) {
      return showToast('Quiz Title, Class, and Subject are required', 'warning');
    }
    setSubmitting(true);
    try {
      const quiz_questions = selectedQuestions.map((q) => ({
        question_id: q._id,
        question_text: q.question_text,
        options: q.options || [],
        correct_answer: q.correct_answer || '',
        marks: q.marks || 1
      }));
      await api.post('/lms', {
        ...draft,
        item_type: 'Quiz',
        quiz_questions,
        campus_id: campusId || null
      });
      showToast('Online Quiz published successfully', 'success');
      clearDraft();
      setSelectedQuestions([]);
      setShowAddForm(false);
      onReload();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create quiz', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleQuestion = (q, isChecked) => {
    setSelectedQuestions(isChecked ? [...selectedQuestions, q] : selectedQuestions.filter((sq) => sq._id !== q._id));
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/lms/${id}`);
      showToast('Quiz deleted', 'success');
      onReload();
    } catch {
      showToast('Failed to delete quiz', 'error');
    }
  };

  const quizzes = items
    .filter((it) => it.item_type === 'Quiz')
    .filter((it) =>
      it.title.toLowerCase().includes(search.toLowerCase()) ||
      (it.subject_id?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (it.grade_id?.name || '').toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-4">
      <div className="p-3.5 sm:p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search quizzes by title, subject, or class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-xs text-ink dark:text-white outline-none focus:border-primary"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus size={14} />
          <span>Create Online Quiz</span>
          {showAddForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-5 rounded-2xl border border-primary/20 bg-primary/5 dark:bg-primary/10 shadow-xs space-y-3 transition-all"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs sm:text-sm text-ink dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span>Publish Online Interactive Quiz</span>
            </h4>
            <span className="text-[10px] text-ink-muted font-mono">Automated Evaluation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Quiz Title *"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <select
                value={draft.grade_id}
                onChange={(e) => setDraft({ ...draft, grade_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
                required
              >
                <option value="">Select Class *</option>
                {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <select
                value={draft.subject_id}
                onChange={(e) => setDraft({ ...draft, subject_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
                required
              >
                <option value="">Select Subject *</option>
                {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <input
                type="number"
                placeholder="Duration (min)"
                value={draft.duration_minutes}
                onChange={(e) => setDraft({ ...draft, duration_minutes: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
                min={5}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max Marks"
                value={draft.max_marks}
                onChange={(e) => setDraft({ ...draft, max_marks: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
                min={1}
              />
            </div>
            <div className="sm:col-span-2">
              <input
                type="date"
                value={draft.due_date ? draft.due_date.slice(0, 10) : ''}
                onChange={(e) => setDraft({ ...draft, due_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <QuizQuestionsSelector
              questions={availableQuestions}
              selected={selectedQuestions}
              onToggle={handleToggleQuestion}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-line text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Publish Quiz</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {quizzes.length === 0 ? (
          <div className="p-8 text-center text-xs text-ink-muted bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark space-y-2">
            <Award className="w-8 h-8 text-ink-muted mx-auto" />
            <p className="font-bold text-ink dark:text-white">No quizzes created yet</p>
            <p className="text-[11px]">Click &quot;Create Online Quiz&quot; to build an assessment.</p>
          </div>
        ) : (
          quizzes.map((qz) => (
            <QuizItemCard
              key={qz._id}
              quiz={qz}
              onResults={setActiveItem}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <HomeworkSubmissionsModal
        item={activeItem}
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        onSaved={onReload}
      />
    </div>
  );
};

export default LmsQuizzesTab;
