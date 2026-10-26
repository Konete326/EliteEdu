import { useState } from 'react';
import { CheckCircle2, Upload, Calendar, X, Send } from 'lucide-react';
import api from '../../utils/axiosConfig';
import { useToast } from '../../context/ToastContext';

const StudentHomeworkTab = ({ lmsItems = [], studentId, onReload }) => {
  const { showToast } = useToast();
  const [activeItem, setActiveItem] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const homeworkAndQuizzes = lmsItems.filter((it) => it.item_type === 'Homework' || it.item_type === 'Quiz');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionText.trim()) return showToast('Please write your response or paste work link', 'warning');
    setSubmitting(true);
    try {
      await api.post(`/student-portal/submit-homework/${activeItem._id}`, {
        student_id: studentId,
        remarks: submissionText.trim()
      });
      showToast('Assignment submitted successfully', 'success');
      setActiveItem(null);
      setSubmissionText('');
      onReload();
    } catch {
      showToast('Error uploading submission', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3.5">
      {homeworkAndQuizzes.length === 0 ? (
        <div className="p-8 text-center text-xs text-ink-muted dark:text-ink-muted-dark bg-surface dark:bg-surface-dark rounded-2xl border border-dashed border-line dark:border-line-dark">
          No homework or quizzes assigned yet.
        </div>
      ) : (
        homeworkAndQuizzes.map((item) => {
          const sub = (item.submissions || []).find((s) => String(s.student_id) === String(studentId));
          const isSubmitted = sub && sub.status !== 'Pending';

          return (
            <div key={item._id} className="bg-surface dark:bg-surface-dark p-4 rounded-2xl border border-line dark:border-line-dark shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-primary-soft text-primary dark:text-primary-dark border border-primary/20">
                    {item.subject_id?.name || 'Subject'}
                  </span>
                  <span className="text-xs text-ink-muted dark:text-ink-muted-dark flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Due: {new Date(item.due_date).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-ink-muted dark:text-ink-muted-dark font-medium">
                    Max Marks: {item.max_marks || 10}
                  </span>
                </div>
                <h4 className="font-bold text-ink dark:text-ink-dark text-sm">{item.title}</h4>
                {item.description && <p className="text-xs text-ink-muted dark:text-ink-muted-dark line-clamp-2">{item.description}</p>}
                {sub?.remarks && <p className="text-[11px] text-good dark:text-good-dark font-medium">Your note: {sub.remarks}</p>}
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                {isSubmitted ? (
                  <span className="px-3 py-1.5 bg-good-soft/70 text-good dark:text-good-dark rounded-xl text-xs font-bold flex items-center gap-1.5 border border-good/20">
                    <CheckCircle2 className="w-4 h-4" /> {sub.status} {sub.obtained_marks !== undefined ? `(${sub.obtained_marks} pts)` : ''}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setActiveItem(item); setSubmissionText(''); }}
                    className="px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" /> Submit Work
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}

      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form onSubmit={handleSubmit} className="bg-surface dark:bg-surface-dark rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl border border-line dark:border-line-dark">
            <div className="flex items-center justify-between border-b border-line dark:border-line-dark pb-3">
              <div>
                <h4 className="font-bold text-ink dark:text-ink-dark text-sm">{activeItem.title}</h4>
                <p className="text-xs text-ink-muted dark:text-ink-muted-dark">{activeItem.subject_id?.name} • Due: {new Date(activeItem.due_date).toLocaleDateString()}</p>
              </div>
              <button type="button" onClick={() => setActiveItem(null)} className="p-1 text-ink-muted hover:text-ink rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <textarea
              rows={5}
              placeholder="Type your response, answer steps, or paste your document link here..."
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              className="w-full p-3 border border-line dark:border-line-dark rounded-xl text-xs bg-surface-secondary dark:bg-surface-secondary-dark text-ink dark:text-ink-dark outline-none focus:ring-1 focus:ring-primary"
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setActiveItem(null)} className="px-4 py-2 text-xs font-semibold text-ink-muted hover:text-ink rounded-xl border border-line dark:border-line-dark">Cancel</button>
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                <Send className="w-3.5 h-3.5" /> Submit Assignment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentHomeworkTab;
