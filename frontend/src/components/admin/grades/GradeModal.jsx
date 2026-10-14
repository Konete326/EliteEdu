import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { isValidGradeName, isValidSections } from '../../../utils/validators';
import GradeSectionsInput from './GradeSectionsInput';
import GradeFormFields from './GradeFormFields';

const GradeModal = ({ isOpen, onClose, onSave, grade, campuses = [], teachers = [] }) => {
  const [name, setName] = useState('');
  const [sections, setSections] = useState(['A']);
  const [sectionInput, setSectionInput] = useState('');
  const [campusId, setCampusId] = useState('');
  const [classTeacher, setClassTeacher] = useState('');
  const [status, setStatus] = useState('Active');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (grade) {
      setName(grade.name || '');
      setSections(Array.isArray(grade.sections) && grade.sections.length > 0 ? grade.sections : ['A']);
      setCampusId(grade.campus_id?._id || grade.campus_id || '');
      setClassTeacher(grade.class_teacher?._id || grade.class_teacher || '');
      setStatus(grade.status || 'Active');
    } else {
      setName('');
      setSections(['A']);
      setCampusId('');
      setClassTeacher('');
      setStatus('Active');
    }
    setError('');
  }, [grade, isOpen]);

  if (!isOpen) return null;

  const handleAddSection = () => {
    const val = sectionInput.trim();
    if (!val) return;
    if (sections.includes(val)) return setError('Section already added');
    setSections([...sections, val]);
    setSectionInput('');
    setError('');
  };

  const handleRemoveSection = (idx) => {
    if (sections.length <= 1) return setError('At least one section is required');
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidGradeName(name)) return setError('Grade name must be 1-40 valid characters');
    if (!isValidSections(sections)) return setError('At least one valid section is required');
    try {
      setSubmitting(true);
      setError('');
      await onSave({ name: name.trim(), sections, campus_id: campusId || null, class_teacher: classTeacher || null, status });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save grade');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between pb-4 border-b border-line dark:border-line-dark">
          <h2 className="text-lg font-bold text-ink dark:text-ink-dark">{grade ? 'Edit Grade' : 'Add New Grade'}</h2>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-bad-soft text-bad border border-bad/20 flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <GradeFormFields
            name={name} setName={setName}
            campusId={campusId} setCampusId={setCampusId}
            classTeacher={classTeacher} setClassTeacher={setClassTeacher}
            status={status} setStatus={setStatus}
            campuses={campuses} teachers={teachers}
          />

          <GradeSectionsInput
            sections={sections}
            onAdd={handleAddSection}
            onRemove={handleRemoveSection}
            inputVal={sectionInput}
            setInputVal={setSectionInput}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-line dark:border-line-dark">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line dark:border-line-dark text-xs font-medium text-ink-muted hover:bg-surface-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm disabled:opacity-50">
              {submitting ? 'Saving...' : grade ? 'Update Grade' : 'Create Grade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeModal;
