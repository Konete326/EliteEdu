import { Check, Paintbrush } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { ACTIVE_COLOR_SWATCHES } from '../../../utils/themeConstants';

const ActiveColorCard = () => {
  const { themeSettings, updateThemeSetting } = useTheme();
  const currentActiveColor = (themeSettings.activeColor || '#0d9488').toLowerCase();

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5">
            <Paintbrush className="w-3.5 h-3.5 text-primary" />
            Active Item Background (Accent Color)
          </h2>
          <p className="text-xs text-ink-sub dark:text-ink-sub-dark mt-0.5">
            Select portal brand color — recolors active navigation, primary buttons, badges, and focus rings live
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 p-2">
        {ACTIVE_COLOR_SWATCHES.map((swatch) => {
          const isSelected = currentActiveColor === swatch.hex.toLowerCase();
          return (
            <button
              key={swatch.id}
              type="button"
              onClick={(e) => updateThemeSetting('activeColor', swatch.hex, e)}
              title={`${swatch.name} (${swatch.hex})`}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-115 active:scale-95 ${
                isSelected ? 'ring-3 ring-offset-2 ring-primary scale-110' : 'hover:shadow-md'
              }`}
              style={{ backgroundColor: swatch.hex }}
            >
              {isSelected && <Check className="w-4 h-4 text-white stroke-[3] drop-shadow-xs" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveColorCard;
