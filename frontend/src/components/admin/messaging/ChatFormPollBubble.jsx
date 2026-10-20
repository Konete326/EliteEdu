import React from 'react';
import { BarChart3, FileText } from 'lucide-react';
import ChatPollCardView from './ChatPollCardView';
import ChatFormCardView from './ChatFormCardView';

const ChatFormPollBubble = ({ message, currentUserId, onFormSubmit }) => {
  const card = message.card_payload || {};
  const isPoll = card.card_type === 'Interactive_Poll';

  return (
    <div className="w-72 sm:w-80 bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark p-3.5 shadow-xs">
      <div className="flex items-start justify-between gap-2 border-b border-line dark:border-line-dark pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
            {isPoll ? <BarChart3 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-ink dark:text-ink-dark truncate">
              {card.head?.title || (isPoll ? 'Quick Poll' : 'Mini Form')}
            </h4>
            {card.head?.sub_title && (
              <p className="text-[10px] text-ink-muted truncate">{card.head.sub_title}</p>
            )}
          </div>
        </div>
        {card.is_closed ? (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted uppercase tracking-wide">
            Closed
          </span>
        ) : (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            Active
          </span>
        )}
      </div>

      {card.body?.text && (
        <p className="text-xs text-ink-sub dark:text-ink-sub-dark mt-2 whitespace-pre-wrap">
          {card.body.text}
        </p>
      )}

      {isPoll ? (
        <ChatPollCardView
          message={message}
          card={card}
          currentUserId={currentUserId}
          onFormSubmit={onFormSubmit}
        />
      ) : (
        <ChatFormCardView
          message={message}
          card={card}
          currentUserId={currentUserId}
          onFormSubmit={onFormSubmit}
        />
      )}
    </div>
  );
};

export default ChatFormPollBubble;
