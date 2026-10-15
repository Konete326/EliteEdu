import { User } from 'lucide-react';
import AvatarUploadField from '../../../common/AvatarUploadField';

const StudentBasicIdentityCard = ({ formData, onChange }) => {
  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
      <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
        <User className="w-4 h-4 text-primary" />
        <span>Basic Student Identity</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <AvatarUploadField
          value={formData.photo_url || ''}
          onChange={(val) => onChange('photo_url', val)}
          label="Student Photo"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 flex-1 w-full text-xs">
          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Full Name <span className="text-bad">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="e.g. Muhammad Ali"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Father Name <span className="text-bad">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.father_name || ''}
              onChange={(e) => onChange('father_name', e.target.value)}
              placeholder="e.g. Tariq Mehmood"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">Surname / Caste</label>
            <input
              type="text"
              value={formData.surname || ''}
              onChange={(e) => onChange('surname', e.target.value)}
              placeholder="e.g. Khan, Sheikh"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">Gender</label>
            <select
              value={formData.gender || 'Male'}
              onChange={(e) => onChange('gender', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark outline-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">Date of Birth</label>
            <input
              type="date"
              value={formData.dob || ''}
              onChange={(e) => onChange('dob', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">B-Form / CNIC No.</label>
            <input
              type="text"
              value={formData.b_form || ''}
              onChange={(e) => onChange('b_form', e.target.value)}
              placeholder="42101-1234567-1"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark outline-none font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentBasicIdentityCard;
