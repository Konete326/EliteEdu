import { useState, useEffect } from 'react';
import { Send, RotateCcw, Plus, Edit2 } from 'lucide-react';
import { usePersistentFormDraft } from '../../../hooks/usePersistentFormDraft';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import PlannerLessonFields from './PlannerLessonFields';
import PlannerEventFields from './PlannerEventFields';

const INITIAL = {
  record_type: 'Lesson_Plan', title: '', start_date: '', end_date: '', grade_id: '',
  section: 'A', subject_id: '', teacher_id: '', learning_objectives: '', teaching_aids: '',
  target_audience: 'All', description: '', status: 'Planned'
};

const PlannerForm = ({ activeTab, editingRecord, onCancelEdit, onSaved, grades = [], subjects = [], teachers = [] }) => {
  const { showToast } = useToast();
  const draftKey = `draft_planner_${activeTab}`;
  const [draft, setDraft, clearDraft] = usePersistentFormDraft(draftKey, INITIAL);
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingRecord) setForm({ ...INITIAL, ...editingRecord, start_date: editingRecord.start_date?.slice(0, 10) || '', end_date: editingRecord.end_date?.slice(0, 10) || '' });
    else setForm({ ...draft, record_type: activeTab === 'Lesson_Plan' ? 'Lesson_Plan' : (draft.record_type === 'Lesson_Plan' ? 'School_Event' : draft.record_type) });
  }, [editingRecord, activeTab]);

  const handleChange = (f, v) => {
    const next = { ...form, [f]: v };
    setForm(next);
    if (!editingRecord) setDraft(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.start_date) return showToast('Title and start date required', 'error');
    setSaving(true);
    try {
      const payload = { ...form, record_type: activeTab === 'Lesson_Plan' ? 'Lesson_Plan' : form.record_type };
      if (editingRecord?._id) await api.put(`/planners/${editingRecord._id}`, payload);
      else await api.post('/planners', payload);
      showToast(editingRecord ? 'Record updated' : 'Plan / Event published', 'success');
      clearDraft();
      setForm(INITIAL);
      if (onCancelEdit) onCancelEdit();
      onSaved();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save', 'error');
    } finally { setSaving(false); }
  };

  const isLesson = activeTab === 'Lesson_Plan';

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm space-y-3.5">
      <div className="flex items-center justify-between border-b border-line pb-2.5">
        <h3 className="text-xs font-black uppercase text-ink flex items-center gap-2">
          {editingRecord ? <Edit2 className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-primary" />}
          {editingRecord ? 'Edit Entry' : isLesson ? 'Create Lesson Plan' : 'Schedule Event / PTM'}
        </h3>
        {editingRecord && <button onClick={onCancelEdit} className="text-[10px] text-rose-500 font-bold hover:underline">Cancel</button>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
        <div>
          <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Title / Topic Name *</label>
          <input type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required placeholder={isLesson ? 'e.g. Chapter 4: Algebraic Fractions' : 'e.g. Mid-Term PTM / Sports Gala'} className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Start Date *</label>
            <input type="date" value={form.start_date} onChange={(e) => handleChange('start_date', e.target.value)} required className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-ink-muted mb-0.5">End Date</label>
            <input type="date" value={form.end_date} onChange={(e) => handleChange('end_date', e.target.value)} className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none" />
          </div>
        </div>

        {isLesson ? (
          <PlannerLessonFields form={form} onChange={handleChange} grades={grades} subjects={subjects} teachers={teachers} />
        ) : (
          <PlannerEventFields form={form} onChange={handleChange} grades={grades} />
        )}

        <div className="flex items-center gap-2 pt-1">
          <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-md shadow-primary/20 disabled:opacity-50">
            <Send className="w-3.5 h-3.5" />
            <span>{saving ? 'Publishing...' : editingRecord ? 'Save Changes' : 'Publish & Broadcast'}</span>
          </button>
          <button type="button" onClick={() => { clearDraft(); setForm(INITIAL); }} className="p-2 rounded-xl border border-line hover:bg-surface-secondary text-ink-muted" title="Clear Draft">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlannerForm;
