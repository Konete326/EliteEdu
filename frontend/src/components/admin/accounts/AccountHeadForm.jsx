import { useState, useEffect } from 'react';
import { Landmark, Plus, Check, RotateCcw } from 'lucide-react';
import api from '../../../services/api';
import { usePersistentFormDraft } from '../../../hooks/usePersistentFormDraft';

const CATEGORIES = ['Asset', 'Liability', 'Equity', 'Income', 'Expense'];

const AccountHeadForm = ({ onSaved, editingHead, onCancelEdit }) => {
  const [draft, setDraft, updateDraft, clearDraft] = usePersistentFormDraft('draft_account_head', {
    code: '', name: '', category: 'Expense', opening_balance: 0, status: 'Active'
  });
  const [formData, setFormData] = useState(draft);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingHead) {
      setFormData({
        code: editingHead.code || '', name: editingHead.name || '',
        category: editingHead.category || 'Expense', opening_balance: editingHead.opening_balance || 0,
        status: editingHead.status || 'Active'
      });
    } else {
      setFormData(draft);
    }
  }, [editingHead, draft]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);
    if (!editingHead) updateDraft(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) return;
    setSaving(true);
    try {
      if (editingHead) {
        await api.put(`/accounts/heads/${editingHead._id}`, formData);
        onCancelEdit();
      } else {
        await api.post('/accounts/heads', formData);
        clearDraft();
        setFormData({ code: '', name: '', category: 'Expense', opening_balance: 0, status: 'Active' });
      }
      onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-black text-ink dark:text-ink-dark">
            {editingHead ? 'Edit Account Head' : 'Add New Account Head'}
          </h2>
        </div>
        {editingHead && (
          <button onClick={onCancelEdit} className="text-xs font-bold text-ink-muted hover:text-ink">Cancel</button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted mb-1">Code</label>
          <input type="text" name="code" value={formData.code} onChange={handleChange} placeholder="e.g. 5007" required className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-ink-muted mb-1">Account Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Internet & IT Services" required className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-ink-muted mb-1">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary">
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-ink-muted mb-1">Opening Balance (PKR)</label>
          <input type="number" name="opening_balance" value={formData.opening_balance} onChange={handleChange} className="w-full px-3 py-2 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary" />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-md shadow-primary/20 disabled:opacity-50">
            {editingHead ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : editingHead ? 'Update Head' : 'Save Head'}</span>
          </button>
          {!editingHead && (
            <button type="button" onClick={clearDraft} title="Reset Form" className="px-3 py-2.5 rounded-xl border border-line text-ink-muted hover:text-ink text-xs font-bold">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AccountHeadForm;
