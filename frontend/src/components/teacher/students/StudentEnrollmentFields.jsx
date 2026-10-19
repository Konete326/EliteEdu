const GENDERS = ['Male', 'Female', 'Other'];
const STATUSES = ['Active', 'Registered', 'Inactive', 'Suspended'];

const StudentEnrollmentFields = ({ data, onChange }) => {
  return (
    <>
      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
          Section
        </label>
        <input
          type="text"
          value={data.current_section || 'A'}
          onChange={(e) => onChange('current_section', e.target.value)}
          placeholder="e.g. A"
          className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
          Date of Birth
        </label>
        <input
          type="date"
          value={data.dob ? String(data.dob).slice(0, 10) : ''}
          onChange={(e) => onChange('dob', e.target.value)}
          className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
          Gender
        </label>
        <select
          value={data.gender || 'Male'}
          onChange={(e) => onChange('gender', e.target.value)}
          className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        >
          {GENDERS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
          Enrollment Status
        </label>
        <select
          value={data.status || 'Active'}
          onChange={(e) => onChange('status', e.target.value)}
          className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </>
  );
};

export default StudentEnrollmentFields;
