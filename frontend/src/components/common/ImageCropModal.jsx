import { useState, useRef, useEffect, useCallback } from 'react';
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

  useEffect(() => { draw(); }, [draw]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
            <Crop className="w-4 h-4 text-primary" />
            <span>Crop & Adjust Avatar</span>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-ink-muted hover:text-ink dark:hover:text-ink-dark">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-2 border-primary shadow-inner bg-black/20 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={(e) => { setIsDragging(true); setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y }); }}
          onMouseMove={(e) => { if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          <canvas ref={canvasRef} width={256} height={256} className="w-full h-full" />
        </div>

        <div className="flex items-center justify-between gap-3 text-xs pt-1">
          <button type="button" onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))} className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary">
            <ZoomOut className="w-4 h-4" />
          </button>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="flex-1 accent-primary cursor-pointer"
          />
          <button type="button" onClick={() => setZoom((z) => Math.min(3, z + 0.2))} className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setRotation((r) => (r + 90) % 360)} className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary">
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-line dark:border-white/10">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-semibold hover:bg-surface-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleApply} className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Check className="w-3.5 h-3.5" /> Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
