import { useState, useRef } from 'react';
import { Upload, Check, Image as ImageIcon, Sparkles, X } from 'lucide-react';
import cleanImageBackground from '../../../../utils/cleanImageBackground';

const SignatureUploadCard = ({ onSave, saving }) => {
  const fileRef = useRef(null);
  const [cleaned, setCleaned] = useState(null);
  const [raw, setRaw] = useState(null);
  const [label, setLabel] = useState('Official Principal Signature');
  const [isDefault, setIsDefault] = useState(false);
  const [autoClean, setAutoClean] = useState(true);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const src = ev.target.result;
      setRaw(src);
      setCleaned(autoClean ? await cleanImageBackground(src, 215) : src);
    };
    reader.readAsDataURL(file);
  };

  const toggleClean = async (val) => {
    setAutoClean(val);
    if (raw) setCleaned(val ? await cleanImageBackground(raw, 215) : raw);
  };

  const clear = () => {
    setRaw(null);
    setCleaned(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = () => {
    if (!cleaned || !label.trim()) return;
    onSave({ label: label.trim(), type: 'Upload', image_url: cleaned, is_stamp: false, is_default: isDefault });
    clear();
  };

  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text dark:text-text-dark">Upload Signature File</h3>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">PNG or JPG photo with auto-clean white filter</p>
          </div>
        </div>
        {cleaned && (
          <button type="button" onClick={clear} className="px-2 py-1 text-xs text-text-muted hover:text-red-500 flex items-center gap-1 border border-line rounded-lg">
            <X className="w-3.5 h-3.5" /> Remove
          </button>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleFile} className="hidden" />

      {!cleaned ? (
        <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-line dark:border-white/15 rounded-xl h-36 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 text-center p-4">
          <ImageIcon className="w-7 h-7 text-primary/60" />
          <p className="text-xs font-semibold text-text dark:text-text-dark">Click to browse or drop signature photo</p>
          <p className="text-[11px] text-text-muted">Paper signatures are auto-converted to transparent ink</p>
        </div>
      ) : (
        <div className="relative border border-line dark:border-white/15 rounded-xl h-36 bg-white dark:bg-white/5 flex items-center justify-center p-3">
          <img src={cleaned} alt="Preview" className="max-h-full max-w-full object-contain" />
          <button type="button" onClick={() => toggleClean(!autoClean)} className="absolute bottom-2 right-2 px-2 py-1 text-[11px] rounded-lg border bg-surface dark:bg-black text-text-muted flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" /> {autoClean ? 'Background Cleaned' : 'Raw Image'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-xs font-medium text-text dark:text-text-dark mb-1">Label</label>
          <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-white/10 bg-transparent text-text dark:text-text-dark focus:outline-hidden" />
        </div>
        <div className="flex items-center sm:justify-end pt-5">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-text dark:text-text-dark">
            <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="rounded border-line text-primary focus:ring-primary" />
            <span>Default document signature</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end pt-2 border-t border-line dark:border-white/10">
        <button type="button" onClick={submit} disabled={!cleaned || saving} className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary-hover disabled:opacity-50 flex items-center gap-1.5 transition-colors">
          <Check className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Uploaded Signature'}
        </button>
      </div>
    </div>
  );
};

export default SignatureUploadCard;
