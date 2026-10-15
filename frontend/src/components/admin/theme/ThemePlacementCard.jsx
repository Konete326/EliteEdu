import { Check, AlignLeft, AlignRight, ArrowLeftRight } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const ThemePlacementCard = () => {
  const { themeSettings, updateThemeSetting } = useTheme();
  const currentPlacement = themeSettings.placement || 'ltr';

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5">
            <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />
            Theme Placement
          </h2>
          <p className="text-xs text-ink-sub dark:text-ink-sub-dark mt-0.5">Control layout direction for Left-to-Right or Right-to-Left scripts</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={(e) => updateThemeSetting('placement', 'ltr', e)}
          className={`relative p-5 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
            currentPlacement === 'ltr'
              ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
              : 'border-line dark:border-line-dark hover:border-primary/40 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40'
          }`}
        >
          {currentPlacement === 'ltr' && (
            <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
          )}
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
            <AlignLeft className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-ink dark:text-ink-dark">LTR</span>
        </button>

        <button
          type="button"
          onClick={(e) => updateThemeSetting('placement', 'rtl', e)}
          className={`relative p-5 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
            currentPlacement === 'rtl'
              ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
              : 'border-line dark:border-line-dark hover:border-primary/40 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40'
          }`}
        >
          {currentPlacement === 'rtl' && (
            <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
          )}
          <div className="w-12 h-12 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark text-ink-sub dark:text-ink-sub-dark border border-line dark:border-line-dark flex items-center justify-center">
            <AlignRight className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-ink dark:text-ink-dark">RTL</span>
        </button>
      </div>
    </div>
  );
};

export default ThemePlacementCard;
