import { useState } from 'react';
import { Eye, ChevronRight, Bell, Sparkles } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { getActiveColorMeta } from '../../../utils/themeConstants';

const ThemeLivePreviewCard = () => {
  const { themeSettings } = useTheme();
  const [toggleOn, setToggleOn] = useState(true);
  const colorMeta = getActiveColorMeta(themeSettings.activeColor);

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-3.5 shadow-xs transition-colors space-y-3">
      <div className="flex items-center justify-between border-b border-line dark:border-line-dark pb-2">
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark">Live Preview</h2>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-primary-soft text-primary uppercase">
          {colorMeta.name}
        </span>
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block">Buttons</span>
        <div className="flex flex-wrap items-center gap-1.5">
          <button type="button" className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-semibold shadow-2xs hover:bg-primary-hover transition-colors">
            Primary Solid
          </button>
          <button type="button" className="px-2.5 py-1 rounded-lg bg-primary-soft text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">
            Soft Accent
          </button>
          <button type="button" className="px-2.5 py-1 rounded-lg border border-primary text-primary text-xs font-semibold hover:bg-primary-soft transition-colors">
            Outline
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block">Active Navigation</span>
        <div className="space-y-1 p-1.5 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold shadow-2xs">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Active Item
            </span>
            <ChevronRight className="w-3 h-3" />
          </div>
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-ink-sub dark:text-ink-sub-dark text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Bell className="w-3 h-3 text-ink-muted" /> Inactive Item
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary-soft text-primary font-bold">12</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-0.5">
        <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Accent Toggle</span>
        <button
          type="button"
          onClick={() => setToggleOn(!toggleOn)}
          className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 ${
            toggleOn ? 'bg-primary' : 'bg-line dark:bg-line-dark'
          }`}
        >
          <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform duration-200 ${toggleOn ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
      </div>

      <div className="pt-2 border-t border-line dark:border-line-dark text-[10px] text-ink-muted space-y-0.5">
        <div className="flex justify-between">
          <span>Mode / Direction:</span>
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
