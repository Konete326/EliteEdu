import { useState, useRef, useEffect } from 'react';
import { ScanLine, Loader2, AlertCircle, Camera } from 'lucide-react';
import LastScannedSpotlight from './LastScannedSpotlight';
import RecentScansFeed from './RecentScansFeed';
import CameraScannerModal from '../../common/scanner/CameraScannerModal';
import { playScanSuccessBeep, playScanErrorBeep } from '../../../utils/audioFeedback';

const CardScannerTerminal = ({ onScanCode, scanning, lastScanned, scanHistory = [], onOverrideStatus }) => {
  const [code, setCode] = useState('');
  const [scanError, setScanError] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [scanning]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const trimmed = code.trim();
    if (!trimmed || scanning) return;
    setScanError('');
    const result = await onScanCode(trimmed);
    if (result?.success) {
      playScanSuccessBeep();
      setCode('');
    } else {
      playScanErrorBeep();
      setScanError(result?.message || 'Card verification failed');
    }
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs space-y-3">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-1.5">
              <ScanLine className="w-3.5 h-3.5 text-primary" />
              <span>Card Scanner / GR Terminal</span>
            </label>
            <span className="text-[11px] text-ink-muted">Type GR # or Open Live Camera</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={code}
                disabled={scanning}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Scan Student ID Card Barcode / QR or type GR # and press Enter..."
                className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary shadow-inner"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
                title="Open Camera Scanner"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Open Camera</span>
              </button>
              <button
                type="submit"
                disabled={scanning || !code.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                {scanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ScanLine className="w-3.5 h-3.5" />}
                <span>Scan</span>
              </button>
            </div>
          </div>
        </form>

        {scanError && (
          <div className="p-2.5 rounded-xl bg-bad/10 text-bad border border-bad/20 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{scanError}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <LastScannedSpotlight student={lastScanned?.student} scanTime={lastScanned?.time} />
        </div>
        <div className="lg:col-span-5">
          <RecentScansFeed scans={scanHistory} onOverrideStatus={onOverrideStatus} />
        </div>
      </div>

      <CameraScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onScan={onScanCode}
        title="Student Attendance Camera Scanner"
        subtitle="Align student ID card QR code or Barcode to mark present"
      />
    </div>
  );
};

export default CardScannerTerminal;
