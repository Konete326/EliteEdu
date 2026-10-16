import { Building2, Award, Hash, Calendar, DollarSign } from 'lucide-react';

const SchoolBasicInfoCard = ({ settings, onChange }) => {
  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-line dark:border-white/10">
        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Institutional Information</h3>
          <p className="text-[11px] text-ink-muted">Registered name and official recognition details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            School / Institution Name <span className="text-bad">*</span>
          </label>
          <input
            type="text"
            value={settings.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Elite Edu Higher Secondary School"
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-1 focus:ring-primary font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            School Code (Permanent)
          </label>
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line/60 dark:border-white/5 text-ink-muted">
            <Hash className="w-4 h-4 text-ink-muted" />
            <span className="font-mono font-bold text-xs text-ink dark:text-ink-dark">{settings.code || 'SCH-001'}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            School Type
          </label>
          <select
            value={settings.school_type || 'Private'}
            onChange={(e) => onChange('school_type', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary cursor-pointer"
          >
            <option value="Private">Private Institution</option>
            <option value="Government">Government / Public Institution</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Education Board / Directorate
          </label>
          <div className="relative">
            <input
              type="text"
              value={settings.board || ''}
              onChange={(e) => onChange('board', e.target.value)}
              placeholder="e.g. BSEK Karachi / BISE / Cambridge"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
            <Award className="w-3.5 h-3.5 text-ink-muted absolute right-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Affiliation / Reg / SEMIS No.
          </label>
          <input
            type="text"
            value={settings.affiliation_number || ''}
            onChange={(e) => onChange('affiliation_number', e.target.value)}
            placeholder="e.g. 408110114 / REG-8842"
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Established Year
          </label>
          <div className="relative">
            <input
              type="text"
              value={settings.established_year || ''}
              onChange={(e) => onChange('established_year', e.target.value)}
              placeholder="e.g. 1998"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
            <Calendar className="w-3.5 h-3.5 text-ink-muted absolute right-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Default Currency
          </label>
          <div className="relative">
            <input
              type="text"
              value={settings.currency || 'PKR'}
              onChange={(e) => onChange('currency', e.target.value)}
              placeholder="e.g. PKR / Rs."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
            <DollarSign className="w-3.5 h-3.5 text-ink-muted absolute right-3.5 top-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolBasicInfoCard;
