import React from 'react';
import { Palette, RectangleHorizontal, RectangleVertical, Printer } from 'lucide-react';

export const REPORT_CARD_TEMPLATES = [
  { id: 'yellow_permanent', label: '1. Yellow Permanent Record', color: '#facc15' },
  { id: 'navy_modern_blocks', label: '2. Navy Modern Blocks', color: '#1e293b' },
  { id: 'crimson_executive', label: '3. Crimson Executive', color: '#7f1d1d' },
  { id: 'sky_blue_crest', label: '4. Sky Blue Crest', color: '#38bdf8' },
  { id: 'emerald_elementary', label: '5. Emerald Elementary', color: '#065f46' },
  { id: 'cream_behavior_grid', label: '6. Cream & Behavior Matrix', color: '#111827' },
  { id: 'classic_institutional', label: 'Classic Institutional', color: '#0d9488' }
];

const ReportCardTemplateToolbar = ({
  selectedTemplate = 'yellow_permanent',
  onSelectTemplate,
  orientation = 'portrait',
  onToggleOrientation,
  onPrint
}) => {
  const handleSelect = (id) => {
    onSelectTemplate(id);
    try { localStorage.setItem('eliteedu_reportcard_style', id); } catch {}
  };

  const handleOrientation = (ori) => {
    onToggleOrientation(ori);
    try { localStorage.setItem('eliteedu_reportcard_orientation', ori); } catch {}
  };

  return (
    <div className="bg-surface border border-line p-3 sm:p-4 rounded-2xl shadow-xs space-y-3 print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Palette size={15} className="text-primary" />
          <span className="text-xs font-black uppercase text-ink tracking-wider">Report Card Visual Studio</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-secondary/70 p-0.5 rounded-xl border border-line">
            <button
              type="button"
              onClick={() => handleOrientation('portrait')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                orientation === 'portrait' ? 'bg-primary text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <RectangleVertical size={13} />
              <span>Portrait</span>
            </button>
            <button
              type="button"
              onClick={() => handleOrientation('landscape')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                orientation === 'landscape' ? 'bg-primary text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <RectangleHorizontal size={13} />
              <span>Landscape</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Printer size={13} />
            <span>Print A4</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
        {REPORT_CARD_TEMPLATES.map((tpl) => {
          const isActive = selectedTemplate === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleSelect(tpl.id)}
              className={`p-2 rounded-xl border text-left text-[11px] font-bold transition-all cursor-pointer flex items-center gap-2 truncate ${
                isActive
                  ? 'border-primary bg-primary/10 text-primary shadow-2xs ring-1 ring-primary/30'
                  : 'border-line hover:bg-surface-secondary text-ink'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: tpl.color }} />
              <span className="truncate">{tpl.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReportCardTemplateToolbar;
