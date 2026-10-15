import { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import api from '../../../../services/api';
import TeacherCardEditFields from './TeacherCardEditFields';

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

          <TeacherCardEditFields formData={formData} setFormData={setFormData} />

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
