import { ScanLine, Loader2, Zap } from 'lucide-react';

const ScannerManualBar = ({ code, setCode, onSubmit, loading }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Scan barcode/QR or enter GR / EMP code..."
          className="flex-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-secondary dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary font-mono shadow-inner"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ScanLine className="w-3.5 h-3.5" />}
          <span>Verify</span>
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-ink-muted">
        <span>Desktop Simulation:</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCode('GR-1001')}
            className="px-2 py-0.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-amber-500" />
            <span>GR-1001</span>
          </button>
          <button
            type="button"
            onClick={() => setCode('EMP-1001')}
            className="px-2 py-0.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-purple-500" />
            <span>EMP-1001</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default ScannerManualBar;
