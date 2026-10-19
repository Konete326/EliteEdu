const ProfileEmergencyContactFields = ({ emergency = {}, onChange }) => {
  return (
    <>
      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          Emergency Contact Name
        </label>
        <input
          type="text"
          value={emergency.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="e.g. Brother / Spouse Name"
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          Emergency Contact Phone
        </label>
        <input
          type="text"
          value={emergency.phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="e.g. +923219876543"
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          Emergency Relation
        </label>
        <input
          type="text"
          value={emergency.relation || ''}
          onChange={(e) => onChange('relation', e.target.value)}
          placeholder="e.g. Spouse / Brother / Father"
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
      </div>
    </>
  );
};

export default ProfileEmergencyContactFields;
