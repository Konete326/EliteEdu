import { Languages, Check, Globe } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const LANGUAGES = [
  {
    id: 'English',
    title: 'English (US)',
    native: 'English (US)',
    desc: 'Standard administrative Latin typography and LTR numerals',
    badge: 'EN'
  },
  {
    id: 'Urdu',
    title: 'Urdu (اردو)',
    native: 'اردو',
    desc: 'National language Nastaliq calligraphy and localized terms',
    badge: 'UR'
  },
  {
    id: 'Arabic',
    title: 'Arabic (العربية)',
    native: 'العربية',
    desc: 'Right-to-Left liturgical and administrative script layout',
    badge: 'AR'
  }
];

const LanguageCard = () => {
  const { themeSettings, updateThemeSetting } = useTheme();
  const currentLang = themeSettings.language || 'English';

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-primary" />
            Portal Language
          </h2>
          <p className="text-xs text-ink-sub dark:text-ink-sub-dark mt-0.5">
            Select default administrative and institutional language
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-primary-soft text-primary uppercase">
          {currentLang}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {LANGUAGES.map((lang) => {
          const isSelected = currentLang === lang.id;
          return (
            <button
              key={lang.id}
              type="button"
              onClick={(e) => updateThemeSetting('language', lang.id, e)}
              className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
                  : 'border-line dark:border-line-dark hover:border-primary/40 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40'
              }`}
            >
              {isSelected && (
                <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-surface dark:bg-surface-dark border border-line dark:border-line-dark flex items-center justify-center font-bold text-[11px] text-primary shrink-0 shadow-2xs">
                  {lang.badge}
                </div>
                <div className="min-w-0 pr-4">
                  <span className="text-xs font-bold text-ink dark:text-ink-dark block truncate">
                    {lang.title}
                  </span>
                  <span className="text-[11px] font-medium text-ink-muted dark:text-ink-muted-dark block">
                    {lang.native}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-ink-sub dark:text-ink-sub-dark leading-snug">
                {lang.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageCard;
