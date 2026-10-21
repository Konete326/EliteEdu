import { useState } from 'react';
import { Plus, FileText, Trash2, Calendar, Paperclip, Users, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { usePersistentFormDraft } from '../../../hooks/usePersistentFormDraft';
import api from '../../../utils/axiosConfig';
import { useToast } from '../../../context/ToastContext';
import HomeworkSubmissionsModal from './HomeworkSubmissionsModal';

const INITIAL = { title: '', description: '', grade_id: '', section: 'A', subject_id: '', due_date: '', max_marks: 10, resource_url: '' };

const LmsHomeworkTab = ({ grades = [], subjects = [], items = [], onReload, user, campusId = '' }) => {
  const { showToast } = useToast();
  const [draft, setDraft, clearDraft] = usePersistentFormDraft(`lms_hw_draft_${user?.school_id || 'v1'}`, INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
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
        item_type: 'Homework',
        campus_id: campusId || null
      });
      showToast('Homework assigned successfully', 'success');
      clearDraft();
      setShowAddForm(false);
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

  const homeworkList = items
    .filter((it) => it.item_type === 'Homework')
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
            placeholder="Search homework by title, subject, or class..."
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
          <span>Assign Homework</span>
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
              <FileText className="w-4 h-4 text-primary" />
              <span>Publish New Homework Assignment</span>
            </h4>
            <span className="text-[10px] text-ink-muted font-mono">Realtime Sync to Students</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Homework Title *"
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
                value={draft.due_date ? draft.due_date.slice(0, 10) : ''}
                onChange={(e) => setDraft({ ...draft, due_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
                required
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
            <div>
              <input
                type="url"
                placeholder="Attachment URL (Optional)"
                value={draft.resource_url}
                onChange={(e) => setDraft({ ...draft, resource_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
              />
            </div>
          </div>

          <textarea
            rows={2}
            placeholder="Instructions / Homework description..."
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-white outline-none focus:border-primary"
          />

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
              <span>Publish Homework</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {homeworkList.length === 0 ? (
          <div className="p-8 text-center text-xs text-ink-muted bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark space-y-2">
            <FileText className="w-8 h-8 text-ink-muted mx-auto" />
            <p className="font-bold text-ink dark:text-white">No homework assignments found</p>
            <p className="text-[11px]">Click &quot;Assign Homework&quot; to publish new tasks for students.</p>
          </div>
        ) : (
          homeworkList.map((hw) => (
            <div
              key={hw._id}
              className="p-3.5 sm:p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                    {hw.grade_id?.name || 'Class'} ({hw.section || 'A'})
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {hw.subject_id?.name || 'Subject'}
                  </span>
                  <span className="text-[11px] text-ink-muted flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-primary" />
                    Due: {new Date(hw.due_date).toLocaleDateString()}
                  </span>
                  {hw.max_marks > 0 && (
                    <span className="text-[10px] text-ink-muted font-mono font-bold">
                      {hw.max_marks} Marks
                    </span>
                  )}
                </div>

                <h5 className="font-bold text-xs sm:text-sm text-ink dark:text-white truncate">
                  {hw.title}
                </h5>
                {hw.description && (
                  <p className="text-[11px] text-ink-muted line-clamp-1">
                    {hw.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {hw.resource_url && (
                  <a
                    href={hw.resource_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted hover:text-primary border border-line dark:border-line-dark transition-colors"
                    title="View Attachment"
                  >
                    <Paperclip size={14} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setActiveItem(hw)}
                  className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                >
                  <Users size={13} />
                  <span>Submissions ({hw.submissions?.length || 0})</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(hw._id)}
                  className="p-2 rounded-xl text-ink-muted hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Homework"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
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

export default LmsHomeworkTab;
