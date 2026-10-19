import { Building2, Award, Hash, Calendar, DollarSign, Lock, Building } from 'lucide-react';
import SchoolInfoInput from './SchoolInfoInput';

const SchoolBasicInfoCard = ({ settings, onChange }) => {
  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-4 shadow-xs space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-white/10">
        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center shrink-0">
          <Building2 className="w-3.5 h-3.5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-ink dark:text-ink-dark">Institutional Information</h3>
          <p className="text-[10px] text-ink-muted">Registered name and official recognition details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-semibold text-ink-sub dark:text-ink-sub-dark mb-0.5">
            School / Institution Name <span className="text-bad">*</span>
          </label>
          <input
            type="text"
            value={settings.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Elite Edu Higher Secondary School"
            className="w-full px-3 py-1.5 rounded-lg text-xs bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary font-semibold"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-ink-sub dark:text-ink-sub-dark mb-0.5">
            School Code (Permanent)
          </label>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-secondary/70 dark:bg-[#141414] border border-line/60 dark:border-white/5 text-ink-muted">
            <Hash className="w-3.5 h-3.5 text-ink-muted" />
            <span className="font-mono font-bold text-xs text-ink dark:text-ink-dark">{settings.code || 'SCH-001'}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-0.5">
            <label className="block text-[11px] font-semibold text-ink-sub dark:text-ink-sub-dark">
              School Type
            </label>
            <span className="text-[9px] font-semibold text-ink-muted flex items-center gap-0.5">
              <Lock className="w-2.5 h-2.5" />
              <span>SuperAdmin</span>
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-surface-secondary/70 dark:bg-[#141414] border border-line/60 dark:border-white/5 text-ink-muted">
            <div className="flex items-center gap-1.5 truncate">
              <Building className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="font-bold text-xs text-ink dark:text-ink-dark truncate">
                {settings.school_type || 'Private'}
              </span>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border shrink-0 ${
              settings.school_type === 'Government'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            }`}>
              {settings.school_type === 'Government' ? 'Govt' : 'Private'}
            </span>
          </div>
        </div>

        <SchoolInfoInput
          label="Education Board"
          value={settings.board}
          onChange={(val) => onChange('board', val)}
          placeholder="e.g. BSEK Karachi / Cambridge"
          icon={Award}
        />

        <SchoolInfoInput
          label="Affiliation / Reg No."
          value={settings.affiliation_number}
          onChange={(val) => onChange('affiliation_number', val)}
          placeholder="e.g. REG-8842"
          mono
        />

        <SchoolInfoInput
          label="Established Year"
          value={settings.established_year}
          onChange={(val) => onChange('established_year', val)}
          placeholder="e.g. 1998"
          icon={Calendar}
        />

        <SchoolInfoInput
          label="Default Currency"
          value={settings.currency || 'PKR'}
          onChange={(val) => onChange('currency', val)}
          placeholder="e.g. PKR / Rs."
          icon={DollarSign}
        />
      </div>
    </div>
  );
};

export default SchoolBasicInfoCard;
