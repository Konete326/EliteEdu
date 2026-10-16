import { Clock, Check, History } from 'lucide-react';

const RecentScansFeed = ({ scans = [], onOverrideStatus }) => {
  if (scans.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-center text-xs text-ink-muted">
        No cards scanned in this session yet.
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-1 border-b border-line dark:border-line-dark">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-primary" />
          <span>Today&apos;s Scanned Feed ({scans.length})</span>
        </h4>
        <span className="text-[11px] text-ink-muted font-medium">Instant Synced</span>
      </div>

      <div className="divide-y divide-line dark:divide-line-dark max-h-64 overflow-y-auto pr-1">
        {scans.map((scan, idx) => {
          const s = scan.student;
          const name = `${s?.first_name || ''} ${s?.last_name || ''}`.trim() || 'Student';
          return (
            <div key={`${s?._id}-${idx}`} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-ink dark:text-ink-dark truncate">{name}</div>
                  <div className="text-[11px] text-ink-muted flex items-center gap-1.5">
                    <span>GR: {s?.gr_number || 'N/A'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {scan.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onOverrideStatus(s?._id, 'P')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                    scan.status === 'P'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-surface-secondary text-ink-muted hover:text-ink'
                  }`}
                >
                  P
                </button>
                <button
                  type="button"
                  onClick={() => onOverrideStatus(s?._id, 'LT')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                    scan.status === 'LT'
                      ? 'bg-amber-600 text-white'
                      : 'bg-surface-secondary text-ink-muted hover:text-ink'
                  }`}
                >
                  LT
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentScansFeed;
