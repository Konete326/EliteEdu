import React, { useState, useEffect, useId } from 'react';
import { X, Camera, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { useCameraScanner } from './useCameraScanner';
import CameraViewfinder from './CameraViewfinder';
import CameraScannerControls from './CameraScannerControls';
import { playScanSuccessBeep, playScanErrorBeep } from '../../../utils/audioFeedback';

const CameraScannerModal = ({
  isOpen,
  onClose,
  onScan,
  title = 'Live Camera Scanner',
  subtitle = 'Scan Student ID Card, Staff Service Card or Certificate'
}) => {
  const containerId = useId().replace(/:/g, '_') + '_scanner_viewport';
  const [continuous, setContinuous] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [showTestBar, setShowTestBar] = useState(false);
  const [testCode, setTestCode] = useState('GR-1001');

  const handleScanCode = async (code) => {
    try {
      const res = await onScan(code);
      if (res?.success !== false) {
        playScanSuccessBeep();
        const label = res?.student?.name || res?.staff?.name || res?.recipient_name || code;
        setFeedback({ success: true, message: `Verified: ${label} (${res?.status === 'P' ? 'Present' : res?.status || 'Active'})` });
        if (!continuous) setTimeout(() => onClose(), 600);
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
    isTorchOn, hasTorch, toggleTorch, cameraError, scanFile, restart
  } = useCameraScanner({ containerId, onScan: handleScanCode, isActive: isOpen, continuous });

  useEffect(() => {
    if (!isOpen) { setFeedback(null); setShowTestBar(false); }
  }, [isOpen]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleClose = () => {
    try {
      const videos = document.querySelectorAll('video');
      videos.forEach((v) => {
        if (v.srcObject && typeof v.srcObject.getTracks === 'function') {
          v.srcObject.getTracks().forEach((t) => t.stop());
          v.srcObject = null;
        }
      });
    } catch (_) {}
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      try {
        const videos = document.querySelectorAll('video');
        videos.forEach((v) => {
          if (v.srcObject && typeof v.srcObject.getTracks === 'function') {
            v.srcObject.getTracks().forEach((t) => t.stop());
            v.srcObject = null;
          }
        });
      } catch (_) {}
    };
  }, []);

  if (!isOpen) return null;

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
          <button type="button" onClick={handleClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${feedback.success ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' : 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30'}`}>
            {feedback.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span className="truncate">{feedback.message}</span>
          </div>
        )}

        {showTestBar && (
          <form onSubmit={(e) => { e.preventDefault(); if (testCode.trim()) handleScanCode(testCode.trim()); }} className="flex gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <input type="text" value={testCode} onChange={(e) => setTestCode(e.target.value)} placeholder="Type test GR # or EMP code..." className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none font-mono" />
            <button type="submit" className="px-3 py-1.5 rounded-lg bg-primary text-white font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate</span>
            </button>
          </form>
        )}

        <CameraViewfinder containerId={containerId} isReady={isReady} error={cameraError} onRetry={restart} />

        <CameraScannerControls
          cameras={cameras} selectedCameraId={selectedCameraId} onSelectCamera={setSelectedCameraId}
          hasTorch={hasTorch} isTorchOn={isTorchOn} onToggleTorch={toggleTorch} onScanFile={scanFile}
          continuous={continuous} onToggleContinuous={setContinuous}
          onSimulateScan={() => setShowTestBar((prev) => !prev)}
        />
      </div>
    </div>
  );
};

export default CameraScannerModal;
