import { Sun, Moon, Check } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const AppearanceModeCard = () => {
  const { themeSettings, updateThemeSetting } = useTheme();
  const currentMode = themeSettings.mode;

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-3.5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-primary" />
            Appearance Mode
          </h2>
          <p className="text-[11px] text-ink-sub dark:text-ink-sub-dark">Switch between crisp daylight and deep OLED dark mode</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={(e) => updateThemeSetting('mode', 'light', e)}
          className={`relative p-2.5 rounded-xl border text-left transition-all cursor-pointer overflow-hidden ${
            currentMode === 'light'
              ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
              : 'border-line dark:border-line-dark hover:border-primary/40 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40'
          }`}
        >
          {currentMode === 'light' && (
            <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          )}
          <div className="w-full h-10 rounded-md bg-white border border-slate-200 p-1.5 flex flex-col justify-between mb-2 shadow-inner">
            <div className="h-1.5 w-1/3 bg-slate-300 rounded" />
            <div className="flex gap-1 h-4">
              <div className="w-3 bg-slate-100 border border-slate-200 rounded" />
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded px-1 py-0.5 flex flex-col justify-between">
                <div className="h-1 w-2/3 bg-slate-200 rounded" />
                <div className="h-1 w-1/2 bg-primary/30 rounded" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold text-ink">Light Mode</span>
          </div>
          <p className="text-[10px] text-ink-muted mt-0.5">Daylight high readability</p>
        </button>

        <button
          type="button"
          onClick={(e) => updateThemeSetting('mode', 'dark', e)}
          className={`relative p-2.5 rounded-xl border text-left transition-all cursor-pointer overflow-hidden ${
            currentMode === 'dark'
              ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
              : 'border-line dark:border-line-dark hover:border-primary/40 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40'
          }`}
        >
          {currentMode === 'dark' && (
            <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          )}
          <div className="w-full h-10 rounded-md bg-[#000000] border border-[#272730] p-1.5 flex flex-col justify-between mb-2 shadow-inner">
            <div className="h-1.5 w-1/3 bg-[#272730] rounded" />
            <div className="flex gap-1 h-4">
              <div className="w-3 bg-[#0c0c0f] border border-[#272730] rounded" />
              <div className="flex-1 bg-[#16161d] border border-[#272730] rounded px-1 py-0.5 flex flex-col justify-between">
                <div className="h-1 w-2/3 bg-[#272730] rounded" />
                <div className="h-1 w-1/2 bg-primary/40 rounded" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-ink dark:text-ink-dark">OLED Dark</span>
          </div>
          <p className="text-[10px] text-ink-muted dark:text-ink-muted-dark mt-0.5">Deep contrast surfaces</p>
        </button>
      </div>
    </div>
  );
};

export default AppearanceModeCard;
