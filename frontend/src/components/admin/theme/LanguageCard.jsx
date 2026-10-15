import { Languages, Check } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const LANGUAGES = [
  {
    id: 'English',
    title: 'English (US)',
    native: 'English (US)',
    desc: 'Default administrative Latin typography',
    badge: 'EN'
  },
  {
    id: 'Urdu',
    title: 'Urdu',
    native: 'اردو',
    desc: 'National language Nastaliq calligraphy and localized terms',
    badge: 'UR'
  },
  {
    id: 'Arabic',
    title: 'Arabic',
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

      <div className="space-y-2.5">
        {LANGUAGES.map((lang) => {
          const isSelected = currentLang === lang.id;
          return (
            <button
              key={lang.id}
              type="button"
              onClick={(e) => updateThemeSetting('language', lang.id, e)}
              className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
                  : 'border-line dark:border-line-dark hover:border-primary/40 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-surface dark:bg-surface-dark border border-line dark:border-line-dark flex items-center justify-center font-bold text-xs text-primary shrink-0 shadow-2xs">
                  {lang.badge}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink dark:text-ink-dark truncate">
                      {lang.title}
                    </span>
                    <span className="text-[11px] font-medium text-ink-muted dark:text-ink-muted-dark">
                      ({lang.native})
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-sub dark:text-ink-sub-dark truncate">
                    {lang.desc}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                {isSelected ? (
                  <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-line dark:border-line-dark" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageCard;
