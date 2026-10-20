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
        <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900 text-xs">
          <div className="min-w-0 flex items-center gap-2">
            <Pencil className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-amber-700 dark:text-amber-400 block text-[10px]">
                Editing message
              </span>
              <p className="truncate text-slate-600 dark:text-slate-300">{editingMessage.message_text}</p>
            </div>
          </div>
          <button type="button" onClick={onCancelEdit} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {replyingTo && (
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900">
          <div className="min-w-0 text-xs">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block text-[10px]">
              Replying to {replyingTo.sender_name}
            </span>
            <p className="truncate text-slate-500">{replyingTo.message_text}</p>
          </div>
          <button type="button" onClick={onCancelReply} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {attachment && (
        <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            {attachment.uploading ? (
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
            ) : attachment.isImage ? (
              <img src={attachment.dataUrl} alt="" className="w-6 h-6 rounded-md object-cover border border-indigo-200 dark:border-indigo-800 shrink-0" />
            ) : (
              <ImageIcon className="w-4 h-4 text-indigo-600 shrink-0" />
            )}
            <div className="min-w-0">
              <span className="truncate font-semibold text-indigo-700 dark:text-indigo-300 text-[11px] block">
                {attachment.uploading ? 'Uploading image to Cloudinary...' : `Attached: ${attachment.name}`}
              </span>
            </div>
          </div>
          <button type="button" onClick={onCancelAttachment} className="p-1 text-slate-400 hover:text-red-500">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ComposerPreviewBar;
