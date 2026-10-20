import React from 'react';
import { Users, Star } from 'lucide-react';

const ConversationItem = ({ conversation, isActive, onSelect, onToggleFavorite }) => {
  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={() => onSelect(conversation._id)}
      className={`group px-3.5 py-3 flex items-start gap-3 cursor-pointer transition-all border-b border-line dark:border-line-dark ${
        isActive
          ? 'bg-primary/10 border-l-4 border-l-primary'
          : 'hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark/60'
      }`}
    >
      <div className="relative shrink-0">
        {conversation.avatar_url ? (
          <img
            src={conversation.avatar_url}
            alt={conversation.title}
            className="w-11 h-11 rounded-full object-cover border border-line dark:border-line-dark"
          />
        ) : conversation.is_group ? (
          <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
            <Users className="w-5 h-5" />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
            {conversation.title ? conversation.title.slice(0, 2).toUpperCase() : 'U'}
          </div>
        )}
        {!conversation.is_group && (
          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-surface dark:border-surface-dark ${conversation.is_online ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h4 className="text-xs font-bold text-ink dark:text-ink-dark truncate">
            {conversation.title}
          </h4>
          <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark font-medium shrink-0">
            {formatTime(conversation.last_message_at)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-ink-sub dark:text-ink-sub-dark truncate flex-1">
            {conversation.last_message_text || (
              <span className="italic text-ink-muted">No messages yet</span>
            )}
          </p>

          <div className="flex items-center gap-1.5 shrink-0">
            {conversation.unread_count > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shadow-2xs">
                {conversation.unread_count}
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(conversation._id);
              }}
              className={`p-1 rounded-md transition-colors ${
                conversation.is_favorite
                  ? 'text-amber-400 hover:text-amber-500'
                  : 'text-ink-muted/50 hover:text-ink-muted'
              }`}
              title={conversation.is_favorite ? 'Favorited' : 'Favorite'}
            >
              <Star className={`w-3.5 h-3.5 ${conversation.is_favorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
