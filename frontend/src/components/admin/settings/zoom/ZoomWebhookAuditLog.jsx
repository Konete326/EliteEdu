import React from 'react';
import { History, Activity } from 'lucide-react';

const ZoomWebhookAuditLog = ({ logs = [] }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm pb-2 border-b border-slate-100 dark:border-slate-800">
        <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <span>Recent Webhook Event Logs</span>
      </div>

      {logs.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          <Activity className="w-6 h-6 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
          No webhook events received yet. Once configured in Zoom, incoming events will appear here.
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 text-xs"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {log.event}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    {log.status}
                  </span>
                </div>
                <p className="text-slate-500 truncate">{log.summary}</p>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ZoomWebhookAuditLog;
