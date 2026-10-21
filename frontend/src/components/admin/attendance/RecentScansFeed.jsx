import React from 'react';
import { Clock, Check, History } from 'lucide-react';

const RecentScansFeed = ({ scans = [], onOverrideStatus }) => {
  if (scans.length === 0) {
    return (
      <div className="h-full min-h-[160px] sm:min-h-[320px] lg:min-h-[580px] p-4 sm:p-6 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark flex flex-col items-center justify-center text-center text-xs text-ink-muted space-y-1.5 sm:space-y-2">
        <History className="w-6 h-6 sm:w-8 sm:h-8 text-ink-muted/50" />
        <p className="font-semibold text-xs sm:text-sm text-ink dark:text-ink-dark">No cards scanned in this session yet.</p>
        <span className="text-[10px] sm:text-[11px] text-ink-muted max-w-xs">
          Card swipes and live camera scans will appear in this feed with instant status override controls.
        </span>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[180px] sm:min-h-[320px] lg:min-h-[580px] p-3 sm:p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs flex flex-col space-y-2 sm:space-y-3">
      <div className="shrink-0 flex items-center justify-between pb-1.5 border-b border-line dark:border-line-dark">
        <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-primary" />
          <span>Today&apos;s Feed ({scans.length})</span>
        </h4>
        <span className="text-[10px] sm:text-[11px] text-ink-muted font-medium">Instant Synced</span>
      </div>

      <div className="divide-y divide-line dark:divide-line-dark flex-1 min-h-0 overflow-y-auto pr-1">
        {scans.map((scan, idx) => {
          const s = scan.student;
          const name = `${s?.first_name || ''} ${s?.last_name || ''}`.trim() || 'Student';
          return (
            <div key={`${s?._id}-${idx}`} className="py-2 flex items-center justify-between gap-2 sm:gap-3 text-xs">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px] sm:text-[11px]">
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-ink dark:text-ink-dark truncate">{name}</div>
                  <div className="text-[10px] sm:text-[11px] text-ink-muted flex items-center gap-1.5">
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
                  className={`px-1.5 py-0.5 sm:px-2 rounded text-[10px] sm:text-[11px] font-bold cursor-pointer transition-all ${
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
                  className={`px-1.5 py-0.5 sm:px-2 rounded text-[10px] sm:text-[11px] font-bold cursor-pointer transition-all ${
                    scan.status === 'LT'
                      ? 'bg-amber-600 text-white'
                      : 'bg-surface-secondary text-ink-muted hover:text-ink'
                  }`}
                >
                  LT
                </button>
                <button
                  type="button"
                  onClick={() => onOverrideStatus(s?._id, 'A')}
                  className={`px-1.5 py-0.5 sm:px-2 rounded text-[10px] sm:text-[11px] font-bold cursor-pointer transition-all ${
                    scan.status === 'A'
                      ? 'bg-rose-600 text-white'
                      : 'bg-surface-secondary text-ink-muted hover:text-ink'
                  }`}
                >
                  A
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
