import React from 'react';
import { Filter } from 'lucide-react';

export default function CrmPipelineFunnelChart({ funnel = [], totalLeads = 0 }) {
  const max = Math.max(1, ...funnel.map((f) => f.count));

  return (
    <div className="p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-line dark:border-line-dark pb-2">
        <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" /> Admissions Funnel
        </h3>
        <span className="text-xs text-text-muted">Total: {totalLeads}</span>
      </div>

      <div className="space-y-3">
        {funnel.length === 0 ? (
          <p className="text-xs text-text-muted py-8 text-center">No funnel data available.</p>
        ) : (
          funnel.map((item) => {
            const pct = Math.round((item.count / max) * 100);
            return (
              <div key={item.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text-secondary">{item.stage}</span>
                  <span className="font-bold text-text-primary dark:text-text-primary-dark">{item.count} leads</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
