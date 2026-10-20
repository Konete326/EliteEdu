import React from 'react';
import { Pin, Star, Users } from 'lucide-react';

const ContactInfoHero = ({ conversation, onTogglePin, onToggleFavorite }) => {
  const isOnline = Boolean(conversation?.is_online);

  return (
    <div className="py-4 px-5 flex flex-col items-center text-center border-b border-slate-100 dark:border-slate-800">
      <div className="relative">
        {conversation.is_group ? (
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold text-xl shadow-xs border border-indigo-100 dark:border-indigo-900">
            <Users className="w-7 h-7" />
          </div>
        ) : conversation.avatar_url ? (
          <img src={conversation.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800 shadow-xs" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-extrabold text-lg shadow-xs border border-indigo-200/60 dark:border-indigo-900">
            {conversation.title?.slice(0, 2).toUpperCase() || 'U'}
          </div>
        )}
        {!conversation.is_group && (
          <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        )}
      </div>

      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 truncate max-w-full">
        {conversation.title}
      </h4>
      <p className="text-[11px] mt-0.5 truncate flex items-center justify-center gap-1.5 font-medium">
        {!conversation.is_group && (
          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        )}
        <span className={conversation.is_group ? 'text-slate-400' : isOnline ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}>
          {conversation.is_group ? `${conversation.participants_count || 2} members` : (isOnline ? 'Online' : 'Offline')}
        </span>
      </p>

      <div className="grid grid-cols-2 gap-2.5 w-full mt-3">
        <button
          type="button"
          onClick={() => onTogglePin(conversation._id)}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border text-xs font-semibold transition-all shadow-2xs ${conversation.is_pinned ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/60 dark:border-indigo-900' : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
        >
          <Pin className={`w-3.5 h-3.5 ${conversation.is_pinned ? 'fill-current' : ''}`} />
          <span>{conversation.is_pinned ? 'Pinned' : 'Pin'}</span>
        </button>
        <button
          type="button"
          onClick={() => onToggleFavorite(conversation._id)}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border text-xs font-semibold transition-all shadow-2xs ${conversation.is_favorite ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/60 dark:border-amber-900' : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
        >
          <Star className={`w-3.5 h-3.5 ${conversation.is_favorite ? 'fill-current' : ''}`} />
          <span>{conversation.is_favorite ? 'Favorited' : 'Favorite'}</span>
        </button>
      </div>
    </div>
  );
};

export default ContactInfoHero;
