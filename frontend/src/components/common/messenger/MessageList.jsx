import { useEffect, useRef } from 'react';
import { Pin, Paperclip, Download, User } from 'lucide-react';

const MessageList = ({ messages = [], currentUserId, onTogglePin, canPin }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-ink-muted">
        <p className="text-xs font-semibold">No messages in this thread yet.</p>
        <p className="text-[11px] mt-1">Start the conversation below.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => {
        const isMe = String(msg.sender_id?._id || msg.sender_id) === String(currentUserId);
        const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
            {!isMe && (
              <span className="text-[10px] font-bold text-ink-muted mb-0.5 ml-2">
                {msg.sender_id?.name || 'Staff'} ({msg.sender_id?.role || 'Staff'})
              </span>
            )}

            <div
              className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs space-y-1.5 shadow-xs relative group ${
                isMe
                  ? 'bg-primary text-white rounded-br-none'
                  : msg.is_circular
                  ? 'bg-amber-500/10 border border-amber-500/30 text-ink dark:text-ink-dark rounded-bl-none'
                  : 'bg-surface dark:bg-surface-dark border border-line text-ink dark:text-ink-dark rounded-bl-none'
              }`}
            >
              {msg.is_circular && (
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-amber-500/20 text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
                  <span>Official Circular</span>
                  {canPin && (
                    <button
                      onClick={() => onTogglePin(msg._id)}
                      className="p-0.5 hover:bg-amber-500/20 rounded text-amber-700 dark:text-amber-300"
                      title={msg.is_pinned ? 'Unpin Circular' : 'Pin Circular'}
                    >
                      <Pin className={`w-3 h-3 ${msg.is_pinned ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>
              )}

              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

              {msg.attachment_url && (
                <a
                  href={msg.attachment_url}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-2 p-2 rounded-xl text-[11px] font-semibold border ${
                    isMe
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                      : 'bg-surface-secondary/50 border-line text-primary hover:underline'
                  }`}
                >
                  <Paperclip className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate flex-1">{msg.attachment_name || 'Attached Document'}</span>
                  <Download className="w-3.5 h-3.5 shrink-0" />
                </a>
              )}

              <div className={`text-[9px] text-right font-mono ${isMe ? 'text-white/70' : 'text-ink-muted'}`}>
                {time}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
