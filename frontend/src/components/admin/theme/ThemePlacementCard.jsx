import { Check, AlignLeft, AlignRight, ArrowLeftRight } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const ThemePlacementCard = () => {
  const { themeSettings, updateThemeSetting } = useTheme();
  const currentPlacement = themeSettings.placement || 'ltr';

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-3.5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5">
            <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />
            Theme Placement
          </h2>
          <p className="text-[11px] text-ink-sub dark:text-ink-sub-dark">Layout direction for Latin vs RTL scripts</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={(e) => updateThemeSetting('placement', 'ltr', e)}
          className={`relative p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
            currentPlacement === 'ltr'
              ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
              : 'border-line dark:border-line-dark hover:border-primary/40 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40'
          }`}
        >
          {currentPlacement === 'ltr' && (
            <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          )}
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-2xs shrink-0">
            <AlignLeft className="w-4 h-4" />
          </div>
          <div className="min-w-0 text-left">
            <span className="text-xs font-bold text-ink dark:text-ink-dark block">LTR</span>
            <span className="text-[10px] text-ink-muted truncate block">Left to Right</span>
          </div>
        </button>

        <button
          type="button"
          onClick={(e) => updateThemeSetting('placement', 'rtl', e)}
          className={`relative p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
            currentPlacement === 'rtl'
              ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
              : 'border-line dark:border-line-dark hover:border-primary/40 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40'
          }`}
        >
          {currentPlacement === 'rtl' && (
            <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          )}
          <div className="w-8 h-8 rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark text-ink-sub dark:text-ink-sub-dark border border-line dark:border-line-dark flex items-center justify-center shrink-0">
            <AlignRight className="w-4 h-4" />
          </div>
          <div className="min-w-0 text-left">
            <span className="text-xs font-bold text-ink dark:text-ink-dark block">RTL</span>
            <span className="text-[10px] text-ink-muted truncate block">Right to Left</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ThemePlacementCard;
