import { useState, useRef } from 'react';
import { PenTool, RotateCcw, Check, Sparkles } from 'lucide-react';
import CanvasPenControls from './CanvasPenControls';

const SignatureCanvas = ({ onSave, saving }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [label, setLabel] = useState('Principal Official Sign');
  const [color, setColor] = useState('#0a2540');
  const [lineWidth, setLineWidth] = useState(2.5);
  const [isDefault, setIsDefault] = useState(false);

  const getCoords = (e) => {
    const c = canvasRef.current;
    const r = c.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (cx - r.left) * (c.width / r.width), y: (cy - r.top) * (c.height / r.height) };
  };

  const start = (e) => {
    e.preventDefault();
    const { x, y } = getCoords(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const move = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoords(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const clear = () => {
    canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHasDrawn(false);
  };

  const submit = () => {
    if (!hasDrawn || !label.trim()) return;
    onSave({ label: label.trim(), type: 'Touch_Pad', image_url: canvasRef.current.toDataURL('image/png'), is_stamp: false, is_default: isDefault });
  };

  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text dark:text-text-dark">Touch / Mouse Pad</h3>
            <p className="text-xs text-text-muted">Draw live vector-style signature</p>
          </div>
        </div>
        <button type="button" onClick={clear} className="px-2.5 py-1 text-xs text-text-muted hover:text-red-500 flex items-center gap-1 border border-line rounded-lg">
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      <div className="relative border-2 border-dashed border-line dark:border-white/15 rounded-xl bg-white dark:bg-white/5 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={180}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={() => setIsDrawing(false)}
          onMouseLeave={() => setIsDrawing(false)}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={() => setIsDrawing(false)}
          className="w-full h-36 touch-none cursor-crosshair block"
        />
        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-xs text-text-muted/60">
            <Sparkles className="w-4 h-4 mb-1 text-primary/50" />
            <span>Sign with stylus, mouse, or touch inside canvas</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-xs font-medium text-text dark:text-text-dark mb-1">Label</label>
          <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} className="w-full px-3 py-1.5 text-xs rounded-xl border border-line bg-transparent text-text dark:text-text-dark focus:outline-hidden" />
        </div>
        <CanvasPenControls color={color} setColor={setColor} lineWidth={lineWidth} setLineWidth={setLineWidth} />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-line dark:border-white/10">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-text dark:text-text-dark">
          <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="rounded border-line text-primary focus:ring-primary" />
          <span>Default document signature</span>
        </label>
        <button type="button" onClick={submit} disabled={!hasDrawn || saving} className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary-hover disabled:opacity-50 flex items-center gap-1.5 transition-colors">
          <Check className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Signature'}
        </button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
