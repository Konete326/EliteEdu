import { useMemo } from 'react';
import { Building2, UserCheck, Layers, AlertCircle } from 'lucide-react';
import SearchableSelect from '../../common/SearchableSelect';

const STREAM_OPTIONS = [
  { value: 'General', label: 'General (All Students)' },
  { value: 'Science (Biology)', label: 'Science with Biology' },
  { value: 'Science (Computer)', label: 'Science with Computer' },
  { value: 'Pre-Medical', label: 'Pre-Medical' },
  { value: 'Pre-Engineering', label: 'Pre-Engineering' },
  { value: 'ICS', label: 'ICS (Computer Science)' },
  { value: 'Commerce', label: 'Commerce' },
  { value: 'Arts / Humanities', label: 'Arts / Humanities' }
];

const SubjectGeneralTab = ({
  formData,
  setFormData,
  touched,
  isNameValid,
  isCodeValid,
  isManualCode,
  campuses = [],
  teachers = [],
  onNameChange,
  onCodeChange,
  onResetAutoCode,
  onBlur
}) => {
  const campusOptions = useMemo(() => [
    { value: '', label: 'All Campuses' },
    ...campuses.map((c) => ({
      value: c._id,
      label: c.name,
      subtext: c.code ? `Code: ${c.code}` : ''
    }))
  ], [campuses]);

  const teacherOptions = useMemo(() => [
    { value: '', label: 'No Teacher Assigned' },
    ...teachers.map((t) => ({
      value: t._id,
      label: t.name,
      subtext: t.designation || 'Teacher',
      badge: t.department || ''
    }))
  ], [teachers]);

  const isElective = formData.subject_type === 'Elective' || !formData.mandatory;

  const handleCategorySelect = (type) => {
    const isMand = type === 'Compulsory';
    setFormData((prev) => ({
      ...prev,
      subject_type: type,
      mandatory: isMand,
      stream: isMand ? 'General' : (prev.stream !== 'General' ? prev.stream : 'Science (Biology)')
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-ink dark:text-white">
              Subject Name <span className="text-bad">*</span>
            </label>
            {!isManualCode && formData.code && (
              <span className="text-[10px] text-primary font-medium">Auto code</span>
            )}
          </div>
          <input
            type="text"
            value={formData.name}
            onChange={onNameChange}
            onBlur={() => onBlur('name')}
            placeholder="e.g. Biology, Computer, English"
            className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border ${
              touched.name && !isNameValid
                ? 'border-bad focus:ring-bad'
                : 'border-line dark:border-line-dark focus:border-primary'
            } text-ink dark:text-white outline-none`}
          />
          {touched.name && !isNameValid && (
            <p className="flex items-center gap-1 text-[11px] text-bad mt-1 font-semibold">
              <AlertCircle size={12} /> Enter valid subject name
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-ink dark:text-white">
              Subject Code <span className="text-bad">*</span>
            </label>
            {isManualCode && (
              <button
                type="button"
                onClick={onResetAutoCode}
                className="text-[10px] text-primary hover:underline cursor-pointer font-semibold"
              >
                Reset code
              </button>
            )}
          </div>
          <input
            type="text"
            value={formData.code}
            onChange={onCodeChange}
            onBlur={() => onBlur('code')}
            placeholder="e.g. BIO, COMP, ENG"
            className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border ${
              touched.code && !isCodeValid
                ? 'border-bad focus:ring-bad'
                : 'border-line dark:border-line-dark focus:border-primary'
            } text-ink dark:text-white uppercase outline-none`}
          />
          {touched.code && !isCodeValid && (
            <p className="flex items-center gap-1 text-[11px] text-bad mt-1 font-semibold">
              <AlertCircle size={12} /> Enter valid code
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink dark:text-white mb-1.5">
          Subject Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleCategorySelect('Compulsory')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              !isElective
                ? 'border-good bg-good/10 text-good dark:bg-good/20 shadow-2xs font-bold'
                : 'border-line dark:border-line-dark bg-surface-secondary/30 text-ink-muted hover:border-line-dark'
            }`}
          >
            <p className="text-xs font-bold">Compulsory</p>
            <p className="text-[10px] opacity-80 mt-0.5">Every student takes this subject</p>
          </button>

          <button
            type="button"
            onClick={() => handleCategorySelect('Elective')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              isElective
                ? 'border-accent bg-accent/10 text-accent dark:bg-accent/20 shadow-2xs font-bold'
                : 'border-line dark:border-line-dark bg-surface-secondary/30 text-ink-muted hover:border-line-dark'
            }`}
          >
            <p className="text-xs font-bold">Elective</p>
            <p className="text-[10px] opacity-80 mt-0.5">Students choose this subject (e.g. Biology or Computer)</p>
          </button>
        </div>
      </div>

      {isElective && (
        <div className="p-3.5 rounded-xl bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-accent">
            <Layers size={14} />
            <span>Group & Period Slot</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-ink dark:text-white mb-1">
                Group / Field
              </label>
              <SearchableSelect
                options={STREAM_OPTIONS}
                value={formData.stream || 'Science (Biology)'}
                onChange={(val) => setFormData((prev) => ({ ...prev, stream: val }))}
                searchable={false}
                size="sm"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-ink dark:text-white mb-1">
                Slot Name (for timetable)
              </label>
              <input
                type="text"
                value={formData.elective_group || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, elective_group: e.target.value }))}
                placeholder="e.g. Science Slot (Bio / Computer)"
                className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-white outline-none focus:border-primary"
              />
            </div>
          </div>
          <p className="text-[10px] text-ink-muted">
            Tip: Biology and Computer can share the same slot name so they run at the same time in different rooms.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-ink dark:text-white mb-1 flex items-center gap-1">
            <UserCheck size={13} className="text-good dark:text-good-dark" />
            <span>Subject Teacher</span>
          </label>
          <SearchableSelect
            options={teacherOptions}
            value={formData.assigned_teacher || ''}
            onChange={(val) => setFormData((prev) => ({ ...prev, assigned_teacher: val }))}
            placeholder="Select teacher..."
            searchPlaceholder="Search teacher..."
            allowClear
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-white mb-1 flex items-center gap-1">
            <Building2 size={13} className="text-primary" />
            <span>Campus</span>
          </label>
          <SearchableSelect
            options={campusOptions}
            value={formData.campus_id || ''}
            onChange={(val) => setFormData((prev) => ({ ...prev, campus_id: val }))}
            placeholder="Select campus (or All Campuses)..."
            allowClear
          />
        </div>
      </div>
    </div>
  );
};

export default SubjectGeneralTab;