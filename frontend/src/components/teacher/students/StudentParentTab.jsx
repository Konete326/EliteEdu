const StudentParentTab = ({ data, onChange }) => {
  const father = data.father_details || {};
  const mother = data.mother_details || {};

  const handleFatherChange = (field, val) => {
    onChange('father_details', { ...father, [field]: val });
  };

  const handleMotherChange = (field, val) => {
    onChange('mother_details', { ...mother, [field]: val });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            Father CNIC
          </label>
          <input
            type="text"
            value={father.cnic || data.parents_cnic?.father_cnic || ''}
            onChange={(e) => {
              handleFatherChange('cnic', e.target.value);
              onChange('parents_cnic', { ...(data.parents_cnic || {}), father_cnic: e.target.value });
            }}
            placeholder="e.g. 42101-1234567-1"
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            Father Mobile
          </label>
          <input
            type="text"
            value={father.mobile || data.contact_number || ''}
            onChange={(e) => {
              handleFatherChange('mobile', e.target.value);
              onChange('contact_number', e.target.value);
            }}
            placeholder="e.g. +923001234567"
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            Father Occupation
          </label>
          <input
            type="text"
            value={father.occupation || ''}
            onChange={(e) => handleFatherChange('occupation', e.target.value)}
            placeholder="e.g. Engineer / Businessman"
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            Mother Name
          </label>
          <input
            type="text"
            value={mother.name || data.mother_guardian_name || ''}
            onChange={(e) => {
              handleMotherChange('name', e.target.value);
              onChange('mother_guardian_name', e.target.value);
            }}
            placeholder="Mother / Guardian Name"
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            Mother Mobile
          </label>
          <input
            type="text"
            value={mother.mobile || ''}
            onChange={(e) => handleMotherChange('mobile', e.target.value)}
            placeholder="e.g. +923331234567"
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            Emergency Contact Number
          </label>
          <input
            type="text"
            value={data.emergency_contact_no || ''}
            onChange={(e) => onChange('emergency_contact_no', e.target.value)}
            placeholder="e.g. +923219876543"
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentParentTab;
