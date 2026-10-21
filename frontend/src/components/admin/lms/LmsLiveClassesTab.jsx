import { useState } from 'react';
import { Plus, Radio, Trash2, Calendar, Clock, Video, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { usePersistentFormDraft } from '../../../hooks/usePersistentFormDraft';
import api from '../../../utils/axiosConfig';
import { useToast } from '../../../context/ToastContext';

const INITIAL = { title: '', grade_id: '', section: 'A', subject_id: '', scheduled_date: '', start_time: '10:00 AM', duration_minutes: 45, resource_url: '' };

const LmsLiveClassesTab = ({ grades = [], subjects = [], items = [], onReload, user, campusId = '' }) => {
  const { showToast } = useToast();
  const [draft, setDraft, clearDraft] = usePersistentFormDraft(`lms_live_draft_${user?.school_id || 'v1'}`, INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!draft.title || !draft.grade_id || !draft.subject_id) {
      return showToast('Class title, Grade, and Subject are required', 'warning');
    }
    setSubmitting(true);
    try {
      await api.post('/lms', {
        ...draft,
        item_type: 'Live_Class',
        campus_id: campusId || null
      });
      showToast('Live virtual class scheduled', 'success');
      clearDraft();
      setShowAddForm(false);
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

  const liveList = items
    .filter((it) => it.item_type === 'Live_Class')
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
            placeholder="Search live classes by title, subject, or class..."
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
          <span>Schedule Live Class</span>
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
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Schedule Live Virtual Class</span>
            </h4>
            <span className="text-[10px] text-ink-muted font-mono">Video Conferencing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Session Title *"
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
              <input
                type="text"
                placeholder="Section (e.g. A)"
                value={draft.section}
                onChange={(e) => setDraft({ ...draft, section: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
              />
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
                type="date"
                value={draft.scheduled_date ? draft.scheduled_date.slice(0, 10) : ''}
                onChange={(e) => setDraft({ ...draft, scheduled_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="e.g. 10:00 AM"
                value={draft.start_time}
                onChange={(e) => setDraft({ ...draft, start_time: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Duration (min)"
                value={draft.duration_minutes}
                onChange={(e) => setDraft({ ...draft, duration_minutes: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
                min={10}
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="url"
                placeholder="Custom Zoom / Google Meet Link (Optional, otherwise automatic built-in room is used)"
                value={draft.resource_url}
                onChange={(e) => setDraft({ ...draft, resource_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
              />
            </div>
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
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Schedule Session</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {liveList.length === 0 ? (
          <div className="p-8 text-center text-xs text-ink-muted bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark space-y-2">
            <Radio className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="font-bold text-ink dark:text-white">No upcoming live classes scheduled</p>
            <p className="text-[11px]">Click &quot;Schedule Live Class&quot; to launch live video sessions.</p>
          </div>
        ) : (
          liveList.map((lc) => (
            <div
              key={lc._id}
              className="p-3.5 sm:p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-rose-500 animate-pulse" /> Live Class
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                    {lc.grade_id?.name || 'Class'} ({lc.section || 'A'})
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {lc.subject_id?.name || 'Subject'}
                  </span>
                </div>

                <h5 className="font-bold text-xs sm:text-sm text-ink dark:text-white truncate">
                  {lc.title}
                </h5>

                <div className="flex items-center gap-3 text-[11px] text-ink-muted font-mono flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {new Date(lc.scheduled_date || lc.due_date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {lc.start_time} ({lc.duration_minutes}m)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleLaunchRoom(lc)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Launch Live Room</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(lc._id)}
                  className="p-2 rounded-xl text-ink-muted hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Cancel Class"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LmsLiveClassesTab;
