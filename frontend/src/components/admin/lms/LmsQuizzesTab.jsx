import { useState, useEffect } from 'react';
import { Plus, Award } from 'lucide-react';
import { usePersistentFormDraft } from '../../../hooks/usePersistentFormDraft';
import api from '../../../utils/axiosConfig';
import { useToast } from '../../../context/ToastContext';
import HomeworkSubmissionsModal from './HomeworkSubmissionsModal';
import QuizQuestionsSelector from './QuizQuestionsSelector';
import QuizItemCard from './QuizItemCard';

const INITIAL = { title: '', grade_id: '', section: 'A', subject_id: '', due_date: '', duration_minutes: 30, max_marks: 20 };

const LmsQuizzesTab = ({ grades = [], subjects = [], items = [], onReload, user }) => {
  const { showToast } = useToast();
  const [draft, setDraft, clearDraft] = usePersistentFormDraft(`lms_quiz_draft_${user?.school_id || 'v1'}`, INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

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
      await api.post('/lms', { ...draft, item_type: 'Quiz', quiz_questions });
      showToast('Online Quiz published successfully', 'success');
      clearDraft();
      setSelectedQuestions([]);
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

  const quizzes = items.filter((it) => it.item_type === 'Quiz');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <form onSubmit={handleSubmit} className="lg:col-span-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3 h-fit">
        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2"><Award className="w-4 h-4 text-purple-500" /> Create Online Quiz</h4>
        <input type="text" placeholder="Quiz Title *" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
        <div className="grid grid-cols-2 gap-2">
          <select value={draft.grade_id} onChange={(e) => setDraft({ ...draft, grade_id: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required>
            <option value="">Select Class *</option>
            {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
          <select value={draft.subject_id} onChange={(e) => setDraft({ ...draft, subject_id: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required>
            <option value="">Select Subject *</option>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder="Duration (min)" value={draft.duration_minutes} onChange={(e) => setDraft({ ...draft, duration_minutes: Number(e.target.value) })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" min={5} />
          <input type="number" placeholder="Max Marks" value={draft.max_marks} onChange={(e) => setDraft({ ...draft, max_marks: Number(e.target.value) })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" min={1} />
        </div>
        <input type="date" value={draft.due_date ? draft.due_date.slice(0, 10) : ''} onChange={(e) => setDraft({ ...draft, due_date: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
        <QuizQuestionsSelector questions={availableQuestions} selected={selectedQuestions} onToggle={handleToggleQuestion} />
        <button type="submit" disabled={submitting} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Publish Quiz
        </button>
      </form>

      <div className="lg:col-span-8 space-y-3">
        {quizzes.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed">No quizzes created yet.</div>
        ) : (
          quizzes.map((qz) => <QuizItemCard key={qz._id} quiz={qz} onResults={setActiveItem} onDelete={handleDelete} />)
        )}
      </div>

      <HomeworkSubmissionsModal item={activeItem} isOpen={Boolean(activeItem)} onClose={() => setActiveItem(null)} onSaved={onReload} />
    </div>
  );
};

export default LmsQuizzesTab;
