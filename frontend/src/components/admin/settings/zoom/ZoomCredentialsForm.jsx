import React from 'react';
import { KeyRound, ShieldCheck, Save } from 'lucide-react';

const ZoomCredentialsForm = ({ formData, onChange, onSubmit, saving }) => {
  return (
    <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm">
          <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Zoom App Credentials (Server-to-Server OAuth)</span>
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Active</span>
          <input
            type="checkbox"
            checked={Boolean(formData.is_active)}
            onChange={(e) => onChange('is_active', e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Client ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.client_id || ''}
            onChange={(e) => onChange('client_id', e.target.value)}
            placeholder="e.g. 7mK9v8L..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Client Secret <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={formData.client_secret || ''}
            onChange={(e) => onChange('client_secret', e.target.value)}
            placeholder="••••••••••••••••"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Account ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.account_id || ''}
            onChange={(e) => onChange('account_id', e.target.value)}
            placeholder="e.g. p8Nm..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Bot JID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.bot_jid || ''}
            onChange={(e) => onChange('bot_jid', e.target.value)}
            placeholder="e.g. v1xyz...@xmpp.zoom.us"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Secret Token / Verification Token (HMAC-SHA256)
        </label>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <input
            type="text"
            value={formData.verification_token || ''}
            onChange={(e) => onChange('verification_token', e.target.value)}
            placeholder="Paste your Zoom App Secret Token"
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1e1b4b] hover:bg-indigo-900 text-white flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </form>
  );
};

export default ZoomCredentialsForm;
