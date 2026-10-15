import { useState } from 'react';
import { Eye, Check, ChevronRight, Bell, Sparkles } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { getActiveColorMeta } from '../../../utils/themeConstants';

const ThemeLivePreviewCard = () => {
  const { themeSettings } = useTheme();
  const [toggleOn, setToggleOn] = useState(true);
  const colorMeta = getActiveColorMeta(themeSettings.activeColor);

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-5 shadow-xs transition-colors sticky top-20 space-y-5">
      <div className="flex items-center justify-between border-b border-line dark:border-line-dark pb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark">Live Component Preview</h2>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-primary-soft text-primary uppercase">
          {colorMeta.name}
        </span>
      </div>

      <div className="space-y-3">
        <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block">Interactive Buttons</span>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-primary-hover transition-colors">
            Primary Solid
          </button>
          <button type="button" className="px-3.5 py-1.5 rounded-xl bg-primary-soft text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">
            Soft Accent
          </button>
          <button type="button" className="px-3.5 py-1.5 rounded-xl border border-primary text-primary text-xs font-semibold hover:bg-primary-soft transition-colors">
            Outline
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block">Navigation & Badges</span>
        <div className="space-y-1.5 p-2 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold shadow-xs">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Active Navigation Item
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg text-ink-sub dark:text-ink-sub-dark text-xs font-medium hover:bg-surface dark:hover:bg-surface-dark transition-colors">
            <span className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-ink-muted" /> Standard Inactive Item
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-soft text-primary font-bold">12</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">Accent Toggle</span>
          <button
            type="button"
            onClick={() => setToggleOn(!toggleOn)}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
              toggleOn ? 'bg-primary' : 'bg-line dark:bg-line-dark'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${toggleOn ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-line dark:border-line-dark text-[11px] text-ink-muted space-y-1">
        <div className="flex justify-between">
          <span>Mode / Dir:</span>
          <span className="font-semibold text-ink dark:text-ink-dark capitalize">{themeSettings.mode} • {themeSettings.placement?.toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span>Header & Sidebar:</span>
          <span className="font-semibold text-ink dark:text-ink-dark capitalize">{themeSettings.headerBg}</span>
        </div>
        <div className="flex justify-between">
          <span>Active Swatch:</span>
          <span className="font-mono font-semibold text-primary">{colorMeta.hex}</span>
        </div>
      </div>
    </div>
  );
};

export default ThemeLivePreviewCard;
