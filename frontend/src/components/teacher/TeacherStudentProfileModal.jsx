import { useState, useEffect } from 'react';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import TeacherStudentProfileModalHeader from './TeacherStudentProfileModalHeader';
import StudentBioAcademicTab from './students/StudentBioAcademicTab';
import StudentParentsDetailsTab from './students/StudentParentsDetailsTab';
import StudentContactAddressTab from './students/StudentContactAddressTab';

const TeacherStudentProfileModal = ({ isOpen, onClose, student, grades = [], onSaved }) => {
  const [activeTab, setActiveTab] = useState('bio');
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
    setActiveTab('bio');
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
      setError('Student Name and Father Name are mandatory.');
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
      <div className="w-full max-w-4xl rounded-3xl bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <TeacherStudentProfileModalHeader
          isEdit={isEdit}
          studentName={student?.name}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onClose={onClose}
        />

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-bad/10 text-bad border border-bad/20 text-xs flex items-center gap-2">
              <AlertCircle size={15} /> <span>{error}</span>
            </div>
          )}

          {activeTab === 'bio' && <StudentBioAcademicTab data={formData} onChange={handleFieldChange} grades={grades} />}
          {activeTab === 'parents' && <StudentParentsDetailsTab data={formData} onChange={handleFieldChange} />}
          {activeTab === 'contact' && <StudentContactAddressTab data={formData} onChange={handleFieldChange} />}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-line dark:border-line-dark">
            <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-xs font-bold text-ink-muted hover:text-ink cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{saving ? 'Saving...' : isEdit ? 'Update Student Profile' : 'Enroll Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherStudentProfileModal;
