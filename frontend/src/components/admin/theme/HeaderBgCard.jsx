import { Check, Columns } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { HEADER_BG_PRESETS } from '../../../utils/themeConstants';

const HeaderBgCard = () => {
  const { themeSettings, updateThemeSetting } = useTheme();
  const currentHeaderBg = themeSettings.headerBg || 'white';

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-3.5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5">
            <Columns className="w-3.5 h-3.5 text-primary" />
            Header & Sidebar Theme
          </h2>
          <p className="text-[11px] text-ink-sub dark:text-ink-sub-dark">Auto-synchronizes matching brand accent live</p>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {HEADER_BG_PRESETS.map((preset) => {
          const isSelected = currentHeaderBg === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={(e) => updateThemeSetting('headerBg', preset.id, e)}
              className={`relative p-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
                  : 'border-line dark:border-line-dark hover:border-primary/40 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40'
              }`}
            >
              {isSelected && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2 h-2 stroke-[3]" />
                </span>
              )}
              <div className="w-10 h-7 rounded border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col shadow-2xs bg-white dark:bg-slate-900">
                <div className="h-2 w-full shrink-0" style={{ backgroundColor: preset.previewBg }} />
                <div className="flex-1 flex overflow-hidden">
                  <div className="w-3 h-full shrink-0 border-r border-slate-200/40" style={{ backgroundColor: preset.previewBg }} />
                  <div className="flex-1 p-0.5 flex flex-col justify-between">
                    <div className="h-0.5 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-xs" />
                    <div className="h-0.5 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-xs" />
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-ink dark:text-ink-dark truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full inline-block shrink-0" style={{ backgroundColor: preset.activeColor }} />
                {preset.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeaderBgCard;
