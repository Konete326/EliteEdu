import { X, Check } from 'lucide-react';

const PRESET_COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#0f172a'];

const IdCardCustomizeModal = ({ isOpen, onClose, config, onConfigChange }) => {
  if (!isOpen) return null;

  const handleToggle = (key) => {
    onConfigChange({ ...config, [key]: !config[key] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs print:hidden animate-fade-in">
      <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
          <h2 className="text-sm font-bold text-ink dark:text-ink-dark">Customize ID Card Template</h2>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-surface-secondary text-ink-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-ink dark:text-ink-dark mb-1">Motto Slogan Text</label>
            <input
              type="text"
              value={config.motto}
              onChange={(e) => onConfigChange({ ...config, motto: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-secondary/50 dark:bg-[#16161d] border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none font-urdu text-right"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink dark:text-ink-dark mb-1.5">Accent Color</label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onConfigChange({ ...config, accentColor: c })}
                  style={{ backgroundColor: c }}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 shadow-xs"
                >
                  {config.accentColor === c && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-line/60 dark:border-line-dark space-y-2">
            {[
              { key: 'showBarcode', label: 'Show Vector Barcode' },
              { key: 'showQr', label: 'Show Verification QR Code' },
              { key: 'showBloodGroup', label: 'Show Blood Group Pill' },
              { key: 'showMotto', label: 'Show Institutional Motto' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-surface-secondary/30 hover:bg-surface-secondary/60">
                <span className="font-medium text-ink dark:text-ink-dark">{label}</span>
                <input
                  type="checkbox"
                  checked={config[key]}
                  onChange={() => handleToggle(key)}
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdCardCustomizeModal;
