const GENDERS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'];

const ProfilePersonalFieldsB = ({ formData, onChange }) => {
  return (
    <>
      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          Gender
        </label>
        <select
          value={formData.gender || 'Male'}
          onChange={(e) => onChange('gender', e.target.value)}
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        >
          {GENDERS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          Blood Group
        </label>
        <select
          value={formData.blood_group || ''}
          onChange={(e) => onChange('blood_group', e.target.value)}
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        >
          <option value="">Select Blood Group</option>
          {BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          Marital Status
        </label>
        <select
          value={formData.marital_status || 'Single'}
          onChange={(e) => onChange('marital_status', e.target.value)}
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        >
          {MARITAL_STATUSES.map((ms) => (
            <option key={ms} value={ms}>{ms}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          Religion
        </label>
        <input
          type="text"
          value={formData.religion || ''}
          onChange={(e) => onChange('religion', e.target.value)}
          placeholder="e.g. Islam"
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          Nationality
        </label>
        <input
          type="text"
          value={formData.nationality || 'Pakistani'}
          onChange={(e) => onChange('nationality', e.target.value)}
          placeholder="e.g. Pakistani"
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
      </div>
    </>
  );
};

export default ProfilePersonalFieldsB;
