import { useState, useEffect } from 'react';
import { X, AlertCircle, Layers, Check } from 'lucide-react';
import { isValidGradeName, isValidSections } from '../../../utils/validators';
import GradeSectionsInput from './GradeSectionsInput';
import GradeFormFields from './GradeFormFields';

const GradeModal = ({
  isOpen,
  onClose,
  onSave,
  grade,
  campuses = [],
  teachers = []
}) => {
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
    const val = sectionInput.trim().toUpperCase();
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
      await onSave({
        name: name.trim(),
        sections,
        status,
        campus_id: campusId || null,
        class_teacher: classTeacher || null
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save grade');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-6 shadow-2xl z-10 space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Layers size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink dark:text-white">
                {grade ? 'Edit Class & Sections' : 'Add New Class & Sections'}
              </h2>
              <p className="text-[11px] text-ink-muted">
                Configure grade level, branch allocation, and assigned class teacher
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-ink-muted hover:text-ink cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-bad/10 text-bad dark:text-bad-dark border border-bad/20 flex items-center gap-2 text-xs font-semibold">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <GradeFormFields
            name={name}
            setName={setName}
            campusId={campusId}
            setCampusId={setCampusId}
            classTeacher={classTeacher}
            setClassTeacher={setClassTeacher}
            status={status}
            setStatus={setStatus}
            campuses={campuses}
            teachers={teachers}
          />

          <GradeSectionsInput
            sections={sections}
            onAdd={handleAddSection}
            onRemove={handleRemoveSection}
            inputVal={sectionInput}
            setInputVal={setSectionInput}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line dark:border-line-dark">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl border border-line dark:border-line-dark text-xs font-semibold text-ink-muted hover:text-ink cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>{submitting ? 'Saving...' : grade ? 'Update Class' : 'Create Class'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeModal;
