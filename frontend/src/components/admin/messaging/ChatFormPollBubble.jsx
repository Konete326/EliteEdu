import React from 'react';
import { BarChart3, FileText } from 'lucide-react';
import ChatPollCardView from './ChatPollCardView';
import ChatFormCardView from './ChatFormCardView';

const ChatFormPollBubble = ({ message, currentUserId, onFormSubmit }) => {
  const card = message.card_payload || {};
  const isPoll = card.card_type === 'Interactive_Poll';

  return (
    <div className="w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 shadow-xs">
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
            {isPoll ? <BarChart3 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
              {card.head?.title || (isPoll ? 'Quick Poll' : 'Mini Form')}
            </h4>
            {card.head?.sub_title && (
              <p className="text-[10px] text-slate-400 truncate">{card.head.sub_title}</p>
            )}
          </div>
        </div>
        {card.is_closed ? (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-wide">
            Closed
          </span>
        ) : (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            Active
          </span>
        )}
      </div>

      {card.body?.text && (
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 whitespace-pre-wrap">
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
