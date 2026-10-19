import { useState } from 'react';
import { Plus, Video, ExternalLink, Trash2, FileText, Sparkles } from 'lucide-react';
import { usePersistentFormDraft } from '../../../hooks/usePersistentFormDraft';
import api from '../../../utils/axiosConfig';
import { useToast } from '../../../context/ToastContext';

const INITIAL = { title: '', grade_id: '', section: 'A', subject_id: '', resource_url: '', key_notes: '', description: '' };

const LmsLecturesTab = ({ grades = [], subjects = [], items = [], onReload, user }) => {
  const { showToast } = useToast();
  const [draft, setDraft, clearDraft] = usePersistentFormDraft(`lms_lec_draft_${user?.school_id || 'v1'}`, INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!draft.title || !draft.grade_id || !draft.subject_id) {
      return showToast('Title, Class, and Subject are required', 'warning');
    }
    setSubmitting(true);
    try {
      await api.post('/lms', { ...draft, item_type: 'Lecture_Material' });
      showToast('Lecture material published', 'success');
      clearDraft();
      onReload();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save material', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/lms/${id}`);
      showToast('Material removed', 'success');
      onReload();
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const lectures = items.filter((it) => it.item_type === 'Lecture_Material');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <form onSubmit={handleSubmit} className="lg:col-span-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3 h-fit">
        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2"><Video className="w-4 h-4 text-emerald-500" /> Add Lecture / Material</h4>
        <input type="text" placeholder="Lecture Title *" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
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
        <input type="url" placeholder="Video URL or Document/PDF Link *" value={draft.resource_url} onChange={(e) => setDraft({ ...draft, resource_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
        <textarea rows={2} placeholder="Summary Notes / Key Points..." value={draft.key_notes} onChange={(e) => setDraft({ ...draft, key_notes: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
        <button type="submit" disabled={submitting} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Save Material
        </button>
      </form>

      <div className="lg:col-span-8 space-y-3">
        {lectures.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed">No lecture materials or study notes added yet.</div>
        ) : (
          lectures.map((lec) => (
            <div key={lec._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30">{lec.grade_id?.name || 'Class'} ({lec.section})</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30">{lec.subject_id?.name}</span>
                </div>
                <h5 className="font-bold text-gray-900 dark:text-gray-100">{lec.title}</h5>
                {lec.key_notes && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-amber-500" /> {lec.key_notes}</p>
                )}
              </div>
              <div className="flex items-center gap-2 self-end md:self-center">
                {lec.resource_url && (
                  <a href={lec.resource_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> View Resource
                  </a>
                )}
                <button onClick={() => handleDelete(lec._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LmsLecturesTab;
