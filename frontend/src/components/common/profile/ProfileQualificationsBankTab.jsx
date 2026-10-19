import ProfileBankDetailsCard from './ProfileBankDetailsCard';

const ProfileQualificationsBankTab = ({ formData, onChange }) => {
  const bank = formData.bank_details || {};

  const handleBankChange = (field, val) => {
    onChange('bank_details', { ...bank, [field]: val });
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-6 shadow-xs space-y-5">
        <div>
          <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Qualifications & Academic Specialization</h3>
          <p className="text-[11px] text-ink-muted">Educational background and teaching domain expertise.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
              Highest Qualification
            </label>
            <input
              type="text"
              value={formData.qualification || ''}
              onChange={(e) => onChange('qualification', e.target.value)}
              placeholder="e.g. M.Sc / M.Phil / BS"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
              Subject Specialization
            </label>
            <input
              type="text"
              value={formData.specialization || ''}
              onChange={(e) => onChange('specialization', e.target.value)}
              placeholder="e.g. Mathematics / Physics"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
              Experience (Years)
            </label>
            <input
              type="number"
              min="0"
              value={formData.experience_years ?? 0}
              onChange={(e) => onChange('experience_years', e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-line/50">
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
              Official Designation (Admin Assigned)
            </label>
            <input
              type="text"
              value={formData.designation || 'Faculty Member'}
              disabled
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line/60 dark:border-line-dark/60 bg-surface-secondary/70 dark:bg-[#1a1a24] text-ink-muted outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
              BPS / Pay Scale
            </label>
            <input
              type="text"
              value={formData.bps_grade || 'BPS-14'}
              disabled
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line/60 dark:border-line-dark/60 bg-surface-secondary/70 dark:bg-[#1a1a24] text-ink-muted outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
              Appointment / Joining Date
            </label>
            <input
              type="text"
              value={formData.joining_date ? new Date(formData.joining_date).toLocaleDateString('en-GB') : '—'}
              disabled
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line/60 dark:border-line-dark/60 bg-surface-secondary/70 dark:bg-[#1a1a24] text-ink-muted outline-none cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <ProfileBankDetailsCard bank={bank} onChange={handleBankChange} />
    </div>
  );
};

export default ProfileQualificationsBankTab;
