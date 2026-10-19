import { useState } from 'react';
import { Plus, Radio, ExternalLink, Trash2, Calendar, Clock, Video } from 'lucide-react';
import { usePersistentFormDraft } from '../../../hooks/usePersistentFormDraft';
import api from '../../../utils/axiosConfig';
import { useToast } from '../../../context/ToastContext';

const INITIAL = { title: '', grade_id: '', section: 'A', subject_id: '', scheduled_date: '', start_time: '10:00 AM', duration_minutes: 45, resource_url: '' };

const LmsLiveClassesTab = ({ grades = [], subjects = [], items = [], onReload, user }) => {
  const { showToast } = useToast();
  const [draft, setDraft, clearDraft] = usePersistentFormDraft(`lms_live_draft_${user?.school_id || 'v1'}`, INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!draft.title || !draft.grade_id || !draft.subject_id) {
      return showToast('Class title, Grade, and Subject are required', 'warning');
    }
    setSubmitting(true);
    try {
      await api.post('/lms', { ...draft, item_type: 'Live_Class' });
      showToast('Live virtual class scheduled', 'success');
      clearDraft();
      onReload();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to schedule class', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/lms/${id}`);
      showToast('Live class cancelled', 'success');
      onReload();
    } catch {
      showToast('Failed to delete live class', 'error');
    }
  };

  const handleLaunchRoom = (lc) => {
    const url = lc.resource_url || `https://meet.jit.si/${lc.meeting_room_code || 'EliteEdu-Live'}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const liveList = items.filter((it) => it.item_type === 'Live_Class');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <form onSubmit={handleSubmit} className="lg:col-span-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3 h-fit">
        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2"><Radio className="w-4 h-4 text-rose-500" /> Schedule Live Class</h4>
        <input type="text" placeholder="Session Title *" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
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
          <input type="date" value={draft.scheduled_date ? draft.scheduled_date.slice(0, 10) : ''} onChange={(e) => setDraft({ ...draft, scheduled_date: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
          <input type="text" placeholder="e.g. 10:00 AM" value={draft.start_time} onChange={(e) => setDraft({ ...draft, start_time: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
        </div>
        <input type="url" placeholder="Custom Zoom / Google Meet Link (Optional)" value={draft.resource_url} onChange={(e) => setDraft({ ...draft, resource_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
        <button type="submit" disabled={submitting} className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg text-sm flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Schedule Session
        </button>
      </form>

      <div className="lg:col-span-8 space-y-3">
        {liveList.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed">No upcoming live classes scheduled.</div>
        ) : (
          liveList.map((lc) => (
            <div key={lc._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-900/30 flex items-center gap-1"><Radio className="w-3 h-3 text-rose-500 animate-pulse" /> Live Class</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30">{lc.grade_id?.name} ({lc.section})</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-900/30">{lc.subject_id?.name}</span>
                </div>
                <h5 className="font-bold text-gray-900 dark:text-gray-100">{lc.title}</h5>
                <p className="text-xs text-gray-400 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(lc.scheduled_date || lc.due_date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {lc.start_time} ({lc.duration_minutes}m)</span>
                </p>
              </div>
              <div className="flex items-center gap-2 self-end md:self-center">
                <button onClick={() => handleLaunchRoom(lc)} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <Video className="w-4 h-4" /> Launch Live Room
                </button>
                <button onClick={() => handleDelete(lc._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LmsLiveClassesTab;
