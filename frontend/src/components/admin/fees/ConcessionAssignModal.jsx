import { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../../../services/api';

const CATEGORIES = ['Sibling Discount', 'Merit Scholarship', 'Staff Child', 'Need-Based Aid', 'Orphan Concession', 'Sports / Talent Quota', 'Custom Waiver'];

const ConcessionAssignModal = ({ isOpen, onClose, student, onSuccess }) => {
  const [discount, setDiscount] = useState('');
  const [reference, setReference] = useState('Sibling Discount');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setDiscount(String(student.discount || 0));
      setReference(student.discount_reference || 'Sibling Discount');
      setMonthlyFee(String(student.monthly_fee || 0));
      setError('');
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await api.patch(`/fees/concessions/${student._id}`, {
        discount: Number(discount),
        discount_reference: reference,
        monthly_fee: monthlyFee ? Number(monthlyFee) : undefined
      });
      if (res.data?.success) {
        onSuccess(res.data.student);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update concession');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Assign Fee Concession</h3>
              <p className="text-[11px] text-slate-500">{student.name} (GR: {student.gr_number})</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="p-2.5 rounded-xl bg-bad/10 text-bad border border-bad/20 text-xs">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Concession Category *</label>
            <select
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
            >
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Monthly Discount (PKR) *</label>
              <input
                type="number"
                min="0"
                required
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Base Monthly Fee (PKR)</label>
              <input
                type="number"
                min="0"
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-mono"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Effective Monthly Fee:</span>
              <span className="font-bold font-mono text-emerald-600">PKR {Math.max(0, Number(monthlyFee || 0) - Number(discount || 0)).toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold flex items-center gap-1.5">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>Save Concession</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConcessionAssignModal;
