import React from 'react';
import { X, Pencil, Loader2, Image as ImageIcon } from 'lucide-react';

const ComposerPreviewBar = ({
  replyingTo,
  onCancelReply,
  attachment,
  onCancelAttachment,
  editingMessage,
  onCancelEdit
}) => {
  if (!replyingTo && !attachment && !editingMessage) return null;

  return (
    <div className="space-y-1.5 mb-2">
      {editingMessage && (
        <div className="flex items-center justify-between bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 text-xs">
          <div className="min-w-0 flex items-center gap-2">
            <Pencil className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-amber-600 dark:text-amber-400 block text-[10px]">
                Editing message
              </span>
              <p className="truncate text-ink-sub dark:text-ink-sub-dark">{editingMessage.message_text}</p>
            </div>
          </div>
          <button type="button" onClick={onCancelEdit} className="p-1 text-ink-muted hover:text-ink">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {replyingTo && (
        <div className="flex items-center justify-between bg-surface-secondary dark:bg-surface-secondary-dark px-3 py-1.5 rounded-xl border border-primary/30">
          <div className="min-w-0 text-xs">
            <span className="font-bold text-primary block text-[10px]">
              Replying to {replyingTo.sender_name}
            </span>
            <p className="truncate text-ink-muted">{replyingTo.message_text}</p>
          </div>
          <button type="button" onClick={onCancelReply} className="p-1 text-ink-muted hover:text-ink">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {attachment && (
        <div className="flex items-center justify-between bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            {attachment.uploading ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
            ) : attachment.isImage ? (
              <img src={attachment.dataUrl} alt="" className="w-6 h-6 rounded-md object-cover border border-primary/20 shrink-0" />
            ) : (
              <ImageIcon className="w-4 h-4 text-primary shrink-0" />
            )}
            <div className="min-w-0">
              <span className="truncate font-semibold text-primary text-[11px] block">
                {attachment.uploading ? 'Uploading image...' : `Attached: ${attachment.name}`}
              </span>
            </div>
          </div>
          <button type="button" onClick={onCancelAttachment} className="p-1 text-ink-muted hover:text-red-500">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ComposerPreviewBar;
