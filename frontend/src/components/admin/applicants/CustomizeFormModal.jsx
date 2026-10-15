import { useState } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';

const DEFAULT_FIELDS = [
  { id: 'father_name', label: "Father's Name", required: true },
  { id: 'cnic', label: 'CNIC / National ID', required: true },
  { id: 'dob', label: 'Date of Birth', required: false },
  { id: 'marital_status', label: 'Marital Status', required: false },
  { id: 'expected_salary', label: 'Expected Salary', required: true },
  { id: 'previous_employer', label: 'Previous Employer', required: false },
  { id: 'experience_years', label: 'Experience (Years)', required: true },
  { id: 'resume_upload', label: 'Resume / CV Document', required: true },
  { id: 'skills', label: 'Skills & Specializations', required: false }
];

const CustomizeFormModal = ({ isOpen, onClose }) => {
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const toggleField = (id) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, required: !f.required } : f))
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface dark:bg-[#141414] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink dark:text-ink-dark">Customize Application Form</h3>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Toggle required fields for public applicants</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
          {fields.map((f) => (
            <div
              key={f.id}
              onClick={() => toggleField(f.id)}
              className="flex items-center justify-between p-3 rounded-xl border border-line/60 dark:border-white/5 bg-surface-secondary/30 dark:bg-black/20 hover:border-primary/40 cursor-pointer transition-colors"
            >
              <span className="text-xs font-semibold text-ink dark:text-ink-dark">{f.label}</span>
              <button
                type="button"
                className={`w-9 h-5 rounded-full p-0.5 transition-colors relative ${
                  f.required ? 'bg-primary' : 'bg-surface-secondary dark:bg-white/20'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    f.required ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-semibold text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            <span>{saved ? 'Saved!' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeFormModal;
