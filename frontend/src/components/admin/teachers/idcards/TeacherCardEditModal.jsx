import { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import api from '../../../../services/api';

const TeacherCardEditModal = ({ isOpen, teacher, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    blood_group: 'O+',
    semis_code: '',
    vendor_no: '',
    sed_no: '',
    personal_id: '',
    father_name: '',
    spouse_name: '',
    current_address: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (teacher) {
      setFormData({
        blood_group: teacher.blood_group || 'O+',
        semis_code: teacher.semis_code || '',
        vendor_no: teacher.vendor_no || '',
        sed_no: teacher.sed_no || '',
        personal_id: teacher.personal_id || '',
        father_name: teacher.father_name || '',
        spouse_name: teacher.spouse_name || '',
        current_address: teacher.current_address || ''
      });
      setError('');
    }
  }, [teacher]);

  if (!isOpen || !teacher) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      const res = await api.put(`/teachers/${teacher._id}`, formData);
      if (res.data?.teacher) {
        onSaveSuccess(res.data.teacher);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update teacher service card fields');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-surface dark:bg-[#101015] border border-line dark:border-line-dark rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Edit Service Card Details</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <p className="text-xs text-bad font-semibold">{error}</p>}

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold mb-1">Blood Group (Optional)</label>
              <select
                value={formData.blood_group}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 outline-none"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Personal ID # (8 Digits)</label>
              <input
                type="text"
                value={formData.personal_id}
                onChange={(e) => setFormData({ ...formData, personal_id: e.target.value })}
                placeholder="11034103"
                className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">SEMIS Code (Optional)</label>
              <input
                type="text"
                value={formData.semis_code}
                onChange={(e) => setFormData({ ...formData, semis_code: e.target.value })}
                placeholder="408110114"
                className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Vendor No (Optional)</label>
              <input
                type="text"
                value={formData.vendor_no}
                onChange={(e) => setFormData({ ...formData, vendor_no: e.target.value })}
                placeholder="1045231"
                className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">SED # (Optional)</label>
              <input
                type="text"
                value={formData.sed_no}
                onChange={(e) => setFormData({ ...formData, sed_no: e.target.value })}
                placeholder="SED-9921"
                className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Father / Spouse Name</label>
              <input
                type="text"
                value={formData.father_name}
                onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                placeholder="Father or Husband name"
                className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 outline-none"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold mb-1">Current Posting Address</label>
            <input
              type="text"
              value={formData.current_address}
              onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
              placeholder="e.g. Korangi 4, Karachi"
              className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-line dark:border-line-dark">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-line dark:border-line-dark text-xs font-bold text-ink-muted hover:bg-surface-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Updating...' : 'Save Card Fields'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherCardEditModal;
