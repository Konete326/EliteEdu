import React from 'react';
import { Paperclip, Smile, Megaphone, BarChart3 } from 'lucide-react';

const ComposerActionButtons = ({
  onAttachFile,
  showEmoji,
  onToggleEmoji,
  onOpenCardModal,
  onOpenFormPollModal
}) => (
  <div className="hidden sm:flex items-center gap-1">
    <button
      type="button"
      onClick={onAttachFile}
      className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors"
      title="Attach file"
    >
      <Paperclip className="w-5 h-5" />
    </button>
    <button
      type="button"
      onClick={onToggleEmoji}
      className={`p-2 rounded-xl transition-colors ${showEmoji ? 'text-amber-500 bg-amber-500/10' : 'text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark'}`}
      title="Quick emojis"
    >
      <Smile className="w-5 h-5" />
    </button>
    <button
      type="button"
      onClick={onOpenCardModal}
      className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-colors"
      title="Notice & Action Card"
    >
      <Megaphone className="w-5 h-5" />
    </button>
    <button
      type="button"
      onClick={onOpenFormPollModal}
      className="p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
      title="Quick Poll or Form"
    >
      <BarChart3 className="w-5 h-5" />
    </button>
  </div>
);

export default ComposerActionButtons;
