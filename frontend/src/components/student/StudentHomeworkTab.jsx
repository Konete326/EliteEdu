import { useState } from 'react';
import { FileText, CheckCircle2, Upload, Calendar, X, Send } from 'lucide-react';
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
    <div className="space-y-4">
      {homeworkAndQuizzes.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed">
          No homework or quizzes assigned yet.
        </div>
      ) : (
        homeworkAndQuizzes.map((item) => {
          const sub = (item.submissions || []).find((s) => String(s.student_id) === String(studentId));
          const isSubmitted = sub && sub.status !== 'Pending';

          return (
            <div key={item._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30">{item.subject_id?.name}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Due: {new Date(item.due_date).toLocaleDateString()}</span>
                  <span className="text-xs text-gray-400 font-medium">Max Marks: {item.max_marks || 10}</span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{item.title}</h4>
                {item.description && <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>}
                {sub?.remarks && <p className="text-[11px] text-emerald-600 font-medium">Your note: {sub.remarks}</p>}
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                {isSubmitted ? (
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> {sub.status} {sub.obtained_marks !== undefined ? `(${sub.obtained_marks} pts)` : ''}
                  </span>
                ) : (
                  <button
                    onClick={() => { setActiveItem(item); setSubmissionText(''); }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{activeItem.title}</h4>
                <p className="text-xs text-gray-500">{activeItem.subject_id?.name} • Due: {new Date(activeItem.due_date).toLocaleDateString()}</p>
              </div>
              <button type="button" onClick={() => setActiveItem(null)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <textarea
              rows={5}
              placeholder="Type your answer, solution steps, or paste your Google Docs / Drive work link here..."
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              className="w-full p-3 border rounded-xl text-xs bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setActiveItem(null)} className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
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
