const StudentParentsDetailsTab = ({ data = {}, onChange }) => {
  const father = data.father_details || {};
  const mother = data.mother_details || {};

  const handleFatherChange = (f, v) => onChange('father_details', { ...father, [f]: v });
  const handleMotherChange = (f, v) => onChange('mother_details', { ...mother, [f]: v });

  return (
    <div className="space-y-4 text-xs">
      <div className="p-4 rounded-2xl bg-surface-secondary/40 border border-line space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-[11px] text-primary uppercase tracking-wider">Father Particulars</h4>
          <span className="text-[10px] text-ink-faint font-normal">Optional</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
              Father Name <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={data.father_name || ''}
              onChange={(e) => onChange('father_name', e.target.value)}
              placeholder="Father full name"
              className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
              Father CNIC <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={father.cnic || data.parents_cnic || ''}
              onChange={(e) => { handleFatherChange('cnic', e.target.value); onChange('parents_cnic', e.target.value); }}
              placeholder="42101-..."
              className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
              Father Mobile <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={father.phone || father.mobile || data.parent_phone || ''}
              onChange={(e) => { handleFatherChange('phone', e.target.value); onChange('parent_phone', e.target.value); }}
              placeholder="+923..."
              className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
              Occupation <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={father.occupation || ''}
              onChange={(e) => handleFatherChange('occupation', e.target.value)}
              placeholder="e.g. Business / Service"
              className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-surface-secondary/40 border border-line space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-[11px] text-primary uppercase tracking-wider">Mother Particulars</h4>
          <span className="text-[10px] text-ink-faint font-normal">Optional</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
              Mother Name <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={mother.name || ''}
              onChange={(e) => handleMotherChange('name', e.target.value)}
              placeholder="Mother full name"
              className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
              Mother CNIC <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={mother.cnic || ''}
              onChange={(e) => handleMotherChange('cnic', e.target.value)}
              placeholder="42101-..."
              className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
              Mother Mobile <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={mother.phone || mother.mobile || ''}
              onChange={(e) => handleMotherChange('phone', e.target.value)}
              placeholder="+923..."
              className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
              Occupation <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={mother.occupation || ''}
              onChange={(e) => handleMotherChange('occupation', e.target.value)}
              placeholder="e.g. Housewife / Doctor"
              className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentParentsDetailsTab;
