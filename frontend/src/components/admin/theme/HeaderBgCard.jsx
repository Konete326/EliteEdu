import { Check, CreditCard } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { HEADER_BG_PRESETS } from '../../../utils/themeConstants';

const HeaderBgCard = () => {
  const { themeSettings, updateThemeSetting } = useTheme();
  const currentHeaderBg = themeSettings.headerBg || 'white';

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-primary" />
            Header Background
          </h2>
          <p className="text-xs text-ink-sub dark:text-ink-sub-dark mt-0.5">Customize portal top navigation color accent and identity</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {HEADER_BG_PRESETS.map((preset) => {
          const isSelected = currentHeaderBg === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={(e) => updateThemeSetting('headerBg', preset.id, e)}
              className={`relative p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
                  : 'border-line dark:border-line-dark hover:border-primary/40 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40'
              }`}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
              <div className="w-14 h-10 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col shadow-xs bg-white dark:bg-slate-900">
                <div className="h-3 w-full" style={{ backgroundColor: preset.previewBg }} />
                <div className="flex-1 p-1 flex items-center gap-1">
                  <div className="h-1 w-2 bg-slate-300 dark:bg-slate-700 rounded-xs" />
                  <div className="h-1 flex-1 bg-slate-200 dark:bg-slate-800 rounded-xs" />
                </div>
              </div>
              <span className="text-xs font-semibold text-ink dark:text-ink-dark truncate">{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeaderBgCard;
