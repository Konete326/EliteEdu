import React, { useState, useEffect, useId } from 'react';
import { X, Camera, CheckCircle2, AlertCircle, Maximize2, Minimize2, Clock, ShieldCheck } from 'lucide-react';
import { useCameraScanner } from './useCameraScanner';
import CameraViewfinder from './CameraViewfinder';
import CameraScannerControls from './CameraScannerControls';
import { playScanSuccessBeep, playScanErrorBeep } from '../../../utils/audioFeedback';

const CameraScannerModal = ({
  isOpen,
  onClose,
  onScan,
  initialKiosk = false,
  title = 'Live Camera Scanner',
  subtitle = 'Scan Student ID Card, Staff Service Card or Certificate'
}) => {
  const containerId = useId().replace(/:/g, '_') + '_scanner_viewport';
  const [continuous, setContinuous] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [isKioskMode, setIsKioskMode] = useState(initialKiosk);
  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    setIsKioskMode(initialKiosk);
  }, [initialKiosk, isOpen]);

  useEffect(() => {
    if (!isOpen || !isKioskMode) return;
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, [isOpen, isKioskMode]);

  const handleScanCode = async (code) => {
    try {
      const res = await onScan(code);
      if (res?.success !== false) {
        playScanSuccessBeep();
        const label = res?.student?.name || res?.staff?.name || res?.recipient_name || code;
        setFeedback({ success: true, message: `Verified: ${label} (${res?.status === 'P' ? 'Present' : res?.status || 'Active'})` });
        if (!continuous && !isKioskMode) setTimeout(() => onClose(), 600);
      } else {
        playScanErrorBeep();
        setFeedback({ success: false, message: res?.message || 'Verification record not found' });
      }
    } catch (err) {
      playScanErrorBeep();
      setFeedback({ success: false, message: err?.message || 'Scan error occurred' });
    }
  };

  const {
    cameras, selectedCameraId, setSelectedCameraId, isReady,
    isTorchOn, hasTorch, toggleTorch, cameraError, scanFile, restart, stopScanner
  } = useCameraScanner({ containerId, onScan: handleScanCode, isActive: isOpen, continuous: isKioskMode ? true : continuous });

  useEffect(() => {
    if (!isOpen) { setFeedback(null); }
  }, [isOpen]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
        if (isKioskMode) restart();
      }, isKioskMode ? 3000 : 3500);
      return () => clearTimeout(timer);
    }
  }, [feedback, isKioskMode, restart]);

  const toggleKiosk = () => {
    const next = !isKioskMode;
    setIsKioskMode(next);
    if (next) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    }
  };

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    stopScanner();
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  if (isKioskMode) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide uppercase text-white flex items-center gap-2">
                <span>Gateway Attendance Kiosk</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400">Position ID card or QR code directly before camera lens</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-300">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{currentTime}</span>
            </div>
            <button
              type="button"
              onClick={toggleKiosk}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Exit Fullscreen Kiosk"
            >
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Exit Kiosk</span>
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 relative my-2">
          <CameraViewfinder
            containerId={containerId}
            isReady={isReady}
            error={cameraError}
            onRetry={restart}
            className="w-full max-w-lg aspect-square sm:aspect-[4/3] max-h-[60vh]"
          />

          {feedback && (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-md p-4 rounded-2xl shadow-2xl border text-center space-y-1 animate-in zoom-in-95 duration-200 z-30 ${
              feedback.success
                ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/95 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-center justify-center gap-2">
                {feedback.success ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
                <span className="font-black text-sm">{feedback.message}</span>
              </div>
              <p className="text-[11px] opacity-80 font-mono">Auto-restarting idle scanner...</p>
            </div>
          )}
        </div>

        <div className="shrink-0 max-w-xl w-full mx-auto">
          <CameraScannerControls
            cameras={cameras}
            selectedCameraId={selectedCameraId}
            onSelectCamera={setSelectedCameraId}
            hasTorch={hasTorch}
            isTorchOn={isTorchOn}
            onToggleTorch={toggleTorch}
            onScanFile={scanFile}
            continuous={true}
            onToggleContinuous={setContinuous}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto z-10">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{title}</h3>
              <p className="text-[11px] text-slate-500">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleKiosk}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              title="Enter Kiosk Mode"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button type="button" onClick={handleClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {feedback && (
          <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${feedback.success ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' : 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30'}`}>
            {feedback.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span className="truncate">{feedback.message}</span>
          </div>
        )}

        <CameraViewfinder containerId={containerId} isReady={isReady} error={cameraError} onRetry={restart} />

        <CameraScannerControls
          cameras={cameras} selectedCameraId={selectedCameraId} onSelectCamera={setSelectedCameraId}
          hasTorch={hasTorch} isTorchOn={isTorchOn} onToggleTorch={toggleTorch} onScanFile={scanFile}
          continuous={continuous} onToggleContinuous={setContinuous}
        />
      </div>
    </div>
  );
};

export default CameraScannerModal;