import React from 'react';
import { Palette, RectangleHorizontal, RectangleVertical } from 'lucide-react';
import { STYLE_OPTIONS, normalizeDesignStyle } from './CertificateDesigns';

const CertificateStyleOrientationPicker = ({
  style = 'academic_gold_hatch',
  orientation = 'landscape',
  onStyleChange,
  onOrientationChange
}) => {
  const norm = normalizeDesignStyle(style);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-ink-muted uppercase flex items-center gap-1.5">
          <Palette size={13} className="text-primary" /> Certificate Design Style *
        </label>
        <div className="flex items-center gap-1 bg-surface-secondary/70 p-0.5 rounded-xl border border-line">
          <button
            type="button"
            onClick={() => onOrientationChange('landscape')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              orientation === 'landscape' ? 'bg-primary text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
            }`}
          >
            <RectangleHorizontal size={13} />
            <span>Landscape</span>
          </button>
          <button
            type="button"
            onClick={() => onOrientationChange('portrait')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              orientation === 'portrait' ? 'bg-primary text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
            }`}
          >
            <RectangleVertical size={13} />
            <span>Portrait</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {STYLE_OPTIONS.map((st) => {
          const isSelected = norm === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onStyleChange(st.id)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20 shadow-xs'
                  : 'border-line hover:border-slate-400 bg-surface dark:bg-surface-dark'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: st.color }} />
                <span className={`text-xs font-bold truncate ${isSelected ? 'text-primary' : 'text-ink'}`}>
                  {st.label}
                </span>
              </div>
              <p className="text-[9px] text-ink-muted line-clamp-2 leading-tight">
                {st.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CertificateStyleOrientationPicker;
