import { useState, useEffect } from 'react';
import { X, Landmark, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../../../services/api';

const ChallanSettingsModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    bank_name: '', branch_name: '', account_title: '', account_number: '', iban: '', late_fine_policy_note: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    api.get('/fees/challan-settings').then((res) => {
      if (res.data?.settings) setFormData(res.data.settings);
    }).catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await api.put('/fees/challan-settings', formData);
      if (res.data?.success) {
        onSuccess(res.data.settings);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bank settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary"><Landmark className="w-4 h-4" /></div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Bank & Challan Settings</h3>
              <p className="text-[11px] text-slate-500">Configure bank account, branch, and IBAN for 3-copy vouchers</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
        </div>

        {error && <div className="p-2.5 rounded-xl bg-bad/10 text-bad border border-bad/20 text-xs">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Bank Name</label>
              <input type="text" required value={formData.bank_name} onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })} className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none" />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Branch Name</label>
              <input type="text" value={formData.branch_name} onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })} className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Account Title</label>
              <input type="text" required value={formData.account_title} onChange={(e) => setFormData({ ...formData, account_title: e.target.value })} className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none" />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Account Number</label>
              <input type="text" required value={formData.account_number} onChange={(e) => setFormData({ ...formData, account_number: e.target.value })} className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none" />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">IBAN Number</label>
            <input type="text" required value={formData.iban} onChange={(e) => setFormData({ ...formData, iban: e.target.value })} className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-mono" />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300">Late Fine Policy Note</label>
            <input type="text" value={formData.late_fine_policy_note} onChange={(e) => setFormData({ ...formData, late_fine_policy_note: e.target.value })} className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none" />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold flex items-center gap-1.5">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChallanSettingsModal;
