import { useState } from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import usePersistentFormDraft from '../../../hooks/usePersistentFormDraft';
import PrerequisiteGuardBanner from '../../common/PrerequisiteGuardBanner';
import FeeStructureCustomHeads from './FeeStructureCustomHeads';

const defaultForm = {
  grade_id: '', academic_session: '2026-2027', tuition_fee: '', admission_fee: 0,
  exam_fee: 0, computer_lab_fee: 0, transport_fee: 0, late_fine_amount: 200,
  due_day_of_month: 10, sync_to_students: true, custom_heads: []
};

const FeeStructureForm = ({ grades = [], onSubmit, loading, editingItem, onCancelEdit }) => {
  const [draft, setDraft, clearDraft, , updateDraft] = usePersistentFormDraft('fee_structure_draft', defaultForm);
  const form = editingItem || draft;

  const handleFieldChange = (field, val) => {
    if (editingItem) onCancelEdit({ ...editingItem, [field]: val });
    else updateDraft({ [field]: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, () => clearDraft());
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-xs space-y-3 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-line">
        <h3 className="font-black text-ink dark:text-ink-dark uppercase tracking-wider text-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>{editingItem ? 'Edit Fee Structure' : 'Create Class Fee Structure'}</span>
        </h3>
        {editingItem && (
          <button type="button" onClick={() => onCancelEdit(null)} className="text-[10px] font-bold text-ink-muted hover:text-bad">Cancel Edit</button>
        )}
      </div>

      <PrerequisiteGuardBanner requiredItems={[{ label: 'Classes / Grades', count: grades.length, link: '/admin/grades' }]} />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="font-bold text-ink">Class / Grade *</label>
          <select required value={form.grade_id?._id || form.grade_id} onChange={(e) => handleFieldChange('grade_id', e.target.value)} className="w-full mt-1 px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none">
            <option value="">Select Grade</option>
            {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
        </div>
        <div>
          <label className="font-bold text-ink">Tuition Fee (PKR) *</label>
          <input type="number" required min="0" value={form.tuition_fee} onChange={(e) => handleFieldChange('tuition_fee', e.target.value)} className="w-full mt-1 px-3 py-1.5 rounded-xl border border-line bg-surface text-ink font-bold outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>
          <label className="text-[11px] font-semibold text-ink-muted">Admission Fee</label>
          <input type="number" min="0" value={form.admission_fee} onChange={(e) => handleFieldChange('admission_fee', e.target.value)} className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-ink-muted">Exam Fee</label>
          <input type="number" min="0" value={form.exam_fee} onChange={(e) => handleFieldChange('exam_fee', e.target.value)} className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-ink-muted">Computer Lab</label>
          <input type="number" min="0" value={form.computer_lab_fee} onChange={(e) => handleFieldChange('computer_lab_fee', e.target.value)} className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-ink-muted">Transport</label>
          <input type="number" min="0" value={form.transport_fee} onChange={(e) => handleFieldChange('transport_fee', e.target.value)} className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none" />
        </div>
      </div>

      <FeeStructureCustomHeads heads={form.custom_heads || []} onChange={(list) => handleFieldChange('custom_heads', list)} />

      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-line">
        <div>
          <label className="text-[11px] font-semibold text-ink-muted">Late Fine (PKR)</label>
          <input type="number" value={form.late_fine_amount} onChange={(e) => handleFieldChange('late_fine_amount', e.target.value)} className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-ink-muted">Due Day of Month</label>
          <input type="number" min="1" max="28" value={form.due_day_of_month} onChange={(e) => handleFieldChange('due_day_of_month', e.target.value)} className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-ink-muted">
          <input type="checkbox" checked={form.sync_to_students} onChange={(e) => handleFieldChange('sync_to_students', e.target.checked)} className="rounded" />
          <span>Sync monthly_fee to all active students in class</span>
        </label>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold flex items-center gap-1.5 shadow-xs">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          <span>{editingItem ? 'Update' : 'Save'}</span>
        </button>
      </div>
    </form>
  );
};

export default FeeStructureForm;
