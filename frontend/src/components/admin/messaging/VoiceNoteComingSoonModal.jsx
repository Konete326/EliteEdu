import React from 'react';
import { createPortal } from 'react-dom';
import { Mic, X, Sparkles, Radio } from 'lucide-react';

const VoiceNoteComingSoonModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-surface dark:bg-surface-dark rounded-3xl border border-line dark:border-line-dark shadow-2xl max-w-sm w-full p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-ink-muted hover:text-ink rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-4 relative shadow-xs">
          <Mic className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-surface dark:border-surface-dark flex items-center justify-center text-white">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
          </span>
        </div>

        <div className="flex items-center gap-1.5 mb-1">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Coming Soon
          </span>
        </div>

        <h3 className="text-base font-bold text-ink dark:text-ink-dark mt-2">
          Voice Notes & Audio Memos
        </h3>

        <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-2 leading-relaxed">
          Instant high-fidelity voice notes, hands-free audio recording, and real-time speech transcription are currently in active development for the messaging studio.
        </p>

        <div className="mt-4 p-3 rounded-2xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-[11px] text-ink-sub dark:text-ink-sub-dark flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span>Will support studio mic recording and audio preview playback.</span>
        </div>

        <div className="mt-6 pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow-xs transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default VoiceNoteComingSoonModal;
