import { useRef, useState } from 'react';
import { UploadCloud, Trash2, Camera, Link as LinkIcon } from 'lucide-react';

const CampusImageUploadField = ({ value, onChange }) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const compressImage = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let { width: w, height: h } = img;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
          else { w = Math.round((w * maxDim) / h); h = maxDim; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        onChange(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) compressImage(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) compressImage(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark">
          Campus Image (Optional)
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput((prev) => !prev)}
          className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Upload file instead' : 'Or paste URL'}</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {showUrlInput ? (
        <input
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://images.example.com/campus.jpg"
          className="w-full px-3.5 py-2 rounded-xl text-xs bg-surface dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      ) : value ? (
        <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-line dark:border-white/10 group bg-surface-secondary/50">
          <img src={value} alt="Campus Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white/20 text-white hover:bg-white/30 backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Change</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 rounded-xl bg-bad/80 text-white hover:bg-bad backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="h-28 w-full rounded-2xl border-2 border-dashed border-line dark:border-white/10 hover:border-primary/60 bg-surface-secondary/40 dark:bg-[#141414] flex flex-col items-center justify-center text-ink-muted cursor-pointer transition-all hover:bg-primary/5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-ink dark:text-ink-dark">
            Upload Campus Photo
          </p>
          <p className="text-[11px] text-ink-muted">
            PNG, JPG, WEBP up to 5MB (leave empty for default icon)
          </p>
        </div>
      )}
    </div>
  );
};

export default CampusImageUploadField;
