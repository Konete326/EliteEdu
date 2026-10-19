import { useState } from 'react';
import { X, Calendar, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import api from '../../../services/api';

const GenerateChallansModal = ({ isOpen, onClose, grades = [], onSuccess }) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const defaultDueDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    grade_id: '',
    section: '',
    billing_month: currentMonth,
    due_date: defaultDueDate
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.billing_month || !formData.due_date) {
      setError('Billing month and due date are required');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/fees/invoices/generate', formData);
      if (res.data?.success) {
        onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate challans');
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
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Generate Fee Challans</h3>
              <p className="text-[11px] text-slate-500">Bulk generate monthly invoices with arrears calculation</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="p-2.5 rounded-xl bg-bad/10 text-bad border border-bad/20 text-xs">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Target Grade / Class</label>
            <select
              value={formData.grade_id}
              onChange={(e) => setFormData({ ...formData, grade_id: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-primary"
            >
              <option value="">All Active Classes & Students</option>
              {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Section (Optional)</label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                placeholder="e.g. A"
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Billing Month *</label>
              <input
                type="month"
                required
                value={formData.billing_month}
                onChange={(e) => setFormData({ ...formData, billing_month: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Due Date *</label>
            <input
              type="date"
              required
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold flex items-center gap-1.5">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>Generate Challans</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateChallansModal;
