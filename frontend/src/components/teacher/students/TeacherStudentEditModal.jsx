import { useState, useEffect } from 'react';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import api from '../../../services/api';
import TeacherStudentModalHeader from './TeacherStudentModalHeader';
import StudentBasicTab from './StudentBasicTab';
import StudentIdentityTab from './StudentIdentityTab';
import StudentParentTab from './StudentParentTab';
import StudentAddressTab from './StudentAddressTab';

const TeacherStudentEditModal = ({ isOpen, onClose, student, grades = [], onSaved }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        current_grade: grades[0]?._id || '',
        current_section: 'A',
        status: 'Active',
        gender: 'Male',
        religion: 'Islam'
      });
    }
    setActiveTab('basic');
    setError('');
  }, [student, grades, isOpen]);

  if (!isOpen) return null;
  const isEdit = Boolean(student?._id);

  const handleFieldChange = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.father_name?.trim()) {
      setError('Student Name and Father Name are required.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      const res = isEdit
        ? await api.put(`/teacher-portal/students/${student._id}`, formData)
        : await api.post('/teacher-portal/students', formData);

      if (res.data?.student && onSaved) onSaved(res.data.student, isEdit);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-3xl rounded-3xl bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <TeacherStudentModalHeader
          isEdit={isEdit}
          studentName={student?.name}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onClose={onClose}
        />

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-bad/10 text-bad border border-bad/20 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'basic' && <StudentBasicTab data={formData} onChange={handleFieldChange} grades={grades} />}
          {activeTab === 'identity' && <StudentIdentityTab data={formData} onChange={handleFieldChange} />}
          {activeTab === 'parents' && <StudentParentTab data={formData} onChange={handleFieldChange} />}
          {activeTab === 'address' && <StudentAddressTab data={formData} onChange={handleFieldChange} />}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-line dark:border-line-dark">
            <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-xs font-bold text-ink-muted hover:text-ink cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : isEdit ? 'Update Student Profile' : 'Enroll Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherStudentEditModal;
