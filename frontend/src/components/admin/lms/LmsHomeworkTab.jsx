import { useState } from 'react';
import { Plus, FileText, CheckCircle, Trash2, Calendar, Paperclip, Users } from 'lucide-react';
import { usePersistentFormDraft } from '../../../hooks/usePersistentFormDraft';
import api from '../../../utils/axiosConfig';
import { useToast } from '../../../context/ToastContext';
import HomeworkSubmissionsModal from './HomeworkSubmissionsModal';

const INITIAL = { title: '', description: '', grade_id: '', section: 'A', subject_id: '', due_date: '', max_marks: 10, resource_url: '' };

const LmsHomeworkTab = ({ grades = [], subjects = [], items = [], onReload, user }) => {
  const { showToast } = useToast();
  const [draft, setDraft, clearDraft] = usePersistentFormDraft(`lms_hw_draft_${user?.school_id || 'v1'}`, INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!draft.title || !draft.grade_id || !draft.subject_id) {
      return showToast('Title, Class, and Subject are required', 'warning');
    }
    setSubmitting(true);
    try {
      await api.post('/lms', { ...draft, item_type: 'Homework' });
      showToast('Homework assigned successfully', 'success');
      clearDraft();
      onReload();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create homework', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/lms/${id}`);
      showToast('Homework deleted', 'success');
      onReload();
    } catch {
      showToast('Error deleting item', 'error');
    }
  };

  const homeworkList = items.filter((it) => it.item_type === 'Homework');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <form onSubmit={handleSubmit} className="lg:col-span-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3 h-fit">
        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2"><FileText className="w-4 h-4 text-amber-500" /> Assign New Homework</h4>
        <input type="text" placeholder="Homework Title *" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
        <div className="grid grid-cols-2 gap-2">
          <select value={draft.grade_id} onChange={(e) => setDraft({ ...draft, grade_id: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required>
            <option value="">Select Class *</option>
            {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
          <input type="text" placeholder="Section (e.g. A)" value={draft.section} onChange={(e) => setDraft({ ...draft, section: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
        </div>
        <select value={draft.subject_id} onChange={(e) => setDraft({ ...draft, subject_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required>
          <option value="">Select Subject *</option>
          {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={draft.due_date ? draft.due_date.slice(0, 10) : ''} onChange={(e) => setDraft({ ...draft, due_date: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
          <input type="number" placeholder="Max Marks" value={draft.max_marks} onChange={(e) => setDraft({ ...draft, max_marks: Number(e.target.value) })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" min={1} />
        </div>
        <input type="url" placeholder="Attachment / Document Link (Optional)" value={draft.resource_url} onChange={(e) => setDraft({ ...draft, resource_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
        <textarea rows={2} placeholder="Instructions / Questions for students..." value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
        <button type="submit" disabled={submitting} className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-sm flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Publish Homework
        </button>
      </form>

      <div className="lg:col-span-8 space-y-3">
        {homeworkList.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed">No homework assignments found.</div>
        ) : (
          homeworkList.map((hw) => (
            <div key={hw._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30">{hw.grade_id?.name || 'Class'} ({hw.section})</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-900/30">{hw.subject_id?.name}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Due: {new Date(hw.due_date).toLocaleDateString()}</span>
                </div>
                <h5 className="font-bold text-gray-900 dark:text-gray-100">{hw.title}</h5>
                {hw.description && <p className="text-xs text-gray-500 line-clamp-1">{hw.description}</p>}
              </div>
              <div className="flex items-center gap-2 self-end md:self-center">
                <button onClick={() => setActiveItem(hw)} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 text-blue-600 dark:text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Submissions ({hw.submissions?.length || 0})
                </button>
                <button onClick={() => handleDelete(hw._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <HomeworkSubmissionsModal item={activeItem} isOpen={Boolean(activeItem)} onClose={() => setActiveItem(null)} onSaved={onReload} />
    </div>
  );
};

export default LmsHomeworkTab;
