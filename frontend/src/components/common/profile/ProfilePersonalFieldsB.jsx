import { useEffect } from 'react';
import { getNationalityFromIp } from '../../../utils/geoIpHelper';

const GENDERS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'];
const RELIGIONS = ['Islam', 'Christianity', 'Hinduism', 'Sikhism', 'Buddhism', 'Other'];
const NATIONALITIES = [
  'Pakistani',
  'Emirati',
  'Saudi',
  'British',
  'American',
  'Canadian',
  'Australian',
  'Turkish',
  'Qatari',
  'Omani',
  'Kuwaiti',
  'Bahraini',
  'Indian',
  'Bangladeshi',
  'Other'
];

const ProfilePersonalFieldsB = ({ formData, onChange }) => {
  useEffect(() => {
    if (!formData.nationality) {
      getNationalityFromIp().then((detected) => {
        if (!formData.nationality && detected) {
          onChange('nationality', detected);
        }
      });
    }
  }, [formData.nationality, onChange]);

  return (
    <>
      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
          Gender
        </label>
        <select
          value={formData.gender || 'Male'}
          onChange={(e) => onChange('gender', e.target.value)}
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary cursor-pointer"
        >
          {GENDERS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Blood Group</span>
          <span className="text-[10px] text-ink-muted lowercase font-normal">(optional)</span>
        </label>
        <select
          value={formData.blood_group || ''}
          onChange={(e) => onChange('blood_group', e.target.value)}
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary cursor-pointer"
        >
          <option value="">Select Blood Group (Optional)</option>
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
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary cursor-pointer"
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
        <select
          value={formData.religion || 'Islam'}
          onChange={(e) => onChange('religion', e.target.value)}
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary cursor-pointer font-medium"
        >
          {RELIGIONS.map((rel) => (
            <option key={rel} value={rel}>{rel}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Nationality</span>
          <span className="text-[10px] text-primary lowercase font-medium">auto (IP)</span>
        </label>
        <div className="relative">
          <input
            type="text"
            list="nationalities-list"
            value={formData.nationality || ''}
            onChange={(e) => onChange('nationality', e.target.value)}
            placeholder="e.g. Pakistani"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
          <datalist id="nationalities-list">
            {NATIONALITIES.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
        </div>
      </div>
    </>
  );
};

export default ProfilePersonalFieldsB;
