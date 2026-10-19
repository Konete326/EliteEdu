import { useState, useEffect } from 'react';
import { X, HandCoins } from 'lucide-react';
import api from '../../../services/api';

const RECORD_TYPES = [
  { value: 'Loan', label: 'Personal / Long-Term Staff Loan' },
  { value: 'Advance_Salary', label: 'Emergency Advance Salary' },
  { value: 'Security_Deposit', label: 'Refundable Security Deposit' }
];

const NewLoanModal = ({ isOpen, onClose, onCreated, defaultType = 'Loan' }) => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    staff_id: '', record_type: defaultType, principal_amount: '', monthly_installment: '', remarks: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ staff_id: '', record_type: defaultType, principal_amount: '', monthly_installment: '', remarks: '' });
      api.get('/teachers').then((res) => setTeachers(res.data?.data || [])).catch(() => {});
    }
  }, [isOpen, defaultType]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.staff_id || !formData.principal_amount || !formData.monthly_installment) return;
    setSubmitting(true);
    try {
      await api.post('/payroll/loans', {
        ...formData,
        principal_amount: Number(formData.principal_amount),
        monthly_installment: Number(formData.monthly_installment)
      });
      onCreated();
      onClose();
    } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-surface dark:bg-surface-dark rounded-2xl border border-line shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-line">
          <div className="flex items-center gap-2">
            <HandCoins className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black text-ink dark:text-ink-dark">Issue Staff Advance, Loan or Deposit</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-secondary text-ink-muted"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-ink-muted mb-1">Staff Member</label>
            <select name="staff_id" value={formData.staff_id} onChange={handleChange} required className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary">
              <option value="">Select Staff Member</option>
              {teachers.map((t) => <option key={t._id} value={t._id}>{t.name} ({t.employee_code || t.email})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-ink-muted mb-1">Facility Type</label>
            <select name="record_type" value={formData.record_type} onChange={handleChange} className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary">
              {RECORD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-ink-muted mb-1">Total Principal (PKR)</label>
              <input type="number" name="principal_amount" value={formData.principal_amount} onChange={handleChange} placeholder="50000" required className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-mono font-bold outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-ink-muted mb-1">Monthly Deduction (PKR)</label>
              <input type="number" name="monthly_installment" value={formData.monthly_installment} onChange={handleChange} placeholder="5000" required className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-mono font-bold outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-ink-muted mb-1">Remarks / Terms</label>
            <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} placeholder="e.g. Approved by Principal" className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-md shadow-primary/20 disabled:opacity-50">
              <HandCoins className="w-4 h-4" />
              <span>{submitting ? 'Registering...' : 'Approve & Register Facility'}</span>
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-line text-ink-muted hover:text-ink font-bold">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLoanModal;
