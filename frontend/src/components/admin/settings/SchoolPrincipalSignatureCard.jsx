import { useRef, useState } from 'react';
import { UploadCloud, Trash2, PenTool, Link as LinkIcon, CheckCircle2, ShieldCheck } from 'lucide-react';

const SchoolPrincipalSignatureCard = ({ signatureUrl, onSignatureChange }) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const processSignature = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max = 700;
        let { width: w, height: h } = img;
        if (w > max || h > max) {
          if (w > h) { h = Math.round((h * max) / w); w = max; }
          else { w = Math.round((w * max) / h); h = max; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        onSignatureChange(canvas.toDataURL('image/png'));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processSignature(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processSignature(file);
  };

  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-ink-dark flex items-center gap-2">
              <span>Principal Digital Signature</span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Auto-Embed
              </span>
            </h3>
            <p className="text-[11px] text-ink-muted">Transparent PNG automatically attached to all certificates & credentials</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowUrlInput((p) => !p)}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Upload File' : 'Paste URL'}</span>
        </button>
      </div>

      <input type="file" ref={fileInputRef} accept="image/png,image/webp,image/jpeg" onChange={handleFileChange} className="hidden" />

      {showUrlInput && (
        <input
          type="url"
          value={signatureUrl || ''}
          onChange={(e) => onSignatureChange(e.target.value)}
          placeholder="https://example.com/principal-signature.png"
          className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-secondary dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div
          className="relative w-44 h-28 rounded-2xl border-2 border-line dark:border-white/10 flex items-center justify-center overflow-hidden shrink-0 group shadow-xs"
          style={{
            backgroundImage: 'repeating-conic-gradient(#cbd5e1 0% 25%, #ffffff 0% 50%)',
            backgroundSize: '16px 16px'
          }}
        >
          {signatureUrl ? (
            <>
              <img src={signatureUrl} alt="Principal Signature" className="max-w-[85%] max-h-[80%] object-contain drop-shadow-xs" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 cursor-pointer"
                  title="Change Signature"
                >
                  <PenTool className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onSignatureChange('')}
                  className="p-1.5 rounded-lg bg-bad/80 text-white hover:bg-bad cursor-pointer"
                  title="Remove Signature"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-ink-muted p-2 text-center bg-white/80 dark:bg-black/80 w-full h-full">
              <PenTool className="w-6 h-6 text-primary/40 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">No Signature</span>
            </div>
          )}
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 w-full h-28 rounded-2xl border-2 border-dashed border-line dark:border-white/10 hover:border-primary/60 bg-surface-secondary/30 dark:bg-[#141414] flex flex-col items-center justify-center text-ink-muted cursor-pointer transition-all hover:bg-primary/5 group px-4 text-center"
        >
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-ink dark:text-ink-dark">Drag & drop signature file, or browse</p>
          <p className="text-[10px] text-ink-muted">Transparent PNG strongly recommended for authentic printing (max 2MB)</p>
        </div>
      </div>

      {signatureUrl && (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Active & ready. This signature will automatically appear on all generated certificates.</span>
        </div>
      )}
    </div>
  );
};

export default SchoolPrincipalSignatureCard;
