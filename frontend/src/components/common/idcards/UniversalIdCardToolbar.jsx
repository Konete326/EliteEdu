import UniversalIdCardToolbarActions from './UniversalIdCardToolbarActions';

const TEMPLATES = [
  { id: 'template_1_curve_blue', label: 'T1: Blue Curve' },
  { id: 'template_2_gold_blue', label: 'T2: Blue & Gold' },
  { id: 'template_3_wave_ribbon', label: 'T3: Wave Ribbon' },
  { id: 'template_4_apwa_classic', label: 'T4: APWA Classic' },
];

const COLORS = ['#003B73', '#0284C7', '#059669', '#E11D48', '#EA580C', '#7C3AED'];

const UniversalIdCardToolbar = ({
  template = 'template_1_curve_blue',
  onTemplateChange,
  orientation = 'vertical',
  onOrientationChange,
  accentColor = '#0284C7',
  onAccentColorChange,
  sideMode = 'front',
  onSideModeChange,
  ...actionProps
}) => {
  return (
    <div className="print:hidden space-y-3 bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark p-4 rounded-2xl shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onTemplateChange(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                template === t.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-surface-secondary text-ink-muted hover:text-ink hover:bg-surface-secondary/80'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-secondary p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => onOrientationChange('vertical')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                orientation === 'vertical' ? 'bg-surface dark:bg-[#1e1e24] text-ink font-bold shadow-sm' : 'text-ink-muted'
              }`}
            >
              Vertical (3/A4)
            </button>
            <button
              onClick={() => onOrientationChange('horizontal')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                orientation === 'horizontal' ? 'bg-surface dark:bg-[#1e1e24] text-ink font-bold shadow-sm' : 'text-ink-muted'
              }`}
            >
              Horizontal (6/A4)
            </button>
          </div>

          <div className="flex items-center bg-surface-secondary p-1 rounded-lg text-xs font-medium">
            {['front', 'back', 'both'].map((m) => (
              <button
                key={m}
                onClick={() => onSideModeChange(m)}
                className={`px-2.5 py-1 capitalize rounded-md transition-all ${
                  sideMode === m ? 'bg-surface dark:bg-[#1e1e24] font-bold text-ink shadow-sm' : 'text-ink-muted'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 pl-2 border-l border-line">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onAccentColorChange(c)}
                style={{ backgroundColor: c }}
                className={`w-5 h-5 rounded-full transition-transform ${
                  accentColor === c ? 'scale-125 ring-2 ring-offset-1 ring-blue-500' : 'opacity-80 hover:opacity-100'
                }`}
              />
            ))}
            <label className="relative flex items-center justify-center w-5 h-5 rounded-full cursor-pointer overflow-hidden border border-line shadow-2xs hover:scale-110 transition-transform" title="Custom Color">
              <input
                type="color"
                value={accentColor || '#003B73'}
                onChange={(e) => onAccentColorChange(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
              <span className="w-full h-full" style={{ backgroundColor: accentColor }} />
            </label>
          </div>
        </div>
      </div>

      <UniversalIdCardToolbarActions {...actionProps} />
    </div>
  );
};

export default UniversalIdCardToolbar;
