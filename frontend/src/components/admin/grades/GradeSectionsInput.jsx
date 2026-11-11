import { Plus, X } from 'lucide-react';

const GradeSectionsInput = ({
  sections,
  sectionTeachers = [],
  onSectionTeacherChange,
  onAdd,
  onRemove,
  inputVal,
  setInputVal,
  teachers = []
}) => {
  const getTeacherForSection = (sec) => {
    const found = sectionTeachers.find((st) => st.section === sec);
    return found ? (found.teacher_id?._id || found.teacher_id || '') : '';
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1">Sections & Incharge Teachers *</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAdd(); } }}
          placeholder="Type section (e.g. A, Rose) and enter"
          className="flex-1 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
        />
        <button type="button" onClick={onAdd} className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover flex items-center gap-1 cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      <div className="space-y-2 p-2 rounded-xl bg-surface-secondary/30 border border-line dark:border-line-dark">
        {sections.map((sec, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-surface dark:bg-surface-dark border border-line/50 dark:border-line-dark/50">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-primary/10 text-primary shrink-0 min-w-[50px] justify-center">
              Section {sec}
            </span>
            <div className="flex-1 min-w-0">
              <select
                value={getTeacherForSection(sec)}
                onChange={(e) => onSectionTeacherChange && onSectionTeacherChange(sec, e.target.value)}
                className="w-full px-2 py-1 rounded-lg border border-line dark:border-line-dark bg-surface-secondary/50 text-[11px] text-ink dark:text-ink-dark outline-none"
              >
                <option value="">Select Incharge / Class Teacher</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} {t.designation ? `(${t.designation})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="p-1 rounded text-ink-muted hover:text-bad cursor-pointer transition-colors"
              title="Remove section"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradeSectionsInput;
