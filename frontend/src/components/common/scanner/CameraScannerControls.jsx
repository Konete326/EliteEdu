import React, { useRef } from 'react';
import { Flashlight, FlashlightOff, Image, SwitchCamera, CheckSquare, Square } from 'lucide-react';

const CameraScannerControls = ({
  cameras = [],
  selectedCameraId,
  onSelectCamera,
  hasTorch,
  isTorchOn,
  onToggleTorch,
  onScanFile,
  continuous,
  onToggleContinuous
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onScanFile(file);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full space-y-3 pt-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {cameras.length > 1 && (
          <div className="flex items-center gap-1.5 flex-1 min-w-[160px]">
            <SwitchCamera className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedCameraId}
              onChange={(e) => onSelectCamera(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
            >
              {cameras.map((cam, idx) => (
                <option key={cam.id} value={cam.id}>
                  {cam.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-1.5 ml-auto">
          {hasTorch && (
            <button
              type="button"
              onClick={onToggleTorch}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                isTorchOn
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
              title="Toggle Flashlight"
            >
              {isTorchOn ? <Flashlight className="w-3.5 h-3.5" /> : <FlashlightOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Torch</span>
            </button>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Image className="w-3.5 h-3.5 text-primary" />
            <span>Image</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onToggleContinuous(!continuous)}
          className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer font-medium hover:text-primary transition-colors"
        >
          {continuous ? <CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
          <span>Continuous rapid mode</span>
        </button>
        <span className="font-mono text-[10px] text-slate-400">QR / Barcode</span>
      </div>
    </div>
  );
};

export default CameraScannerControls;
