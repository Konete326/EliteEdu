import ProfileBankDetailsCard from './ProfileBankDetailsCard';
import ProfileDocumentsCard from './ProfileDocumentsCard';

const ProfileQualificationsBankTab = ({ formData, onChange, schoolType = 'Private' }) => {
  const bank = formData.bank_details || {};
  const isGovt = schoolType === 'Government';

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
      </div>

      <ProfileDocumentsCard
        documents={formData.documents || []}
        onChange={(docs) => onChange('documents', docs)}
      />

      {!isGovt && (
        <ProfileBankDetailsCard bank={bank} onChange={handleBankChange} />
      )}
    </div>
  );
};

export default ProfileQualificationsBankTab;
