const CanvasPenControls = ({ color, setColor, lineWidth, setLineWidth }) => {
  const colors = [
    { hex: '#0a2540', title: 'Royal Navy' },
    { hex: '#111827', title: 'Jet Black' },
    { hex: '#1e3a8a', title: 'Ink Blue' }
  ];

  return (
    <div className="flex items-center gap-3">
      <div>
        <label className="block text-xs font-medium text-text dark:text-text-dark mb-1">Pen Ink</label>
        <div className="flex items-center gap-1.5">
          {colors.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => setColor(c.hex)}
              style={{ backgroundColor: c.hex }}
              className={`w-5 h-5 rounded-full border-2 transition-transform ${color === c.hex ? 'scale-110 border-primary' : 'border-transparent'}`}
              title={c.title}
            />
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-text dark:text-text-dark mb-1">Stroke</label>
        <div className="flex items-center gap-1">
          {[1.8, 2.5, 3.5].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setLineWidth(w)}
              className={`px-2 py-0.5 text-[11px] rounded-lg border ${lineWidth === w ? 'border-primary bg-primary/10 text-primary font-semibold' : 'border-line dark:border-white/10 text-text-muted'}`}
            >
              {w}px
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CanvasPenControls;
