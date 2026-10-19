const ProfilePersonalFieldsA = ({ formData, onChange }) => {
  return (
    <>
      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          Full Name <span className="text-bad">*</span>
        </label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="e.g. Muhammad Ali"
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          required
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          Father / Husband Name
        </label>
        <input
          type="text"
          value={formData.father_name || ''}
          onChange={(e) => onChange('father_name', e.target.value)}
          placeholder="e.g. Tariq Mehmood"
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          CNIC / National ID
        </label>
        <input
          type="text"
          value={formData.cnic || ''}
          onChange={(e) => onChange('cnic', e.target.value)}
          placeholder="e.g. 42101-1234567-1"
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          Date of Birth
        </label>
        <input
          type="date"
          value={formData.dob ? String(formData.dob).slice(0, 10) : ''}
          onChange={(e) => onChange('dob', e.target.value)}
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
      </div>
    </>
  );
};

export default ProfilePersonalFieldsA;
