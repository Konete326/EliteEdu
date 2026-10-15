import { Check, Paintbrush } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { ACTIVE_COLOR_SWATCHES } from '../../../utils/themeConstants';

const ActiveColorCard = () => {
  const { themeSettings, updateThemeSetting } = useTheme();
  const currentActiveColor = (themeSettings.activeColor || '#0d9488').toLowerCase();

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-3.5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5">
            <Paintbrush className="w-3.5 h-3.5 text-primary" />
            Active Brand Accent
          </h2>
          <p className="text-[11px] text-ink-sub dark:text-ink-sub-dark">Recolors active navigation, primary buttons, and focus rings live</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 p-1">
        {ACTIVE_COLOR_SWATCHES.map((swatch) => {
          const isSelected = currentActiveColor === swatch.hex.toLowerCase();
          return (
            <button
              key={swatch.id}
              type="button"
              onClick={(e) => updateThemeSetting('activeColor', swatch.hex, e)}
              title={`${swatch.name} (${swatch.hex})`}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs hover:scale-115 active:scale-95 ${
                isSelected ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:shadow-sm'
              }`}
              style={{ backgroundColor: swatch.hex }}
            >
              {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3] drop-shadow-xs" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveColorCard;
