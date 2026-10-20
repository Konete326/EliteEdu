import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Copy, Check, RefreshCw } from 'lucide-react';

const ZoomConnectionStatusCard = ({ settings, onTestConnection, testing }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!settings?.webhook_url) return;
    navigator.clipboard.writeText(settings.webhook_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isActive = Boolean(settings?.is_active);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3.5 h-3.5 rounded-full ${isActive ? 'bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950' : 'bg-slate-300 dark:bg-slate-700'}`} />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {isActive ? 'Zoom Bridge Active' : 'Zoom Bridge Inactive'}
            </h4>
            <p className="text-xs text-slate-500">
              {settings?.last_verified_at
                ? `Last verified: ${new Date(settings.last_verified_at).toLocaleString()}`
                : 'Not verified yet'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onTestConnection}
          disabled={testing}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Webhook Endpoint URL (Provide this in Zoom App Marketplace)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={settings?.webhook_url || ''}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-200 select-all outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZoomConnectionStatusCard;
