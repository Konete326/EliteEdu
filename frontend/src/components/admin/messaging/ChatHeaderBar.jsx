import React, { useState } from 'react';
import { ArrowLeft, Users, Star, Search, RefreshCw, Info } from 'lucide-react';

const ChatHeaderBar = ({
  conversation,
  onBack,
  onToggleFavorite,
  onRefresh,
  searchVisible,
  onToggleSearch,
  onToggleContactInfo,
  isContactInfoOpen = false
}) => {
  const [isSpinning, setIsSpinning] = useState(false);

  if (!conversation) return null;

  const handleRefreshClick = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    try {
      await onRefresh?.();
    } finally {
      setTimeout(() => setIsSpinning(false), 700);
    }
  };

  return (
    <div className="h-16 px-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 z-20 shrink-0">
      <div onClick={onToggleContactInfo} className="flex items-center gap-3 min-w-0 cursor-pointer hover:opacity-90 transition-opacity">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative shrink-0">
          {conversation.is_group ? (
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 font-bold">
              <Users className="w-5 h-5" />
            </div>
          ) : conversation.avatar_url ? (
            <img src={conversation.avatar_url} alt={conversation.title} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-sm">
              {conversation.title ? conversation.title.slice(0, 2).toUpperCase() : 'U'}
            </div>
          )}
          {!conversation.is_group && (
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${conversation.is_online ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          )}
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{conversation.title}</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium flex items-center gap-1.5">
            {!conversation.is_group && (
              <span className={`w-1.5 h-1.5 rounded-full ${conversation.is_online ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            )}
            <span>{conversation.is_group ? conversation.subtitle : (conversation.is_online ? 'Online' : 'Offline')}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onToggleSearch}
          className={`p-2 rounded-xl transition-colors ${
            searchVisible ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Search in messages"
        >
          <Search className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onToggleFavorite(conversation._id)}
          className={`p-2 rounded-xl transition-colors ${
            conversation.is_favorite ? 'text-amber-400 hover:text-amber-500' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Star conversation"
        >
          <Star className={`w-4 h-4 ${conversation.is_favorite ? 'fill-current' : ''}`} />
        </button>
        <button
          type="button"
          onClick={handleRefreshClick}
          disabled={isSpinning}
          className={`p-2 rounded-xl transition-colors ${
            isSpinning ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Refresh chat"
        >
          <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
        </button>
        <button
          type="button"
          onClick={onToggleContactInfo}
          className={`p-2 rounded-xl transition-colors ${
            isContactInfoOpen ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Contact info"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeaderBar;
