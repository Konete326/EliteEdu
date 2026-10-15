import { Languages } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const LANGUAGES = [
  { id: 'English', label: 'English (US)' },
  { id: 'Urdu', label: 'اردو (Urdu)' },
  { id: 'Arabic', label: 'العربية (Arabic)' }
];

const LanguageCard = () => {
  const { themeSettings, updateThemeSetting } = useTheme();

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-primary" />
            Portal Language
          </h2>
          <p className="text-xs text-ink-sub dark:text-ink-sub-dark mt-0.5">Select default administrative and institutional language</p>
        </div>
      </div>

      <div className="max-w-md">
        <select
          value={themeSettings.language || 'English'}
          onChange={(e) => updateThemeSetting('language', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary dark:bg-surface-secondary-dark text-xs font-medium text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageCard;
