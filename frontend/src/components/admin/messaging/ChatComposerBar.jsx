import React, { useState } from 'react';
import { Send, Mic, Check, Plus } from 'lucide-react';
import ComposerPreviewBar from './ComposerPreviewBar';
import SlashCommandMenu from './SlashCommandMenu';
import ComposerEmojiPicker from './ComposerEmojiPicker';
import ComposerMobileMenu from './ComposerMobileMenu';
import ComposerActionButtons from './ComposerActionButtons';
import VoiceNoteComingSoonModal from './VoiceNoteComingSoonModal';
import { useChatComposer } from './useChatComposer';

const ChatComposerBar = ({
  onSendMessage, onOpenCardModal, onOpenFormPollModal, replyingTo,
  onCancelReply, editingMessage, onSaveEdit, onCancelEdit, sending = false
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const c = useChatComposer({
    onSendMessage, replyingTo, onCancelReply, editingMessage, onSaveEdit, onCancelEdit, sending
  });

  const handleAction = (e) => {
    if (editingMessage || c.hasContent) {
      c.handleSend(e);
    } else {
      setShowVoiceModal(true);
    }
  };

  return (
    <div className="relative bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-md border-t border-line dark:border-line-dark p-2 sm:p-3 z-20 shrink-0">
      {c.text.startsWith('/') && (
        <SlashCommandMenu query={c.text} onSelect={(val) => { c.setText(val); c.textInputRef.current?.focus(); }} />
      )}

      <ComposerEmojiPicker
        isOpen={c.showEmoji}
        onSelect={(em) => { c.setText((p) => p + em); c.setShowEmoji(false); c.textInputRef.current?.focus(); }}
      />

      <ComposerMobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        onAttachFile={() => c.fileInputRef.current?.click()}
        onOpenEmoji={() => c.setShowEmoji((v) => !v)}
        onOpenCardModal={onOpenCardModal}
        onOpenFormPollModal={onOpenFormPollModal}
      />

      <VoiceNoteComingSoonModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
      />

      <ComposerPreviewBar
        replyingTo={replyingTo}
        onCancelReply={onCancelReply}
        attachment={c.attachment}
        onCancelAttachment={() => c.setAttachment(null)}
        editingMessage={editingMessage}
        onCancelEdit={() => { c.setText(''); onCancelEdit?.(); }}
      />

      <div className="flex items-center gap-1.5 sm:gap-2">
        <input ref={c.fileInputRef} type="file" onChange={c.handleFileChange} className="hidden" />

        <button
          type="button"
          onClick={() => setShowMobileMenu((v) => !v)}
          className={`sm:hidden p-2 rounded-xl transition-all ${showMobileMenu ? 'bg-primary text-white rotate-45' : 'text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark'}`}
          title="More options"
        >
          <Plus className="w-5 h-5 transition-transform" />
        </button>

        <ComposerActionButtons
          onAttachFile={() => c.fileInputRef.current?.click()}
          showEmoji={c.showEmoji}
          onToggleEmoji={() => c.setShowEmoji((v) => !v)}
          onOpenCardModal={onOpenCardModal}
          onOpenFormPollModal={onOpenFormPollModal}
        />

        <input
          ref={c.textInputRef}
          type="text"
          value={c.text}
          maxLength={4096}
          onChange={(e) => c.setText(e.target.value)}
          onKeyDown={c.handleKeyDown}
          placeholder={editingMessage ? 'Edit your message...' : 'Type a message or / for commands...'}
          className="flex-1 min-w-0 bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark focus:border-primary rounded-xl px-3.5 sm:px-4 py-2 text-xs font-medium text-ink dark:text-ink-dark placeholder:text-ink-muted outline-none transition-all"
        />

        <button
          type="button"
          onClick={handleAction}
          disabled={sending}
          className={`p-2 sm:p-2.5 rounded-xl shadow-xs transition-all shrink-0 ${
            editingMessage
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : c.hasContent
              ? 'bg-primary hover:bg-primary-hover text-white'
              : 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:scale-105 active:scale-95'
          }`}
          title={editingMessage ? 'Save edit' : c.hasContent ? 'Send message' : 'Record voice note (Coming soon)'}
        >
          {editingMessage ? <Check className="w-4 h-4" /> : c.hasContent ? <Send className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default ChatComposerBar;
