import { useState, useEffect } from 'react';
import { X, Check, Edit3, AlertCircle } from 'lucide-react';
import api from '../../../../services/api';

const AdmissionQuickEditModal = ({ isOpen, student, onClose, onSuccess }) => {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setForm({
        blood_group: student.blood_group || '',
        identification_mark: student.identification_mark || 'Nil',
        disease_if_any: student.disease_if_any || 'None',
        caste: student.caste || '',
        is_orphan: student.is_orphan || 'No',
        is_osc: student.is_osc || 'No',
        total_siblings: student.total_siblings || 0,
        father_details: { ...(student.father_details || {}) },
        mother_details: { ...(student.mother_details || {}) }
      });
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      const res = await api.put(`/students/${student._id}`, form);
      if (res.data?.student && onSuccess) onSuccess(res.data.student);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update student particulars');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-surface dark:bg-[#141418] border border-line dark:border-white/10 rounded-2xl p-5 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Quick Edit Admission Details ({student.name})</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink"><X className="w-4 h-4" /></button>
        </div>

        {error && <div className="p-2.5 rounded-xl bg-bad-soft text-bad text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4" /><span>{error}</span></div>}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1">Blood Group</label>
              <input type="text" value={form.blood_group || ''} onChange={(e) => setForm({ ...form, blood_group: e.target.value })} placeholder="e.g. B+" className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface dark:bg-[#16161d]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1">Identification Mark</label>
              <input type="text" value={form.identification_mark || ''} onChange={(e) => setForm({ ...form, identification_mark: e.target.value })} placeholder="Nil" className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface dark:bg-[#16161d]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1">Disease If Any?</label>
              <input type="text" value={form.disease_if_any || ''} onChange={(e) => setForm({ ...form, disease_if_any: e.target.value })} placeholder="None" className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface dark:bg-[#16161d]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1">Caste / Cast</label>
              <input type="text" value={form.caste || ''} onChange={(e) => setForm({ ...form, caste: e.target.value })} placeholder="e.g. Memon" className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface dark:bg-[#16161d]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1">Orphan Student?</label>
              <select value={form.is_orphan || 'No'} onChange={(e) => setForm({ ...form, is_orphan: e.target.value })} className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface dark:bg-[#16161d]">
                <option value="No">No</option><option value="Yes">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1">Out of School (OSC)?</label>
              <select value={form.is_osc || 'No'} onChange={(e) => setForm({ ...form, is_osc: e.target.value })} className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface dark:bg-[#16161d]">
                <option value="No">No</option><option value="Yes">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1">Total Siblings</label>
              <input type="number" min="0" value={form.total_siblings || 0} onChange={(e) => setForm({ ...form, total_siblings: Number(e.target.value) })} className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface dark:bg-[#16161d]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1">Father Profession</label>
              <input type="text" value={form.father_details?.profession || ''} onChange={(e) => setForm({ ...form, father_details: { ...form.father_details, profession: e.target.value } })} placeholder="e.g. Teacher" className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface dark:bg-[#16161d]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1">Father Income (Rs.)</label>
              <input type="number" min="0" value={form.father_details?.income || 0} onChange={(e) => setForm({ ...form, father_details: { ...form.father_details, income: Number(e.target.value) } })} className="w-full px-3 py-1.5 rounded-lg border border-line bg-surface dark:bg-[#16161d]" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-line dark:border-white/10">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-xs font-semibold">Cancel</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold">
              <Check className="w-3.5 h-3.5" /><span>{saving ? 'Saving...' : 'Save Updates'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionQuickEditModal;
