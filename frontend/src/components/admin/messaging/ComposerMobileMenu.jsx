import React from 'react';
import { Paperclip, Smile, Megaphone, BarChart3 } from 'lucide-react';

const ComposerMobileMenu = ({
  isOpen,
  onClose,
  onAttachFile,
  onOpenEmoji,
  onOpenCardModal,
  onOpenFormPollModal
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-30 sm:hidden" onClick={onClose} />
      <div className="absolute bottom-full left-2 mb-2 p-1.5 bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-md rounded-2xl border border-line dark:border-line-dark shadow-xl z-40 sm:hidden flex flex-col gap-1 min-w-[170px] animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={() => { onAttachFile(); onClose(); }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors text-left"
        >
          <Paperclip className="w-4 h-4 text-ink-muted" />
          <span>Attach File</span>
        </button>
        <button
          type="button"
          onClick={() => { onOpenEmoji(); onClose(); }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors text-left"
        >
          <Smile className="w-4 h-4 text-amber-500" />
          <span>Emojis</span>
        </button>
        <button
          type="button"
          onClick={() => { onOpenCardModal(); onClose(); }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors text-left"
        >
          <Megaphone className="w-4 h-4 text-primary" />
          <span>Notice & Card</span>
        </button>
        <button
          type="button"
          onClick={() => { onOpenFormPollModal(); onClose(); }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-ink dark:text-ink-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors text-left"
        >
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          <span>Quick Poll / Form</span>
        </button>
      </div>
    </>
  );
};

export default ComposerMobileMenu;
