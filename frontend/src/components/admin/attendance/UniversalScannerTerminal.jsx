import { useState, useRef, useEffect } from 'react';
import { ScanLine, Loader2, AlertCircle, Camera, Maximize2 } from 'lucide-react';
import CameraScannerModal from '../../common/scanner/CameraScannerModal';
import { playScanSuccessBeep, playScanErrorBeep } from '../../../utils/audioFeedback';

const UniversalScannerTerminal = ({
  title = 'Card Scanner Terminal',
  subtitle = 'Scan Barcode / QR Code or enter ID and press Enter',
  placeholder = 'Scan ID card QR code / Barcode or enter code...',
  cameraTitle = 'Attendance Camera Scanner',
  cameraSubtitle = 'Align ID card QR code or Barcode within the frame',
  onScanCode,
  scanning = false,
  lastScanned,
  scanHistory = [],
  onOverrideStatus,
  renderSpotlight,
  renderFeed
}) => {
  const [code, setCode] = useState('');
  const [scanError, setScanError] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isKioskInitial, setIsKioskInitial] = useState(false);
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
      setScanError(result?.message || 'Verification failed');
    }
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-2.5 sm:space-y-3 flex-1 min-h-0 flex flex-col">
      <div className="shrink-0 p-3 sm:p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs space-y-2.5">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-1.5">
              <ScanLine className="w-3.5 h-3.5 text-primary" />
              <span>{title}</span>
            </label>
            <span className="text-[10px] sm:text-[11px] text-ink-muted">{subtitle}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={code}
                disabled={scanning}
                onChange={(e) => setCode(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-semibold bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary shadow-inner"
              />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsKioskInitial(false);
                  setIsCameraOpen(true);
                }}
                className="flex-1 sm:flex-none px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
                title="Open Camera Scanner"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Camera</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsKioskInitial(true);
                  setIsCameraOpen(true);
                }}
                className="flex-1 sm:flex-none px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
                title="Open Fullscreen Gate Kiosk"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Kiosk</span>
              </button>
              <button
                type="submit"
                disabled={scanning || !code.trim()}
                className="flex-1 sm:flex-none px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
              >
                {scanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ScanLine className="w-3.5 h-3.5" />}
                <span>Scan</span>
              </button>
            </div>
          </div>
        </form>

        {scanError && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{scanError}</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch overflow-y-auto lg:overflow-hidden pr-0.5">
        <div className="lg:col-span-7 flex flex-col min-h-[190px] sm:min-h-[360px] lg:min-h-0 h-full overflow-hidden">
          {renderSpotlight ? renderSpotlight(lastScanned) : null}
        </div>
        <div className="lg:col-span-5 flex flex-col min-h-[180px] sm:min-h-[320px] lg:min-h-0 h-full overflow-hidden">
          {renderFeed ? renderFeed(scanHistory, onOverrideStatus) : null}
        </div>
      </div>

      <CameraScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onScan={onScanCode}
        initialKiosk={isKioskInitial}
        title={cameraTitle}
        subtitle={cameraSubtitle}
      />
    </div>
  );
};

export default UniversalScannerTerminal;
