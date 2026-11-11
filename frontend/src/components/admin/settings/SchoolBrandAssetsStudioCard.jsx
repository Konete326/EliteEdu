import { useState, useRef } from 'react';
import {
  School,
  PenTool,
  Award,
  UploadCloud,
  Trash2,
  Camera,
  Link as LinkIcon,
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import MobileTabStepper from '../../common/MobileTabStepper';

const ASSET_TABS = [
  { id: 'logo', label: 'School Crest / Logo', icon: School, key: 'logo_url' },
  { id: 'principal', label: 'Principal Signature', icon: PenTool, key: 'principal_signature_url' },
  { id: 'teacher', label: 'Exam Authority Signature', icon: Award, key: 'teacher_signature_url' }
];

const SchoolBrandAssetsStudioCard = ({
  logoUrl,
  principalSignatureUrl,
  teacherSignatureUrl,
  onAssetChange,
  onSyncSignatures
}) => {
  const [activeTab, setActiveTab] = useState('logo');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const assetValues = {
    logo_url: logoUrl || '',
    principal_signature_url: principalSignatureUrl || '',
    teacher_signature_url: teacherSignatureUrl || ''
  };

  const activeMeta = ASSET_TABS.find((t) => t.id === activeTab) || ASSET_TABS[0];
  const currentVal = assetValues[activeMeta.key];

  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max = activeTab === 'logo' ? 800 : 700;
        let { width: w, height: h } = img;
        if (w > max || h > max) {
          if (w > h) {
            h = Math.round((h * max) / w);
            w = max;
          } else {
            w = Math.round((w * max) / h);
            h = max;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        onAssetChange(activeMeta.key, canvas.toDataURL('image/png'));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center shrink-0">
            <activeMeta.icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-ink dark:text-ink-dark flex items-center gap-2">
              <span>Brand Assets &amp; Digital Signatures</span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Auto-Embed
              </span>
            </h3>
            <p className="text-[10px] text-ink-muted">
              Unified transparent PNG assets auto-attached to reports, fee vouchers, and ID cards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onSyncSignatures && (
            <button
              type="button"
              onClick={onSyncSignatures}
              className="px-2.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Sync from Signatures Studio</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowUrlInput((p) => !p)}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Upload File' : 'Paste Direct URL'}</span>
          </button>
        </div>
      </div>

      <MobileTabStepper
        tabs={ASSET_TABS}
        activeTab={activeTab}
        onChange={(tabId) => {
          setActiveTab(tabId);
          setShowUrlInput(false);
        }}
      />

      <input
        type="file"
        ref={fileInputRef}
        accept="image/png,image/webp,image/jpeg"
        onChange={handleFileChange}
        className="hidden"
      />

      {showUrlInput && (
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={currentVal}
            onChange={(e) => onAssetChange(activeMeta.key, e.target.value)}
            placeholder={`https://example.com/${activeTab}-asset.png`}
            className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-surface-secondary dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-surface-secondary/30 dark:bg-[#121215] border border-line/60 dark:border-white/5">
        <div className="relative w-32 h-24 rounded-xl border-2 border-dashed border-line dark:border-white/10 bg-white dark:bg-[#18181b] flex items-center justify-center overflow-hidden shrink-0 group shadow-xs">
          {currentVal ? (
            <>
              <img
                src={currentVal}
                alt={activeMeta.label}
                className="w-full h-full object-contain p-2"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 cursor-pointer"
                  title="Replace"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onAssetChange(activeMeta.key, '')}
                  className="p-1.5 rounded-lg bg-bad/80 text-white hover:bg-bad cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-ink-muted p-2 text-center">
              <activeMeta.icon className="w-8 h-8 text-primary/40 mb-1" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-ink-muted">
                Not Set
              </span>
            </div>
          )}
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 w-full border-2 border-dashed border-line dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 rounded-xl p-4 text-center cursor-pointer transition-all bg-surface dark:bg-[#141417] flex flex-col items-center justify-center gap-1.5 group"
        >
          <UploadCloud className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-ink dark:text-white">
            Click to upload or drag &amp; drop {activeMeta.label}
          </p>
          <p className="text-[10px] text-ink-muted">
            PNG or WebP with transparent background recommended (Max 800px auto-compressed)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchoolBrandAssetsStudioCard;
