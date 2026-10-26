import React from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

const CameraViewfinder = ({ containerId, isReady, error, onRetry, className = '' }) => {
  return (
    <div className={`relative w-full aspect-square max-w-sm mx-auto overflow-hidden rounded-2xl bg-slate-950 border-2 border-slate-800 shadow-2xl flex items-center justify-center ${className}`}>
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
            <span className="w-8 h-8 border-t-3 border-l-3 border-primary/70 rounded-tl-xl shadow-xs" />
            <span className="w-8 h-8 border-t-3 border-r-3 border-primary/70 rounded-tr-xl shadow-xs" />
          </div>

          <div className="w-full flex justify-between items-end">
            <span className="w-8 h-8 border-b-3 border-l-3 border-primary/70 rounded-bl-xl shadow-xs" />
            <span className="w-8 h-8 border-b-3 border-r-3 border-primary/70 rounded-br-xl shadow-xs" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraViewfinder;
