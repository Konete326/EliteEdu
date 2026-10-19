import { useState, useEffect } from 'react';
import { ArrowDownRight, Check, Plus, RotateCcw } from 'lucide-react';
import api from '../../../services/api';
import { usePersistentFormDraft } from '../../../hooks/usePersistentFormDraft';

const PAYMENT_MODES = ['Cash', 'Bank Transfer', 'Cheque', 'Online / Portal'];

const IncomeVoucherForm = ({ heads = [], onSaved, editingTx, onCancel }) => {
  const incomeHeads = heads.filter((h) => h.category === 'Income' || h.category === 'Asset');
  const [draft, setDraft, updateDraft, clearDraft] = usePersistentFormDraft('draft_income_voucher', {
    account_head_id: '', title: '', amount: '', payment_mode: 'Cash', reference_no: '',
    transaction_date: new Date().toISOString().split('T')[0], description: ''
  });
  const [formData, setFormData] = useState(draft);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTx) {
      setFormData({
        account_head_id: editingTx.account_head_id || '', title: editingTx.title || '',
        amount: editingTx.amount || '', payment_mode: editingTx.payment_mode || 'Cash',
        reference_no: editingTx.reference_no || '',
        transaction_date: editingTx.transaction_date ? editingTx.transaction_date.split('T')[0] : '',
        description: editingTx.description || ''
      });
    } else {
      setFormData(draft);
    }
  }, [editingTx, draft]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);
    if (!editingTx) updateDraft(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.account_head_id || !formData.title || !formData.amount) return;
    setSaving(true);
    try {
      const payload = { ...formData, voucher_type: 'Income', amount: Number(formData.amount) };
      if (editingTx) {
        await api.put(`/accounts/transactions/${editingTx._id}`, payload);
        if (onCancel) onCancel();
      } else {
        await api.post('/accounts/transactions', payload);
        clearDraft();
        setFormData({
          account_head_id: '', title: '', amount: '', payment_mode: 'Cash',
          reference_no: '', transaction_date: new Date().toISOString().split('T')[0], description: ''
        });
      }
      onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ArrowDownRight className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm font-black text-ink dark:text-ink-dark">
            {editingTx ? 'Edit Receipt Voucher' : 'Quick Income Voucher (RV)'}
          </h2>
        </div>
        {editingTx && (
          <button onClick={onCancel} className="text-xs font-bold text-ink-muted hover:text-ink">Cancel</button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted mb-1">Income Account Head</label>
          <select name="account_head_id" value={formData.account_head_id} onChange={handleChange} required className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary">
            <option value="">Select Account Head</option>
            {incomeHeads.map((h) => <option key={h._id} value={h._id}>{h.code} - {h.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-ink-muted mb-1">Voucher Title / Narration</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Canteen Fee / Uniform Sales" required className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-bold text-ink-muted mb-1">Amount (PKR)</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="0.00" required className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-ink-muted mb-1">Payment Mode</label>
            <select name="payment_mode" value={formData.payment_mode} onChange={handleChange} className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary">
              {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-bold text-ink-muted mb-1">Ref #</label>
            <input type="text" name="reference_no" value={formData.reference_no} onChange={handleChange} placeholder="Chq / Trx ID" className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-ink-muted mb-1">Date</label>
            <input type="date" name="transaction_date" value={formData.transaction_date} onChange={handleChange} className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none" />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 disabled:opacity-50">
            {editingTx ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : editingTx ? 'Update Voucher' : 'Post Receipt Voucher'}</span>
          </button>
          {!editingTx && (
            <button type="button" onClick={clearDraft} className="px-3 py-2.5 rounded-xl border border-line text-ink-muted hover:text-ink text-xs font-bold">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default IncomeVoucherForm;
