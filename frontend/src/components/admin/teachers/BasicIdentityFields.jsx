import AvatarUploadField from '../../common/AvatarUploadField';

const BasicIdentityFields = ({ formData, errors = {}, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <AvatarUploadField
          value={formData.photo_url || ''}
          onChange={(val) => onChange('photo_url', val)}
          label="Staff Photo"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
          <div>
            <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">
              Full Name <span className="text-bad">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Full name"
              required
              className={`w-full px-3 py-1.5 rounded-xl border text-xs text-ink dark:text-ink-dark outline-none transition-all ${
                errors.name
                  ? 'border-bad ring-2 ring-bad/20 bg-bad/5'
                  : 'border-line dark:border-line-dark bg-surface-secondary/40 focus:ring-1 focus:ring-primary'
              }`}
            />
            {errors.name && <p className="text-[10px] text-bad font-semibold mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Father Name (Optional)</label>
            <input
              type="text"
              value={formData.father_name || ''}
              onChange={(e) => onChange('father_name', e.target.value)}
              placeholder="Father's name"
              className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Surname (Optional)</label>
          <input
            type="text"
            value={formData.surname || ''}
            onChange={(e) => onChange('surname', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Spouse Name (Optional)</label>
          <input
            type="text"
            value={formData.spouse_name || ''}
            onChange={(e) => onChange('spouse_name', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Employee Code (Optional)</label>
          <input
            type="text"
            value={formData.employee_code || ''}
            onChange={(e) => onChange('employee_code', e.target.value)}
            placeholder="EMP001 (auto if blank)"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Gender (Optional)</label>
          <select
            value={formData.gender || 'Male'}
            onChange={(e) => onChange('gender', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none cursor-pointer"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Date of Birth (Optional)</label>
          <input
            type="date"
            value={formData.dob ? formData.dob.slice(0, 10) : ''}
            onChange={(e) => onChange('dob', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicIdentityFields;
