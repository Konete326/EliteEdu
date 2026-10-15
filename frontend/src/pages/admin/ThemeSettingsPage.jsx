import { useState } from 'react';
import { Palette, Check, RefreshCw, Sun, Moon } from 'lucide-react';
import ThemeTransition from '../../components/common/ThemeTransition';

const COLOR_PRESETS = [
  { name: 'Indigo Dream', primary: '#635bff', hover: '#4e45e5', soft: 'rgba(99,91,255,0.1)' },
  { name: 'Emerald Forest', primary: '#10b981', hover: '#059669', soft: 'rgba(16,185,129,0.1)' },
  { name: 'Ocean Cyan', primary: '#0ea5e9', hover: '#0284c7', soft: 'rgba(14,165,233,0.1)' },
  { name: 'Crimson Rose', primary: '#f43f5e', hover: '#e11d48', soft: 'rgba(244,63,94,0.1)' },
  { name: 'Amber Sunset', primary: '#f59e0b', hover: '#d97706', soft: 'rgba(245,158,11,0.1)' },
  { name: 'Royal Purple', primary: '#8b5cf6', hover: '#7c3aed', soft: 'rgba(139,92,246,0.1)' }
];

const ThemeSettingsPage = () => {
  const [selectedColor, setSelectedColor] = useState('#635bff');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const applyPreset = (preset) => {
    setSelectedColor(preset.primary);
    setIsTransitioning(true);
    setTimeout(() => setIsClosed(true), 50);

    setTimeout(() => {
      document.documentElement.style.setProperty('--primary', preset.primary);
      document.documentElement.style.setProperty('--primary-hover', preset.hover);
      document.documentElement.style.setProperty('--primary-soft', preset.soft);
      localStorage.setItem('elite_theme_primary', preset.primary);
      setIsClosed(false);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 400);
  };

  const resetDefaultTheme = () => {
    applyPreset(COLOR_PRESETS[0]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <ThemeTransition isAnimating={isTransitioning} isClosed={isClosed} />

      <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark flex items-center justify-center shrink-0">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-ink dark:text-ink-dark">Theme & Branding Settings</h1>
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Customize institutional accent palette with instant live preview</p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetDefaultTheme}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-line dark:border-line-dark hover:bg-surface-secondary text-xs font-semibold text-ink-sub transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Default</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COLOR_PRESETS.map((p) => {
          const isSelected = selectedColor === p.primary;
          return (
            <div
              key={p.name}
              onClick={() => applyPreset(p)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer bg-surface dark:bg-[#0c0c0f] ${
                isSelected ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-line dark:border-line-dark hover:border-primary/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-ink dark:text-ink-dark">{p.name}</span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: p.primary }} />
                <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: p.hover }} />
                <div className="flex-1 px-3 py-1.5 rounded-lg bg-surface-secondary text-[11px] font-mono text-ink-muted">
                  {p.primary}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSettingsPage;
