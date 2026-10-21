import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Layers } from 'lucide-react';
import { isValidSubjectName, isValidSubjectCode, generateUniqueSubjectCode } from '../../../utils/validators';
import { STANDARD_SUBJECT_PRESETS } from '../../../utils/curriculumPresets';
import SubjectModalHeader from './SubjectModalHeader';
import SubjectGeneralTab from './SubjectGeneralTab';
import SubjectClassesTab from './SubjectClassesTab';
import SearchableSelect from '../../common/SearchableSelect';

const INITIAL = {
  name: '',
  code: '',
  campus_id: '',
  status: 'Active',
  mandatory: true,
  subject_type: 'Compulsory',
  stream: 'General',
  elective_group: '',
  assigned_teacher: '',
  periods_per_week: 5,
  theory_marks: 75,
  practical_marks: 0,
  classes: []
};

const SubjectModal = ({
  isOpen,
  mode = 'add',
  subject = null,
  campuses = [],
  grades = [],
  teachers = [],
  existingSubjects = [],
  onClose,
  onSubmit,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState(INITIAL);
  const [isManualCode, setIsManualCode] = useState(false);
  const [touched, setTouched] = useState({});
  const [activeTab, setActiveTab] = useState('general');

  const existingCodes = useMemo(() => {
    return (existingSubjects || [])
      .filter((s) => s._id !== subject?._id)
      .map((s) => (s.code || '').toUpperCase().trim());
  }, [existingSubjects, subject]);

  useEffect(() => {
    if (subject && mode === 'edit') {
      setFormData({
        name: subject.name || '',
        code: subject.code || '',
        campus_id: subject.campus_id?._id || subject.campus_id || '',
        status: subject.status || 'Active',
        mandatory: subject.mandatory !== false,
        subject_type: subject.subject_type || (subject.mandatory !== false ? 'Compulsory' : 'Elective'),
        stream: subject.stream || 'General',
        elective_group: subject.elective_group || '',
        assigned_teacher: subject.assigned_teacher?._id || subject.assigned_teacher || '',
        periods_per_week: subject.periods_per_week || 5,
        theory_marks: subject.theory_marks ?? 75,
        practical_marks: subject.practical_marks ?? 0,
        classes: Array.isArray(subject.classes) ? subject.classes : []
      });
      setIsManualCode(true);
    } else {
      setFormData(INITIAL);
      setIsManualCode(false);
    }
    setTouched({});
    setActiveTab('general');
  }, [subject, mode, isOpen]);

  const presetOptions = useMemo(() => {
    return STANDARD_SUBJECT_PRESETS.map((p) => ({
      value: p.name,
      label: `${p.name} (${p.code})`,
      subtext: `${p.subject_type} • ${p.stream}`
    }));
  }, []);

  if (!isOpen) return null;

  const isFormValid = isValidSubjectName(formData.name) && isValidSubjectCode(formData.code);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    const prevAuto = generateUniqueSubjectCode(formData.name, existingCodes);
    const shouldAutoUpdate = !isManualCode || !formData.code.trim() || formData.code === prevAuto;
    const newCode = shouldAutoUpdate ? generateUniqueSubjectCode(newName, existingCodes) : formData.code;
    if (shouldAutoUpdate) setIsManualCode(false);
    setFormData((prev) => ({ ...prev, name: newName, code: newCode }));
  };

  const handleCodeChange = (e) => {
    const val = e.target.value.toUpperCase();
    const isAutoMatch = val === generateUniqueSubjectCode(formData.name, existingCodes);
    setIsManualCode(!isAutoMatch && Boolean(val.trim()));
    setFormData((prev) => ({ ...prev, code: val }));
  };

  const handleResetAutoCode = () => {
    setIsManualCode(false);
    setFormData((prev) => ({ ...prev, code: generateUniqueSubjectCode(prev.name, existingCodes) }));
  };

  const handlePresetSelect = (presetName) => {
    const preset = STANDARD_SUBJECT_PRESETS.find((p) => p.name === presetName);
    if (!preset) return;
    setFormData((prev) => ({
      ...prev,
      name: preset.name,
      code: preset.code,
      mandatory: preset.mandatory,
      subject_type: preset.subject_type,
      stream: preset.stream,
      elective_group: preset.elective_group || '',
      periods_per_week: preset.periods_per_week || 5,
      theory_marks: preset.theory_marks ?? 75,
      practical_marks: preset.practical_marks ?? 0,
      classes: preset.classes || []
    }));
    setIsManualCode(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      setTouched({ name: true, code: true });
      setActiveTab('general');
      return;
    }
    if (!isFormValid || isSubmitting) return;

    onSubmit({
      ...formData,
      campus_id: formData.campus_id || null,
      assigned_teacher: formData.assigned_teacher || null,
      classes: formData.classes || []
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 sm:p-6 pb-0 space-y-3 shrink-0">
          <SubjectModalHeader mode={mode} onClose={onClose} />

          {mode === 'add' && (
            <div className="p-2.5 rounded-xl bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark">
              <SearchableSelect
                options={presetOptions}
                value=""
                onChange={handlePresetSelect}
                placeholder="Select from common subjects (optional)..."
                size="sm"
              />
            </div>
          )}

          <div className="flex border-b border-line dark:border-white/10 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'general'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              <BookOpen size={13} />
              <span>1. Basic Info</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('classes')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'classes'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              <Layers size={13} />
              <span>2. Classes & Marks ({formData.classes?.length || 0})</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4">
            {activeTab === 'general' ? (
              <SubjectGeneralTab
                formData={formData}
                setFormData={setFormData}
                touched={touched}
                isNameValid={isValidSubjectName(formData.name)}
                isCodeValid={isValidSubjectCode(formData.code)}
                isManualCode={isManualCode}
                campuses={campuses}
                teachers={teachers}
                existingCodes={existingCodes}
                onNameChange={handleNameChange}
                onCodeChange={handleCodeChange}
                onResetAutoCode={handleResetAutoCode}
                onBlur={(field) => setTouched((p) => ({ ...p, [field]: true }))}
              />
            ) : (
              <SubjectClassesTab
                formData={formData}
                setFormData={setFormData}
                grades={grades}
              />
            )}
          </div>

          <div className="p-4 sm:px-6 border-t border-line dark:border-white/10 flex items-center justify-between bg-surface-secondary/40 dark:bg-surface-secondary-dark/40 shrink-0">
            {activeTab === 'general' ? (
              <button
                type="button"
                onClick={() => setActiveTab('classes')}
                className="px-4 py-2 rounded-xl border border-line dark:border-line-dark text-xs font-bold text-ink dark:text-white hover:bg-surface-secondary cursor-pointer"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className="px-4 py-2 rounded-xl border border-line dark:border-line-dark text-xs font-bold text-ink dark:text-white hover:bg-surface-secondary cursor-pointer"
              >
                Back
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl border border-line dark:border-line-dark text-xs font-semibold text-ink-muted hover:bg-surface-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Save Subject'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectModal;