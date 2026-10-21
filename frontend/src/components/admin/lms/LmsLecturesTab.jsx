import { useState } from 'react';
import { Plus, Video, ExternalLink, Trash2, FileText, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { usePersistentFormDraft } from '../../../hooks/usePersistentFormDraft';
import api from '../../../utils/axiosConfig';
import { useToast } from '../../../context/ToastContext';

const INITIAL = { title: '', grade_id: '', section: 'A', subject_id: '', resource_url: '', key_notes: '', description: '' };

const LmsLecturesTab = ({ grades = [], subjects = [], items = [], onReload, user, campusId = '' }) => {
  const { showToast } = useToast();
  const [draft, setDraft, clearDraft] = usePersistentFormDraft(`lms_lec_draft_${user?.school_id || 'v1'}`, INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!draft.title || !draft.grade_id || !draft.subject_id) {
      return showToast('Title, Class, and Subject are required', 'warning');
    }
    setSubmitting(true);
    try {
      await api.post('/lms', {
        ...draft,
        item_type: 'Lecture_Material',
        campus_id: campusId || null
      });
      showToast('Lecture material published', 'success');
      clearDraft();
      setShowAddForm(false);
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

  const lectures = items
    .filter((it) => it.item_type === 'Lecture_Material')
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
            placeholder="Search lectures &amp; materials..."
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
          <span>Add Lecture / Material</span>
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
              <Video className="w-4 h-4 text-primary" />
              <span>Publish Study Material / Recorded Lecture</span>
            </h4>
            <span className="text-[10px] text-ink-muted font-mono">Digital Library</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Lecture / Resource Title *"
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
            <div className="sm:col-span-3">
              <input
                type="url"
                placeholder="Video / PDF / Drive Resource Link (YouTube, Drive, etc.)"
                value={draft.resource_url}
                onChange={(e) => setDraft({ ...draft, resource_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <textarea
              rows={2}
              placeholder="Lecture Overview / Brief description..."
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
            />
            <textarea
              rows={2}
              placeholder="Key Study Notes / Timestamps / Reference Points..."
              value={draft.key_notes}
              onChange={(e) => setDraft({ ...draft, key_notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
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
              <span>Save Material</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {lectures.length === 0 ? (
          <div className="p-8 text-center text-xs text-ink-muted bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark space-y-2">
            <Video className="w-8 h-8 text-ink-muted mx-auto" />
            <p className="font-bold text-ink dark:text-white">No lecture materials found</p>
            <p className="text-[11px]">Click &quot;Add Lecture / Material&quot; to upload digital resources.</p>
          </div>
        ) : (
          lectures.map((lec) => (
            <div
              key={lec._id}
              className="p-3.5 sm:p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                    {lec.grade_id?.name || 'Class'} ({lec.section || 'A'})
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {lec.subject_id?.name || 'Subject'}
                  </span>
                </div>

                <h5 className="font-bold text-xs sm:text-sm text-ink dark:text-white truncate">
                  {lec.title}
                </h5>

                {lec.description && (
                  <p className="text-[11px] text-ink-muted line-clamp-1">
                    {lec.description}
                  </p>
                )}

                {lec.key_notes && (
                  <div className="p-2 rounded-xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-[10px] text-ink-muted flex items-center gap-1.5">
                    <FileText size={12} className="text-primary shrink-0" />
                    <span className="truncate">{lec.key_notes}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {lec.resource_url && (
                  <a
                    href={lec.resource_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs"
                  >
                    <ExternalLink size={12} />
                    <span>Open Resource</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(lec._id)}
                  className="p-2 rounded-xl text-ink-muted hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Material"
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

export default LmsLecturesTab;
