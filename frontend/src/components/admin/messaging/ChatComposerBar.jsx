import React from 'react';
import { Send, Paperclip, Sparkles, Smile, Mic, Check } from 'lucide-react';
import ComposerPreviewBar from './ComposerPreviewBar';
import SlashCommandMenu from './SlashCommandMenu';
import ComposerEmojiPicker from './ComposerEmojiPicker';
import { useChatComposer } from './useChatComposer';

const ChatComposerBar = ({
  onSendMessage,
  onOpenCardModal,
  replyingTo,
  onCancelReply,
  editingMessage,
  onSaveEdit,
  onCancelEdit,
  sending = false
}) => {
  const c = useChatComposer({
    onSendMessage,
    replyingTo,
    onCancelReply,
    editingMessage,
    onSaveEdit,
    onCancelEdit,
    sending
  });

  return (
    <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 z-20 shrink-0">
      {c.text.startsWith('/') && (
        <SlashCommandMenu
          query={c.text}
          onSelect={(val) => {
            c.setText(val);
            c.textInputRef.current?.focus();
          }}
        />
      )}

      <ComposerEmojiPicker
        isOpen={c.showEmoji}
        onSelect={(em) => {
          c.setText((p) => p + em);
          c.setShowEmoji(false);
          c.textInputRef.current?.focus();
        }}
      />

      <ComposerPreviewBar
        replyingTo={replyingTo}
        onCancelReply={onCancelReply}
        attachment={c.attachment}
        onCancelAttachment={() => c.setAttachment(null)}
        editingMessage={editingMessage}
        onCancelEdit={() => {
          c.setText('');
          onCancelEdit?.();
        }}
      />

      <div className="flex items-center gap-2">
        <input ref={c.fileInputRef} type="file" onChange={c.handleFileChange} className="hidden" />
        <button
          type="button"
          onClick={() => c.fileInputRef.current?.click()}
          className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => c.setShowEmoji((v) => !v)}
          className={`p-2.5 rounded-xl transition-colors ${c.showEmoji ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          title="Quick emojis"
        >
          <Smile className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onOpenCardModal}
          className="p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
          title="Send action card"
        >
          <Sparkles className="w-5 h-5" />
        </button>
        <input
          ref={c.textInputRef}
          type="text"
          value={c.text}
          maxLength={4096}
          onChange={(e) => c.setText(e.target.value)}
          onKeyDown={c.handleKeyDown}
          placeholder={editingMessage ? 'Edit your message...' : 'Type a message or / for commands...'}
          className="flex-1 bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-slate-300 dark:focus:border-slate-600 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all"
        />
        <button
          type="button"
          onClick={c.handleSend}
          disabled={!c.hasContent || sending}
          className={`p-2.5 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors ${editingMessage ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#1e1b4b] hover:bg-indigo-900'}`}
          title={editingMessage ? 'Save edit' : 'Send message'}
        >
          {editingMessage ? <Check className="w-4 h-4" /> : c.hasContent ? <Send className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default ChatComposerBar;
