import { useState, useRef } from 'react';
import { Stamp, Check, Sparkles, X, ShieldCheck } from 'lucide-react';
import cleanImageBackground from '../../../../utils/cleanImageBackground';

const StampUploadCard = ({ onSave, saving }) => {
  const fileRef = useRef(null);
  const [cleaned, setCleaned] = useState(null);
  const [label, setLabel] = useState('Official School Rubber Stamp');
  const [isDefault, setIsDefault] = useState(true);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const src = ev.target.result;
      const filtered = await cleanImageBackground(src, 220);
      setCleaned(filtered);
    };
    reader.readAsDataURL(file);
  };

  const clear = () => {
    setCleaned(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = () => {
    if (!cleaned || !label.trim()) return;
    onSave({ label: label.trim(), type: 'Upload', image_url: cleaned, is_stamp: true, is_default: isDefault });
    clear();
  };

  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Stamp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text dark:text-text-dark">Official Stamp & Seal Manager</h3>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">Upload circular or rectangular school seal</p>
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
        <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-line dark:border-white/15 rounded-xl h-36 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-center p-4">
          <ShieldCheck className="w-8 h-8 text-amber-500/60" />
          <p className="text-xs font-semibold text-text dark:text-text-dark">Upload official school rubber stamp or seal</p>
          <p className="text-[11px] text-text-muted">Auto-injected into admission letters, certificates & ID cards</p>
        </div>
      ) : (
        <div className="relative border border-line dark:border-white/15 rounded-xl h-36 bg-white dark:bg-white/5 flex items-center justify-center p-3">
          <div className="w-28 h-28 rounded-full border-2 border-dashed border-amber-500/30 flex items-center justify-center p-2 bg-amber-500/5">
            <img src={cleaned} alt="Stamp Preview" className="max-h-full max-w-full object-contain" />
          </div>
          <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1 font-medium">
            <Sparkles className="w-2.5 h-2.5" /> Stamp Cleaned
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-xs font-medium text-text dark:text-text-dark mb-1">Stamp Label</label>
          <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-white/10 bg-transparent text-text dark:text-text-dark focus:outline-hidden" />
        </div>
        <div className="flex items-center sm:justify-end pt-5">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-text dark:text-text-dark">
            <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="rounded border-line text-amber-600 focus:ring-amber-500" />
            <span>Default institutional seal</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end pt-2 border-t border-line dark:border-white/10">
        <button type="button" onClick={submit} disabled={!cleaned || saving} className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 flex items-center gap-1.5 transition-colors">
          <Check className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Official Stamp'}
        </button>
      </div>
    </div>
  );
};

export default StampUploadCard;
