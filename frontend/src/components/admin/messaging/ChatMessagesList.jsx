import React, { useState, useEffect, useRef } from 'react';
import ChatMessageBubble from './ChatMessageBubble';
import ScrollToBottomButton from './ScrollToBottomButton';
import { filterChatMessages } from '../../../utils/chatSearchHelper';

const ChatMessagesList = ({
  messages = [],
  loadingMessages = false,
  currentUserId,
  conversation,
  onReply,
  onEdit,
  onDelete,
  onCardAction,
  onFormSubmit,
  searchTerm = ''
}) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const isAtBottomRef = useRef(true);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const prevLengthRef = useRef(0);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNear = scrollHeight - scrollTop - clientHeight < 80;
    isAtBottomRef.current = isNear;
    setShowScrollBottom(!isNear);
  };

  useEffect(() => {
    if (messages.length === 0) return;
    if (isAtBottomRef.current || prevLengthRef.current === 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevLengthRef.current = messages.length;
  }, [messages.length]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollBottom(false);
    isAtBottomRef.current = true;
  };

  const filtered = filterChatMessages(messages, searchTerm);

  return (
    <div className="flex-1 min-h-0 relative flex flex-col">
      <div ref={containerRef} onScroll={handleScroll} className="flex-1 min-h-0 overflow-y-auto p-4 z-10 flex flex-col justify-start">
        {loadingMessages && filtered.length === 0 ? (
          <div className="space-y-4 p-2 animate-pulse my-auto">
            <div className="flex justify-start"><div className="w-48 h-9 rounded-2xl rounded-tl-none bg-line/70 dark:bg-line-dark/70" /></div>
            <div className="flex justify-end"><div className="w-56 h-10 rounded-2xl rounded-tr-none bg-primary/20" /></div>
            <div className="flex justify-start"><div className="w-40 h-8 rounded-2xl rounded-tl-none bg-line/70 dark:bg-line-dark/70" /></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="my-auto text-center py-10 select-none">
            <div className="inline-flex flex-col items-center gap-1.5 px-5 py-3 rounded-2xl bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-sm border border-line dark:border-line-dark shadow-2xs max-w-sm">
              <span className="text-xs font-semibold text-ink dark:text-ink-dark">
                {searchTerm ? `No messages found matching "${searchTerm}"` : 'No messages yet • Say hello!'}
              </span>
              {searchTerm && (
                <span className="text-[11px] text-ink-muted">Search matches sender name, message text, card titles, and files.</span>
              )}
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
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-sm border border-line dark:border-line-dark text-ink-muted uppercase tracking-wider shadow-2xs">
                      {currDate === new Date().toDateString()
                        ? 'Today'
                        : new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}
                <ChatMessageBubble
                  message={msg}
                  currentUserId={currentUserId}
                  conversation={conversation}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onCardAction={onCardAction}
                  onFormSubmit={onFormSubmit}
                  searchTerm={searchTerm}
                />
              </React.Fragment>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
      <ScrollToBottomButton visible={showScrollBottom} onClick={scrollToBottom} />
    </div>
  );
};

export default ChatMessagesList;
