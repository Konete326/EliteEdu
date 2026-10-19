import { useState, useEffect, useId, useCallback } from 'react';
import { X, QrCode, AlertCircle } from 'lucide-react';
import { useCameraScanner } from '../../common/scanner/useCameraScanner';
import CameraViewfinder from '../../common/scanner/CameraViewfinder';
import ScannerActionDispatcher from './ScannerActionDispatcher';
import ScannerManualBar from './ScannerManualBar';
import { playScanSuccessBeep, playScanErrorBeep } from '../../../utils/audioFeedback';
import { useToast } from '../../../context/ToastContext';
import api from '../../../services/api';

const UniversalScannerModal = ({ isOpen, onClose }) => {
  const containerId = useId().replace(/:/g, '_') + '_univ_scanner';
  const toast = useToast();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState('');
  const [resolvedData, setResolvedData] = useState(null);

  const handleLookup = useCallback(async (scannedCode) => {
    if (!scannedCode || loading) return;
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/scanner/lookup', { code: scannedCode });
      if (res.data?.success) {
        playScanSuccessBeep();
        setResolvedData(res.data);
      } else {
        playScanErrorBeep();
        setError(res.data?.message || 'Code not recognized');
      }
    } catch (err) {
      playScanErrorBeep();
      setError(err.response?.data?.message || 'Verification record not found');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const { isReady, cameraError, restart } = useCameraScanner({
    containerId,
    onScan: handleLookup,
    isActive: isOpen && !resolvedData,
    continuous: false
  });

  useEffect(() => {
    if (!isOpen) { setResolvedData(null); setError(''); setCode(''); }
  }, [isOpen]);

  const handleMarkAttendance = async (status) => {
    if (!resolvedData?.record?._id) return;
    try {
      setMarking(true);
      const payload = { type: resolvedData.type, id: resolvedData.record._id, status };
      const res = await api.post('/scanner/mark-attendance', payload);
      if (res.data?.success) {
        playScanSuccessBeep();
        toast.success(res.data.message);
        setResolvedData((prev) => ({
          ...prev,
          record: { ...prev.record, today_attendance: status, time_recorded: new Date().toLocaleTimeString() }
        }));
      }
    } catch (err) {
      playScanErrorBeep();
      toast.error(err.response?.data?.message || 'Failed to record attendance');
    } finally {
      setMarking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-ink dark:text-ink-dark uppercase tracking-wider">Universal Scanner</h3>
              <p className="text-[11px] text-ink-muted">Scan Student ID Card, Staff Badge or Barcode</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-xl text-ink-muted hover:text-ink dark:hover:text-ink-dark">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl text-xs font-bold bg-bad-soft text-bad border border-bad/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        )}

        {resolvedData ? (
          <ScannerActionDispatcher
            data={resolvedData}
            onMarkAttendance={handleMarkAttendance}
            marking={marking}
            onResetScan={() => { setResolvedData(null); setError(''); setCode(''); }}
            onClose={onClose}
          />
        ) : (
          <div className="space-y-4">
            <CameraViewfinder containerId={containerId} isReady={isReady} error={cameraError} onRetry={restart} />
            <ScannerManualBar
              code={code}
              setCode={setCode}
              onSubmit={(e) => { e.preventDefault(); if (code.trim()) handleLookup(code.trim()); }}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalScannerModal;
