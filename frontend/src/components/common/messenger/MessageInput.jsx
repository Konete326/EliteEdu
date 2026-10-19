import { useState } from 'react';
import { Send, Paperclip, X } from 'lucide-react';

const MessageInput = ({ onSend, sending, canPostCircular }) => {
  const [content, setContent] = useState('');
  const [showAttach, setShowAttach] = useState(false);
  const [attachUrl, setAttachUrl] = useState('');
  const [attachName, setAttachName] = useState('');
  const [isCircular, setIsCircular] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!content.trim() || sending) return;
    onSend({
      content: content.trim(),
      attachment_url: attachUrl.trim(),
      attachment_name: attachName.trim(),
      is_circular: isCircular
    });
    setContent('');
    setAttachUrl('');
    setAttachName('');
    setShowAttach(false);
    setIsCircular(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-line dark:border-line-dark bg-surface dark:bg-surface-dark space-y-2">
      {showAttach && (
        <div className="flex flex-col sm:flex-row gap-2 p-2.5 rounded-xl bg-surface-secondary/40 border border-line text-xs">
          <input
            type="url"
            value={attachUrl}
            onChange={(e) => setAttachUrl(e.target.value)}
            placeholder="Document or file link URL (e.g. Google Drive, PDF)..."
            className="flex-1 px-2.5 py-1 rounded-lg border border-line bg-surface text-xs outline-none focus:border-primary"
          />
          <input
            type="text"
            value={attachName}
            onChange={(e) => setAttachName(e.target.value)}
            placeholder="File title (e.g. Exam Timetable.pdf)..."
            className="sm:w-48 px-2.5 py-1 rounded-lg border border-line bg-surface text-xs outline-none focus:border-primary"
          />
          <button type="button" onClick={() => setShowAttach(false)} className="p-1 text-ink-muted hover:text-ink">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowAttach(!showAttach)}
          className={`p-2 rounded-xl border transition-colors ${showAttach ? 'bg-primary/10 border-primary text-primary' : 'border-line text-ink-muted hover:text-ink hover:bg-surface-secondary'}`}
          title="Attach Document Link"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <textarea
          rows={1}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type message or circular announcement (Enter to send)..."
          className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-line bg-surface-secondary/30 outline-none focus:border-primary font-medium resize-none max-h-24"
        />

        {canPostCircular && (
          <label className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-surface-secondary cursor-pointer text-[11px] font-bold text-amber-600 select-none">
            <input
              type="checkbox"
              checked={isCircular}
              onChange={(e) => setIsCircular(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Circular</span>
          </label>
        )}

        <button
          type="submit"
          disabled={!content.trim() || sending}
          className="p-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover disabled:opacity-50 shadow-sm transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
