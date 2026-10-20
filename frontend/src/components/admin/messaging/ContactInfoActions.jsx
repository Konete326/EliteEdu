import React from 'react';
import { HardDrive, Bell, BellOff, Clock, Download, Eraser, Trash2 } from 'lucide-react';

const ContactInfoActions = ({
  conversation,
  messages = [],
  onUpdateSettings,
  onOpenExportModal,
  onOpenClearModal,
  onOpenDeleteModal
}) => {
  const isMuted = Boolean(conversation?.is_muted);
  const isDisappearing = Boolean(conversation?.disappearing_messages);

  const totalChars = messages.reduce((acc, m) => acc + (m.message_text?.length || 0), 0);
  const mediaCount = messages.filter((m) => m.attachment_url).length;
  const approxKb = Math.max(1, Math.round(totalChars / 1024) + mediaCount * 12);
  const storageLabel = messages.length === 0 ? 'No media stored' : `${approxKb} KB stored • ${messages.length} msgs`;

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <HardDrive className="w-5 h-5 text-slate-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white">Manage storage</h5>
            <p className="text-[11px] text-slate-500 truncate">{storageLabel}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onUpdateSettings(conversation._id, { is_muted: !isMuted })}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            {isMuted ? <BellOff className="w-5 h-5 text-rose-500 shrink-0" /> : <Bell className="w-5 h-5 text-slate-500 shrink-0" />}
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Notifications</h5>
              <p className="text-[11px] text-slate-500">{isMuted ? 'Muted' : 'All notifications'}</p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isMuted ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
            {isMuted ? 'Muted' : 'Active'}
          </span>
        </button>

        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <Clock className="w-5 h-5 text-slate-500 shrink-0" />
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Disappearing messages</h5>
              <p className="text-[11px] text-slate-500">{isDisappearing ? 'On — 24h auto-expiry' : 'Off — messages stay in chat'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSettings(conversation._id, { disappearing_messages: !isDisappearing })}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${isDisappearing ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDisappearing ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <button
          type="button"
          onClick={onOpenExportModal}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export chat</span>
        </button>
        <button
          type="button"
          onClick={onOpenClearModal}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
        >
          <Eraser className="w-4 h-4 text-amber-500" />
          <span>Clear chat</span>
        </button>
        <button
          type="button"
          onClick={onOpenDeleteModal}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
          <span>Delete conversation</span>
        </button>
      </div>
    </div>
  );
};

export default ContactInfoActions;
