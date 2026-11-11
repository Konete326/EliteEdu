import { Wand2, Check, ArrowRight } from 'lucide-react';

const PRESETS = [
  {
    id: 'bise_matric',
    title: 'Matric / FSc Board School',
    badge: 'BISE / Secondary',
    data: {
      board: 'Board of Intermediate & Secondary Education (BISE)',
      slogan: 'Knowledge is Light • علم بڑی دولت ہے',
      currency: 'PKR',
      affiliation_number: 'BISE/REG-8842'
    }
  },
  {
    id: 'cambridge_intl',
    title: 'Cambridge International',
    badge: 'CAIE O/A Levels',
    data: {
      board: 'Cambridge Assessment International Education (CAIE)',
      slogan: 'Strive for Excellence & Integrity',
      currency: 'PKR',
      affiliation_number: 'PK-CAIE-9920'
    }
  },
  {
    id: 'federal_cadet',
    title: 'Federal / Cadet Academy',
    badge: 'FBISE Federal',
    data: {
      board: 'Federal Board of Intermediate & Secondary Education (FBISE)',
      slogan: 'Faith, Unity, Discipline • ایمان، اتحاد، نظم',
      currency: 'PKR',
      affiliation_number: 'FBISE-APS-4102'
    }
  },
  {
    id: 'islamic_model',
    title: 'Islamic Model School',
    badge: 'Wafaq / Board',
    data: {
      board: 'Board of Secondary Education & Wafaq',
      slogan: 'Rabbi Zidni Ilma • رَّبِّ زِدْنِي عِلْمًا',
      currency: 'PKR',
      affiliation_number: 'WUF-MODEL-2024'
    }
  }
];

const SchoolSmartPresetsBar = ({ settings, onApplyPreset, onAutoFormatAll }) => {
  return (
    <div className="bg-surface dark:bg-[#0e0e11] border border-line dark:border-white/10 rounded-2xl p-4 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-line dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center shrink-0">
            <Wand2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ink dark:text-ink-dark flex items-center gap-2">
              <span>One-Click Smart Setup Presets</span>
              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.2 rounded-full">
                Automated
              </span>
            </h3>
            <p className="text-[10px] text-ink-muted">
              Auto-fill standard Pakistani board credentials, motto, and PDF parameters in 1 click
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAutoFormatAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-secondary hover:bg-surface-secondary/80 text-ink dark:text-white border border-line dark:border-white/10 text-xs font-bold transition-all cursor-pointer shrink-0"
        >
          <Wand2 className="w-3.5 h-3.5 text-primary" />
          <span>Auto-Clean & Format</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {PRESETS.map((preset) => {
          const isMatching = settings.board === preset.data.board;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset.data)}
              className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                isMatching
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/30'
                  : 'border-line/70 dark:border-white/10 bg-surface-secondary/40 hover:bg-surface-secondary/80 hover:border-line'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-mono font-bold text-primary">
                  {preset.badge}
                </span>
                {isMatching ? (
                  <Check className="w-3 h-3 text-primary shrink-0" />
                ) : (
                  <ArrowRight className="w-3 h-3 text-ink-muted opacity-60 shrink-0" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-ink dark:text-white truncate">
                  {preset.title}
                </p>
                <p className="text-[10px] text-ink-muted truncate">
                  {preset.data.slogan}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SchoolSmartPresetsBar;
