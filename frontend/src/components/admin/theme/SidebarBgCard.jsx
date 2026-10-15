import { Check, Columns } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const SidebarBgCard = () => {
  const { themeSettings, updateThemeSetting } = useTheme();
  const currentSidebarBg = themeSettings.sidebarBg || 'light';

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5">
            <Columns className="w-3.5 h-3.5 text-primary" />
            Sidebar Background
          </h2>
          <p className="text-xs text-ink-sub dark:text-ink-sub-dark mt-0.5">Choose between clean light navigation and contrast dark sidebar</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={(e) => updateThemeSetting('sidebarBg', 'light', e)}
          className={`relative p-5 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
            currentSidebarBg === 'light'
              ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
              : 'border-line dark:border-line-dark hover:border-primary/40 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40'
          }`}
        >
          {currentSidebarBg === 'light' && (
            <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
          )}
          <div className="w-16 h-12 rounded-lg border border-slate-200 overflow-hidden flex shadow-xs">
            <div className="w-5 bg-white border-r border-slate-200 flex flex-col gap-1 p-1">
              <div className="h-1 w-full bg-slate-300 rounded-xs" />
              <div className="h-1 w-3/4 bg-slate-300 rounded-xs" />
              <div className="h-1 w-full bg-primary/40 rounded-xs" />
            </div>
            <div className="flex-1 bg-slate-50" />
          </div>
          <span className="text-xs font-bold text-ink dark:text-ink-dark">Light</span>
        </button>

        <button
          type="button"
          onClick={(e) => updateThemeSetting('sidebarBg', 'dark', e)}
          className={`relative p-5 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
            currentSidebarBg === 'dark'
              ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
              : 'border-line dark:border-line-dark hover:border-primary/40 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40'
          }`}
        >
          {currentSidebarBg === 'dark' && (
            <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
          )}
          <div className="w-16 h-12 rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden flex shadow-xs">
            <div className="w-5 bg-slate-900 border-r border-slate-800 flex flex-col gap-1 p-1">
              <div className="h-1 w-full bg-slate-700 rounded-xs" />
              <div className="h-1 w-3/4 bg-slate-700 rounded-xs" />
              <div className="h-1 w-full bg-primary/60 rounded-xs" />
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-800" />
          </div>
          <span className="text-xs font-bold text-ink dark:text-ink-dark">Dark</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarBgCard;
