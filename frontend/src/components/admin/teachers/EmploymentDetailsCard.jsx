import GovtServiceFields from './GovtServiceFields';

const DESIGNATIONS = [
  'PST', 'JEST', 'JST', 'HST', 'SST', 'HEADMASTER', 'INCHARGE_HEADMASTER',
  'SECTION_INCHARGE', 'AT', 'OT', 'DT', 'SLT', 'SS', 'NAIB_QASID',
  'MALI', 'CHOWKIDAR', 'SWEEPER', 'PEON', 'OTHER'
];

const BPS_GRADES = Array.from({ length: 21 }, (_, i) => `BPS-${i + 1}`);

const EmploymentDetailsCard = ({ formData, errors = {}, onChange, campuses = [], schoolType }) => {
  const isGovt = schoolType === 'Government';

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Employment Details</h3>
        {isGovt && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            Govt HR Profile
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Campus (Optional)</label>
          <select
            value={formData.campus_id || ''}
            onChange={(e) => onChange('campus_id', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none cursor-pointer"
          >
            <option value="">Main / Unassigned</option>
            {campuses.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Department (Optional)</label>
          <input
            type="text"
            value={formData.department || ''}
            onChange={(e) => onChange('department', e.target.value)}
            placeholder="e.g. Science, Primary"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Designation</label>
          <select
            value={formData.designation || 'PST'}
            onChange={(e) => onChange('designation', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none font-semibold cursor-pointer"
          >
            {DESIGNATIONS.map((d) => (
              <option key={d} value={d}>{d.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">BPS Grade (Optional)</label>
          <select
            value={formData.bps_grade || ''}
            onChange={(e) => onChange('bps_grade', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none cursor-pointer"
          >
            <option value="">Select BPS Grade</option>
            {BPS_GRADES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Personal ID / Bio (Optional)</label>
          <input
            type="text"
            value={formData.personal_id || ''}
            onChange={(e) => onChange('personal_id', e.target.value)}
            placeholder="Govt Personal ID"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Qualification (Optional)</label>
          <input
            type="text"
            value={formData.qualification || ''}
            onChange={(e) => onChange('qualification', e.target.value)}
            placeholder="e.g. M.Sc, B.Ed"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
      </div>

      <GovtServiceFields formData={formData} onChange={onChange} isGovt={isGovt} />
    </div>
  );
};

export default EmploymentDetailsCard;
