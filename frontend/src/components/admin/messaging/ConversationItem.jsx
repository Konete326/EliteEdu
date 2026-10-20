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
      className={`group px-3.5 py-3 flex items-start gap-3 cursor-pointer transition-all border-b border-slate-100 dark:border-slate-800/60 ${
        isActive
          ? 'bg-slate-100/90 dark:bg-slate-800/90 border-l-4 border-l-[#1e1b4b]'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
      }`}
    >
      <div className="relative shrink-0">
        {conversation.is_group ? (
          <div className="w-11 h-11 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
            <Users className="w-5 h-5" />
          </div>
        ) : conversation.avatar_url ? (
          <img
            src={conversation.avatar_url}
            alt={conversation.title}
            className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-sm">
            {conversation.title ? conversation.title.slice(0, 2).toUpperCase() : 'U'}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
            {conversation.title}
          </h4>
          <span className="text-[10px] text-slate-400 font-medium shrink-0">
            {formatTime(conversation.last_message_at)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex-1">
            {conversation.last_message_text || (
              <span className="italic text-slate-400">No messages yet</span>
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
                  : 'text-slate-300 dark:text-slate-600 hover:text-slate-400'
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
