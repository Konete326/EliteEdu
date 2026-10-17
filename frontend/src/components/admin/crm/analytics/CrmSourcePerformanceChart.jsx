import React from 'react';
import { Globe } from 'lucide-react';

export default function CrmSourcePerformanceChart({ sources = [] }) {
  return (
    <div className="p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-line dark:border-line-dark pb-2">
        <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" /> Lead Source Performance
        </h3>
      </div>

      <div className="space-y-3">
        {sources.length === 0 ? (
          <p className="text-xs text-text-muted py-8 text-center">No source telemetry available.</p>
        ) : (
          sources.map((s) => (
            <div key={s.source} className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-text-primary dark:text-text-primary-dark">{s.source}</span>
                <span className="text-emerald-600 font-mono">{s.rate}% converted</span>
              </div>
              <div className="flex justify-between text-[11px] text-text-muted">
                <span>Total Leads: {s.total}</span>
                <span>Enrolled: {s.converted}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, s.rate)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
