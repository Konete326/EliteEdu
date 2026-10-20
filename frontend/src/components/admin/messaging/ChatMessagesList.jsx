import React, { useEffect, useRef } from 'react';
import ChatMessageBubble from './ChatMessageBubble';

const ChatMessagesList = ({
  messages = [],
  loadingMessages = false,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  onCardAction,
  searchTerm = ''
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const filtered = searchTerm
    ? messages.filter((m) =>
        m.message_text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : messages;

  return (
    <div className="flex-1 overflow-y-auto p-4 z-10 flex flex-col justify-start">
      {loadingMessages && filtered.length === 0 ? (
        <div className="space-y-4 p-2 animate-pulse my-auto">
          <div className="flex justify-start">
            <div className="w-48 h-9 rounded-2xl rounded-tl-none bg-slate-200/70 dark:bg-slate-800/70" />
          </div>
          <div className="flex justify-end">
            <div className="w-56 h-10 rounded-2xl rounded-tr-none bg-indigo-100/70 dark:bg-indigo-950/60" />
          </div>
          <div className="flex justify-start">
            <div className="w-40 h-8 rounded-2xl rounded-tl-none bg-slate-200/70 dark:bg-slate-800/70" />
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="my-auto text-center py-10 select-none">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700 text-slate-500 text-xs font-semibold shadow-2xs">
            {searchTerm ? 'No matching messages found' : 'No messages yet • Say hello!'}
          </div>
        </div>
      ) : (
        filtered.map((msg, idx) => {
          const prevMsg = filtered[idx - 1];
          const currDate = new Date(msg.createdAt).toDateString();
          const prevDate = prevMsg ? new Date(prevMsg.createdAt).toDateString() : null;
          const showDateDivider = currDate !== prevDate;

          return (
            <React.Fragment key={msg._id || idx}>
              {showDateDivider && (
                <div className="flex justify-center my-3 select-none">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700 text-slate-500 uppercase tracking-wider shadow-2xs">
                    {currDate === new Date().toDateString()
                      ? 'Today'
                      : new Date(msg.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric'
                        })}
                  </span>
                </div>
              )}
              <ChatMessageBubble
                message={msg}
                currentUserId={currentUserId}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onCardAction={onCardAction}
              />
            </React.Fragment>
          );
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessagesList;
