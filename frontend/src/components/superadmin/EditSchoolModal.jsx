import { useState, useEffect } from 'react';
import { X, Building2, Save } from 'lucide-react';
import api from '../../services/api';

const EditSchoolModal = ({ isOpen, onClose, school, onUpdated }) => {
  const [formData, setFormData] = useState({
    name: '', school_type: 'Private', board: '', contact_number: '', email: '', address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name || '',
        school_type: school.school_type || 'Private',
        board: school.board || '',
        contact_number: school.contact_number || '',
        email: school.email || '',
        address: school.address || ''
      });
      setError('');
    }
  }, [school]);

  if (!isOpen || !school) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.put(`/schools/${school._id}`, formData);
      onUpdated(res.data.school);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update school');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-line dark:border-line-dark bg-white dark:bg-surface-secondary-dark text-ink dark:text-ink-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-line dark:border-line-dark pb-3">
          <div className="flex items-center gap-2 font-bold text-ink dark:text-ink-dark text-lg">
            <Building2 className="w-5 h-5 text-primary" />
            <span>Edit School ({school.code})</span>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="p-3 rounded-lg bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-xs">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">School Name *</label>
            <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">School Type *</label>
              <select value={formData.school_type} onChange={(e) => setFormData({ ...formData, school_type: e.target.value })} className={inputClass}>
                <option value="Private">Private</option>
                <option value="Government">Government</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">Board</label>
              <input value={formData.board} onChange={(e) => setFormData({ ...formData, board: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">Phone</label>
              <input value={formData.contact_number} onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">Campus Address</label>
            <input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputClass} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-line dark:border-line-dark">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-ink-muted hover:text-ink dark:hover:text-ink-dark">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium disabled:opacity-50">
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSchoolModal;
