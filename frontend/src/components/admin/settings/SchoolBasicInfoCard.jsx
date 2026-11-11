import { Building2, Award, Hash, Calendar, DollarSign, Lock, Building, Wand2 } from 'lucide-react';
import SchoolInfoInput from './SchoolInfoInput';

const BOARD_SUGGESTIONS = [
  'BSEK Karachi',
  'FBISE Islamabad',
  'CAIE Cambridge',
  'BISE Lahore',
  'Aga Khan Board (AKU-EB)'
];

const CURRENCY_SUGGESTIONS = ['PKR', 'USD', 'AED', 'GBP'];

const SchoolBasicInfoCard = ({ settings, onChange }) => {
  const generateCodeFromName = () => {
    if (!settings.name) return;
    const words = settings.name.trim().split(/\s+/);
    const initials = words.map((w) => w[0]).join('').toUpperCase().slice(0, 5);
    onChange('code', `${initials || 'SCH'}-01`);
  };

  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-ink dark:text-ink-dark">
              Institutional Information &amp; Board
            </h3>
            <p className="text-[10px] text-ink-muted">
              Official registered school name, board affiliation, and operational currency
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            School / Institution Full Name <span className="text-bad">*</span>
          </label>
          <input
            type="text"
            value={settings.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Elite Edu Higher Secondary School"
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary font-bold"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-semibold text-ink-sub dark:text-ink-sub-dark">
              School Code
            </label>
            {!settings.code && settings.name && (
              <button
                type="button"
                onClick={generateCodeFromName}
                className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Wand2 className="w-2.5 h-2.5" />
                <span>Auto-Code</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line/60 dark:border-white/5 text-ink-muted">
            <Hash className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono font-bold text-xs text-ink dark:text-ink-dark truncate">
              {settings.code || 'SCH-001'}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-semibold text-ink-sub dark:text-ink-sub-dark">
              School Type
            </label>
            <span className="text-[9px] font-semibold text-ink-muted flex items-center gap-0.5">
              <Lock className="w-2.5 h-2.5" />
              <span>SuperAdmin</span>
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line/60 dark:border-white/5 text-ink-muted">
            <div className="flex items-center gap-1.5 truncate">
              <Building className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="font-bold text-xs text-ink dark:text-ink-dark truncate">
                {settings.school_type || 'Private'}
              </span>
            </div>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${
                settings.school_type === 'Government'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              }`}
            >
              {settings.school_type === 'Government' ? 'Govt' : 'Private'}
            </span>
          </div>
        </div>

        <div className="sm:col-span-2">
          <SchoolInfoInput
            label="Education Board"
            value={settings.board}
            onChange={(val) => onChange('board', val)}
            placeholder="e.g. BSEK Karachi / Federal Board"
            icon={Award}
          />
          <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
            <span className="text-[10px] text-ink-muted font-medium">Suggestions:</span>
            {BOARD_SUGGESTIONS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => onChange('board', b)}
                className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                  settings.board === b
                    ? 'bg-primary text-white border-primary font-bold'
                    : 'bg-surface-secondary/50 dark:bg-[#161616] border-line/70 dark:border-white/10 text-ink dark:text-ink-dark hover:border-primary/50'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

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

        <div>
          <SchoolInfoInput
            label="Operational Currency"
            value={settings.currency || 'PKR'}
            onChange={(val) => onChange('currency', val)}
            placeholder="e.g. PKR"
            icon={DollarSign}
          />
          <div className="flex items-center gap-1 mt-1.5">
            {CURRENCY_SUGGESTIONS.map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => onChange('currency', curr)}
                className={`text-[10px] px-2 py-0.5 rounded-md border font-mono transition-all cursor-pointer ${
                  (settings.currency || 'PKR') === curr
                    ? 'bg-primary text-white border-primary font-bold'
                    : 'bg-surface-secondary/50 dark:bg-[#161616] border-line/70 dark:border-white/10 text-ink dark:text-ink-dark hover:border-primary/50'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolBasicInfoCard;
