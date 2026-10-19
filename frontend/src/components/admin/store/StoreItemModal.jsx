import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import api from '../../../services/api';

const CATEGORIES = ['Textbooks', 'Uniform', 'Stationery', 'Copies & Registers', 'Sports & Tie/Belt', 'Other'];

const StoreItemModal = ({ isOpen, onClose, editingItem, onSaved }) => {
  const [formData, setFormData] = useState({
    sku: '', name: '', category: 'Textbooks', cost_price: '', sale_price: '', stock_qty: '', min_stock_alert: 10
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        sku: editingItem.sku || '', name: editingItem.name || '', category: editingItem.category || 'Textbooks',
        cost_price: editingItem.cost_price || 0, sale_price: editingItem.sale_price || '',
        stock_qty: editingItem.stock_qty || 0, min_stock_alert: editingItem.min_stock_alert || 10
      });
    } else {
      setFormData({ sku: '', name: '', category: 'Textbooks', cost_price: '', sale_price: '', stock_qty: '', min_stock_alert: 10 });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sku || !formData.name || !formData.sale_price) return;
    setSaving(true);
    try {
      const payload = {
        ...formData,
        cost_price: Number(formData.cost_price) || 0,
        sale_price: Number(formData.sale_price),
        stock_qty: Number(formData.stock_qty) || 0,
        min_stock_alert: Number(formData.min_stock_alert) || 10
      };
      if (editingItem) {
        await api.put(`/store/items/${editingItem._id}`, payload);
      } else {
        await api.post('/store/items', payload);
      }
      onSaved();
      onClose();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-surface dark:bg-surface-dark rounded-2xl border border-line shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-line">
          <h3 className="text-sm font-black text-ink dark:text-ink-dark">
            {editingItem ? 'Edit Store Item' : 'Add New Inventory Product'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-secondary text-ink-muted"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1">SKU Code</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g. BK-MTH-09" required className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-mono font-bold outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-bold outline-none">
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-ink-muted mb-1">Item Title / Description</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Oxford Science Class 7" required className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-semibold outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1">Cost Price (PKR)</label>
              <input type="number" name="cost_price" value={formData.cost_price} onChange={handleChange} placeholder="0" className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-mono outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1">Sale Price (PKR)</label>
              <input type="number" name="sale_price" value={formData.sale_price} onChange={handleChange} placeholder="500" required className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-mono font-bold text-emerald-600 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1">Initial Stock Qty</label>
              <input type="number" name="stock_qty" value={formData.stock_qty} onChange={handleChange} placeholder="50" required className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-mono outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1">Min Stock Alert</label>
              <input type="number" name="min_stock_alert" value={formData.min_stock_alert} onChange={handleChange} placeholder="10" className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-mono outline-none" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-md shadow-primary/20">
              <Check className="w-4 h-4" />
              <span>{saving ? 'Saving...' : editingItem ? 'Update Product' : 'Add to Inventory'}</span>
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-line text-ink-muted hover:text-ink font-bold">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreItemModal;
