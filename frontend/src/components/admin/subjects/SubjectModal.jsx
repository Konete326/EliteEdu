import { useState, useEffect } from 'react';
import { isValidSubjectName, isValidSubjectCode, generateSubjectCode } from '../../../utils/validators';
import SubjectPresetChips from './SubjectPresetChips';
import SubjectClassesInput from './SubjectClassesInput';
import SubjectModalHeader from './SubjectModalHeader';
import SubjectModalBasicFields from './SubjectModalBasicFields';

const INITIAL = { name: '', code: '', campus_id: '', status: 'Active', mandatory: true, classes: [] };

const SubjectModal = ({
  isOpen, mode = 'add', subject = null, campuses = [], grades = [], onClose, onSubmit, isSubmitting = false
}) => {
  const [formData, setFormData] = useState(INITIAL);
  const [isManualCode, setIsManualCode] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (subject && mode === 'edit') {
      setFormData({
        name: subject.name || '', code: subject.code || '',
        campus_id: subject.campus_id?._id || subject.campus_id || '',
        status: subject.status || 'Active', mandatory: subject.mandatory !== false,
        classes: Array.isArray(subject.classes) ? subject.classes : []
      });
      setIsManualCode(true);
    } else {
      setFormData(INITIAL);
      setIsManualCode(false);
    }
    setTouched({});
  }, [subject, mode, isOpen]);

  if (!isOpen) return null;

  const isFormValid = isValidSubjectName(formData.name) && isValidSubjectCode(formData.code);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    const prevAuto = generateSubjectCode(formData.name);
    const shouldAutoUpdate = !isManualCode || !formData.code.trim() || formData.code === prevAuto;
    const newCode = shouldAutoUpdate ? generateSubjectCode(newName) : formData.code;
    if (shouldAutoUpdate) setIsManualCode(false);
    setFormData((prev) => ({ ...prev, name: newName, code: newCode }));
  };

  const handleCodeChange = (e) => {
    const val = e.target.value.toUpperCase();
    const isAutoMatch = val === generateSubjectCode(formData.name);
    setIsManualCode(!isAutoMatch && Boolean(val.trim()));
    setFormData((prev) => ({ ...prev, code: val }));
  };

  const handleResetAutoCode = () => {
    setIsManualCode(false);
    setFormData((prev) => ({ ...prev, code: generateSubjectCode(prev.name) }));
  };

  const handlePresetSelect = (preset) => {
    setFormData((prev) => ({ ...prev, name: preset.name, code: preset.code, mandatory: preset.mandatory, classes: preset.classes || [] }));
    setIsManualCode(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      setTouched({ name: true, code: true });
      return;
    }
    if (!isFormValid || isSubmitting) return;
    onSubmit({ ...formData, campus_id: formData.campus_id || null, classes: formData.classes || [] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-4xl lg:max-w-5xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-5 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <SubjectModalHeader mode={mode} onClose={onClose} />

        {mode === 'add' && <SubjectPresetChips onSelectPreset={handlePresetSelect} currentName={formData.name} />}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6">
              <SubjectModalBasicFields
                formData={formData}
                touched={touched}
                isNameValid={isValidSubjectName(formData.name)}
                isCodeValid={isValidSubjectCode(formData.code)}
                isManualCode={isManualCode}
                campuses={campuses}
                onNameChange={handleNameChange}
                onCodeChange={handleCodeChange}
                onResetAutoCode={handleResetAutoCode}
                onFieldChange={(field, val) => setFormData((p) => ({ ...p, [field]: val }))}
                onBlur={(field) => setTouched((p) => ({ ...p, [field]: true }))}
              />
            </div>
            <div className="lg:col-span-6">
              <SubjectClassesInput
                selectedClasses={formData.classes || []}
                grades={grades}
                onChange={(cls) => setFormData((prev) => ({ ...prev, classes: cls }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-line dark:border-white/10">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 rounded-xl border border-line dark:border-line-dark text-xs sm:text-sm font-semibold text-ink-sub hover:bg-surface-secondary cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-md disabled:opacity-50 cursor-pointer">
              {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Subject' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectModal;
