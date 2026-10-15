import { useState, useRef } from 'react';
import { Camera, Crop, Trash2, UploadCloud } from 'lucide-react';
import ImageCropModal from './ImageCropModal';

const AvatarUploadField = ({ value, onChange, label = 'Profile Photo' }) => {
  const [rawImage, setRawImage] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setRawImage(e.target.result);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-2">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !value && fileInputRef.current?.click()}
        className="relative group w-24 h-24 rounded-2xl border-2 border-dashed border-line dark:border-white/10 hover:border-primary/60 bg-surface-secondary/40 dark:bg-[#141414] flex flex-col items-center justify-center text-ink-muted cursor-pointer overflow-hidden transition-all shrink-0"
      >
        {value ? (
          <>
            <img src={value} alt="Avatar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setRawImage(value); setIsCropOpen(true); }}
                title="Crop & Resize"
                className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              >
                <Crop className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                title="Change Photo"
                className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(''); }}
                title="Remove Photo"
                className="p-1.5 rounded-lg bg-bad/80 text-white hover:bg-bad backdrop-blur-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center p-2 text-center">
            <UploadCloud className="w-6 h-6 text-primary mb-1" />
            <span className="text-[10px] font-bold text-ink dark:text-ink-dark leading-tight">
              Upload Photo
            </span>
            <span className="text-[9px] text-ink-muted">Crop / Resize</span>
          </div>
        )}
      </div>

      <span className="text-[11px] font-medium text-ink-muted">{label}</span>

      <ImageCropModal
        isOpen={isCropOpen}
        imageSrc={rawImage}
        onClose={() => setIsCropOpen(false)}
        onApplyCrop={(croppedUrl) => onChange(croppedUrl)}
      />
    </div>
  );
};

export default AvatarUploadField;
