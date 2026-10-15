import { Sun, Moon, Check } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const AppearanceModeCard = () => {
  const { themeSettings, updateThemeSetting } = useTheme();
  const currentMode = themeSettings.mode;

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-primary" />
            Appearance Mode
          </h2>
          <p className="text-xs text-ink-sub dark:text-ink-sub-dark mt-0.5">Switch between crisp light mode and deep contrast dark mode</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <button
          type="button"
          onClick={(e) => updateThemeSetting('mode', 'light', e)}
          className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer overflow-hidden ${
            currentMode === 'light'
              ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
              : 'border-line dark:border-line-dark hover:border-primary/40 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40'
          }`}
        >
          {currentMode === 'light' && (
            <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
          )}
          <div className="w-full h-16 rounded-lg bg-white border border-slate-200 p-2 flex flex-col justify-between mb-2.5 shadow-inner">
            <div className="h-2 w-1/3 bg-slate-300 rounded" />
            <div className="flex gap-1.5 h-7">
              <div className="w-5 bg-slate-100 border border-slate-200 rounded" />
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded p-1 flex flex-col justify-between">
                <div className="h-1.5 w-2/3 bg-slate-200 rounded" />
                <div className="h-1.5 w-1/2 bg-primary/30 rounded" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-ink">Light Mode</span>
          </div>
          <p className="text-[11px] text-ink-muted mt-0.5">Clean daylight surfaces with high readability</p>
        </button>

        <button
          type="button"
          onClick={(e) => updateThemeSetting('mode', 'dark', e)}
          className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer overflow-hidden ${
            currentMode === 'dark'
              ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
              : 'border-line dark:border-line-dark hover:border-primary/40 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40'
          }`}
        >
          {currentMode === 'dark' && (
            <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
          )}
          <div className="w-full h-16 rounded-lg bg-[#000000] border border-[#272730] p-2 flex flex-col justify-between mb-2.5 shadow-inner">
            <div className="h-2 w-1/3 bg-[#272730] rounded" />
            <div className="flex gap-1.5 h-7">
              <div className="w-5 bg-[#0c0c0f] border border-[#272730] rounded" />
              <div className="flex-1 bg-[#16161d] border border-[#272730] rounded p-1 flex flex-col justify-between">
                <div className="h-1.5 w-2/3 bg-[#272730] rounded" />
                <div className="h-1.5 w-1/2 bg-primary/40 rounded" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-ink dark:text-ink-dark">Full Black Dark Mode</span>
          </div>
          <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark mt-0.5">Deep OLED contrast surfaces with vivid accents</p>
        </button>
      </div>
    </div>
  );
};

export default AppearanceModeCard;
