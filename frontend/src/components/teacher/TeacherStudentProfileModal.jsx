import { createPortal } from 'react-dom';
import { useState, useEffect, useMemo } from 'react';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import TeacherStudentProfileModalHeader from './TeacherStudentProfileModalHeader';
import StudentBioAcademicTab from './students/StudentBioAcademicTab';
import StudentParentsDetailsTab from './students/StudentParentsDetailsTab';
import StudentContactAddressTab from './students/StudentContactAddressTab';

const TeacherStudentProfileModal = ({
  isOpen,
  onClose,
  student,
  grades = [],
  campuses = [],
  defaultCampusId = '',
  onSaved
}) => {
  const [activeTab, setActiveTab] = useState('bio');
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedCampusId, setSelectedCampusId] = useState('');

  useEffect(() => {
    const sCamp = student?.campus_id?._id || student?.campus_id || defaultCampusId || (campuses[0]?._id ? String(campuses[0]._id) : '');
    setSelectedCampusId(sCamp ? String(sCamp) : '');

    if (student) {
      setFormData({
        ...student,
        campus_id: sCamp
      });
    } else {
      const campGrades = grades.filter((g) => {
        const cId = g.campus_id?._id || g.campus_id;
        return !cId || !sCamp || String(cId) === String(sCamp);
      });
      setFormData({
        campus_id: sCamp,
        current_grade: campGrades[0]?._id || grades[0]?._id || '',
        current_section: 'A',
        status: 'Active',
        gender: 'Male',
        religion: 'Islam'
      });
    }
    setActiveTab('bio');
    setError('');
  }, [student, grades, campuses, defaultCampusId, isOpen]);

  const availableGrades = useMemo(() => {
    if (!selectedCampusId) return grades;
    const filtered = grades.filter((g) => {
      const cId = g.campus_id?._id || g.campus_id;
      return !cId || String(cId) === String(selectedCampusId);
    });
    return filtered.length > 0 ? filtered : grades;
  }, [grades, selectedCampusId]);

  if (!isOpen) return null;
  const isEdit = Boolean(student?._id);

  const handleFieldChange = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleCampusChange = (cId) => {
    setSelectedCampusId(cId);
    const campGrades = grades.filter((g) => {
      const gCamp = g.campus_id?._id || g.campus_id;
      return !gCamp || !cId || String(gCamp) === String(cId);
    });
    setFormData((prev) => ({
      ...prev,
      campus_id: cId,
      current_grade: campGrades[0]?._id || ''
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError('Student Name is required.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      const payload = {
        ...formData,
        name: formData.name.trim(),
        father_name: formData.father_name?.trim() || 'N/A'
      };
      const res = isEdit
        ? await api.put(`/teacher-portal/students/${student._id}`, payload)
        : await api.post('/teacher-portal/students', payload);

      if (res.data?.student && onSaved) onSaved(res.data.student, isEdit);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student profile.');
    } finally {
      setSaving(false);
    }
  };

  const modalNode = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
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

          {activeTab === 'bio' && (
            <StudentBioAcademicTab
              data={formData}
              onChange={handleFieldChange}
              grades={availableGrades}
              campuses={campuses}
              selectedCampusId={selectedCampusId}
              onCampusChange={handleCampusChange}
            />
          )}
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

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : null;
};

export default TeacherStudentProfileModal;
