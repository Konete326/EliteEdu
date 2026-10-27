import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Crop } from 'lucide-react';

const ImageCropModal = ({ isOpen, imageSrc, onClose, onApplyCrop }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
      draw();
    };
  }, [imageSrc]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2 + pan.x, size / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    const aspect = img.width / img.height;
    const drawW = aspect > 1 ? size : size * aspect;
    const drawH = aspect > 1 ? size / aspect : size;
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }, [zoom, pan, rotation]);

  useEffect(() => {
    draw();
  }, [draw]);

  if (!isOpen) return null;

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cropped = document.createElement('canvas');
    cropped.width = 400;
    cropped.height = 400;
    cropped.getContext('2d').drawImage(canvas, 0, 0, 400, 400);
    onApplyCrop(cropped.toDataURL('image/jpeg', 0.88));
    onClose();
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches.length === 1) {
      setPan({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
    }
  };

  const modalNode = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-3xl bg-surface dark:bg-[#121214] border border-line dark:border-white/10 shadow-2xl p-5 sm:p-6 space-y-4 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-white">Crop &amp; Adjust Avatar</h3>
              <p className="text-[10px] text-ink-muted">Drag to center • Zoom or rotate</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-ink-muted hover:text-ink dark:hover:text-white hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          className="relative w-60 h-60 sm:w-64 sm:h-64 mx-auto rounded-full overflow-hidden border-2 border-primary shadow-2xl bg-black/40 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={(e) => { setIsDragging(true); setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y }); }}
          onMouseMove={(e) => { if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(false)}
        >
          <canvas ref={canvasRef} width={256} height={256} className="w-full h-full" />
        </div>

        <div className="flex items-center justify-between gap-3 text-xs pt-1 px-1">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.5, Math.round((z - 0.2) * 10) / 10))}
            className="p-2 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/5 text-ink dark:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="flex-1 accent-primary cursor-pointer h-1.5 bg-surface-secondary dark:bg-white/10 rounded-lg"
          />
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3, Math.round((z + 0.2) * 10) / 10))}
            className="p-2 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/5 text-ink dark:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-2 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/5 text-ink dark:text-white transition-colors cursor-pointer"
            title="Rotate 90°"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-semibold text-ink-muted hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" /> Apply &amp; Upload
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : null;
};

export default ImageCropModal;
