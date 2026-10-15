import { useState, useEffect } from 'react';
import { X, BookOpen, AlertCircle } from 'lucide-react';
import { isValidSubjectName, isValidSubjectCode, generateSubjectCode } from '../../../utils/validators';
import SubjectPresetChips from './SubjectPresetChips';
import SubjectToggle from './SubjectToggle';
import SubjectClassesInput from './SubjectClassesInput';

const SubjectModal = ({ isOpen, mode = 'add', subject = null, campuses = [], onClose, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    campus_id: '',
    status: 'Active',
    mandatory: true,
    classes: []
  });
  const [isManualCode, setIsManualCode] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (subject && mode === 'edit') {
      setFormData({
        name: subject.name || '',
        code: subject.code || '',
        campus_id: subject.campus_id?._id || subject.campus_id || '',
        status: subject.status || 'Active',
        mandatory: subject.mandatory !== undefined ? subject.mandatory : true,
        classes: Array.isArray(subject.classes) ? subject.classes : []
      });
      setIsManualCode(true);
    } else {
      setFormData({
        name: '',
        code: '',
        campus_id: '',
        status: 'Active',
        mandatory: true,
        classes: []
      });
      setIsManualCode(false);
    }
    setTouched({});
  }, [subject, mode, isOpen]);

  if (!isOpen) return null;

  const isNameValid = isValidSubjectName(formData.name);
  const isCodeValid = isValidSubjectCode(formData.code);
  const isFormValid = isNameValid && isCodeValid;

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: newName,
      code: !isManualCode ? generateSubjectCode(newName) : prev.code
    }));
  };

  const handleCodeChange = (e) => {
    setIsManualCode(true);
    setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }));
  };

  const handlePresetSelect = (preset) => {
    setFormData((prev) => ({
      ...prev,
      name: preset.name,
      code: preset.code,
      mandatory: preset.mandatory,
      classes: preset.classes || []
    }));
    setIsManualCode(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    onSubmit({
      ...formData,
      campus_id: formData.campus_id || null,
      classes: formData.classes || []
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-dark">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink dark:text-ink-dark">
                {mode === 'edit' ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
                Configure curriculum course codes and requirements.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {mode === 'add' && (
          <SubjectPresetChips onSelectPreset={handlePresetSelect} currentName={formData.name} />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-ink-sub dark:text-ink-sub-dark">
                Subject Name <span className="text-bad">*</span>
              </label>
              {!isManualCode && formData.code && (
                <span className="text-[11px] text-primary dark:text-primary-dark font-medium">
                  Auto-code active
                </span>
              )}
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              onBlur={() => setTouched((p) => ({ ...p, name: true }))}
              placeholder="e.g. Computer Science"
              className={`w-full px-3.5 py-2 rounded-xl text-sm bg-surface dark:bg-[#141414] border ${
                touched.name && !isNameValid
                  ? 'border-bad focus:ring-bad'
                  : 'border-line dark:border-white/10 focus:border-primary'
              } text-ink dark:text-ink-dark outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
            />
            {touched.name && !isNameValid && (
              <p className="flex items-center gap-1 text-xs text-bad mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> Enter valid name (1-50 characters)
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-ink-sub dark:text-ink-sub-dark">
                Subject Code <span className="text-bad">*</span>
              </label>
              {isManualCode && (
                <button
                  type="button"
                  onClick={() => {
                    setIsManualCode(false);
                    setFormData((prev) => ({ ...prev, code: generateSubjectCode(prev.name) }));
                  }}
                  className="text-[11px] text-primary dark:text-primary-dark hover:underline"
                >
                  Reset to auto-code
                </button>
              )}
            </div>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleCodeChange}
              onBlur={() => setTouched((p) => ({ ...p, code: true }))}
              placeholder="e.g. CS / MATH"
              className={`w-full px-3.5 py-2 rounded-xl text-sm bg-surface dark:bg-[#141414] border ${
                touched.code && !isCodeValid
                  ? 'border-bad focus:ring-bad'
                  : 'border-line dark:border-white/10 focus:border-primary'
              } text-ink dark:text-ink-dark uppercase font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
            />
            {touched.code && !isCodeValid && (
              <p className="flex items-center gap-1 text-xs text-bad mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> Enter valid alphanumeric code (1-20 characters)
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
                Campus (Optional)
              </label>
              <select
                name="campus_id"
                value={formData.campus_id}
                onChange={(e) => setFormData((prev) => ({ ...prev, campus_id: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-surface dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">All Campuses (Global)</option>
                {campuses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-surface dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <SubjectClassesInput
            selectedClasses={formData.classes || []}
            onChange={(cls) => setFormData((prev) => ({ ...prev, classes: cls }))}
          />

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10">
            <div>
              <p className="text-xs font-semibold text-ink dark:text-ink-dark">Mandatory Subject</p>
              <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">
                Compulsory for all enrolled students in the grade
              </p>
            </div>
            <SubjectToggle
              checked={formData.mandatory}
              onChange={(val) => setFormData((prev) => ({ ...prev, mandatory: val }))}
              ariaLabel="Mandatory toggle"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-line dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-line dark:border-line-dark text-sm font-medium text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`px-5 py-2 rounded-xl text-sm font-medium text-white transition-all ${
                !isFormValid || isSubmitting
                  ? 'bg-primary/50 cursor-not-allowed opacity-60'
                  : 'bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg'
              }`}
            >
              {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Subject' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectModal;
