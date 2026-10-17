import React from 'react';
import { Camera, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

const CameraViewfinder = ({ containerId, isReady, error, onRetry, isScanning }) => {
  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto overflow-hidden rounded-2xl bg-slate-950 border-2 border-slate-800 shadow-2xl flex items-center justify-center">
      <div id={containerId} className="w-full h-full object-cover" />

      {!isReady && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/80 backdrop-blur-xs text-slate-300 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-semibold">Starting camera stream...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 text-slate-200 z-20 space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Camera Unavailable</h4>
          <p className="text-[11px] text-slate-400 max-w-xs">{error}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Permission</span>
            </button>
          )}
        </div>
      )}

      {isReady && !error && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6 z-10">
          <div className="w-full flex justify-between items-start">
            <span className="w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl shadow-xs" />
            <span className="w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl shadow-xs" />
          </div>

          <div className="relative w-full flex-1 flex items-center justify-center">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
          </div>

          <div className="w-full flex justify-between items-end">
            <span className="w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl shadow-xs" />
            <span className="w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl shadow-xs" />
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[10px] font-bold text-emerald-300 flex items-center gap-1.5 whitespace-nowrap shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Align QR or Barcode in Center</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraViewfinder;
