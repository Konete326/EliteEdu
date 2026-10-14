import { Upload } from 'lucide-react';

const BasicIdentityFields = ({ formData, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-line dark:border-line-dark flex flex-col items-center justify-center text-ink-muted hover:border-primary/50 cursor-pointer overflow-hidden bg-surface-secondary/40 shrink-0">
          {formData.photo_url ? (
            <img src={formData.photo_url} alt="Staff" className="w-full h-full object-cover" />
          ) : (
            <>
              <Upload className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-semibold text-center leading-tight">Click/drag<br />Max 5MB</span>
            </>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
          <div>
            <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Name *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Full name"
              required
              className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Father Name</label>
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
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Surname</label>
          <input
            type="text"
            value={formData.surname || ''}
            onChange={(e) => onChange('surname', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Spouse Name</label>
          <input
            type="text"
            value={formData.spouse_name || ''}
            onChange={(e) => onChange('spouse_name', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Employee Code</label>
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
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Gender</label>
          <select
            value={formData.gender || 'Male'}
            onChange={(e) => onChange('gender', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Date of Birth</label>
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
