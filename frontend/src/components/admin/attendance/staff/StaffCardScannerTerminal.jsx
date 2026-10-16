import { useState, useRef, useEffect } from 'react';
import { ScanLine, Loader2, AlertCircle } from 'lucide-react';
import StaffLastScannedSpotlight from './StaffLastScannedSpotlight';
import StaffRecentScansFeed from './StaffRecentScansFeed';

const playBeep = (freq = 880, duration = 0.12) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  } catch (_) {}
};

const StaffCardScannerTerminal = ({ onScanCode, scanning, lastScanned, scanHistory = [], onOverrideStatus }) => {
  const [code, setCode] = useState('');
  const [scanError, setScanError] = useState('');
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
      playBeep(880, 0.15);
      setCode('');
    } else {
      playBeep(300, 0.25);
      setScanError(result?.message || 'Staff verification failed');
    }
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs space-y-3">
        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-1.5">
            <ScanLine className="w-3.5 h-3.5 text-primary" />
            <span>Teacher / Staff Service Card Terminal</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={code}
                disabled={scanning}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Scan Teacher Service Card QR / Barcode or enter EMP Code / Pers # / CNIC..."
                className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={scanning || !code.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              {scanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ScanLine className="w-3.5 h-3.5" />}
              <span>Scan</span>
            </button>
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
          <StaffLastScannedSpotlight
            staff={lastScanned?.staff}
            scanTime={lastScanned?.time}
            attendance={lastScanned?.attendance}
          />
        </div>
        <div className="lg:col-span-5">
          <StaffRecentScansFeed scans={scanHistory} onOverrideStatus={onOverrideStatus} />
        </div>
      </div>
    </div>
  );
};

export default StaffCardScannerTerminal;
