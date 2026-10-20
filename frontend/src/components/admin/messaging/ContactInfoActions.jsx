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
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark">
          <HardDrive className="w-5 h-5 text-ink-muted shrink-0" />
          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-bold text-ink dark:text-ink-dark">Manage storage</h5>
            <p className="text-[11px] text-ink-muted truncate">{storageLabel}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onUpdateSettings(conversation._id, { is_muted: !isMuted })}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            {isMuted ? <BellOff className="w-5 h-5 text-rose-500 shrink-0" /> : <Bell className="w-5 h-5 text-ink-muted shrink-0" />}
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-ink dark:text-ink-dark">Notifications</h5>
              <p className="text-[11px] text-ink-muted">{isMuted ? 'Muted' : 'All notifications'}</p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isMuted ? 'bg-rose-500/10 text-rose-500' : 'bg-surface-secondary dark:bg-surface-secondary-dark text-ink-sub dark:text-ink-sub-dark'}`}>
            {isMuted ? 'Muted' : 'Active'}
          </span>
        </button>

        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <Clock className="w-5 h-5 text-ink-muted shrink-0" />
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-ink dark:text-ink-dark">Disappearing messages</h5>
              <p className="text-[11px] text-ink-muted">{isDisappearing ? 'On — 24h auto-expiry' : 'Off — messages stay in chat'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSettings(conversation._id, { disappearing_messages: !isDisappearing })}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${isDisappearing ? 'bg-primary' : 'bg-line dark:bg-line-dark'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDisappearing ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-line dark:border-line-dark space-y-1">
        <button
          type="button"
          onClick={onOpenExportModal}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors"
        >
          <Download className="w-4 h-4 text-ink-muted" />
          <span>Export chat</span>
        </button>
        <button
          type="button"
          onClick={onOpenClearModal}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-amber-500 hover:bg-amber-500/10 transition-colors"
        >
          <Eraser className="w-4 h-4 text-amber-500" />
          <span>Clear chat</span>
        </button>
        <button
          type="button"
          onClick={onOpenDeleteModal}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
          <span>Delete conversation</span>
        </button>
      </div>
    </div>
  );
};

export default ContactInfoActions;
