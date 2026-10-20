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
    <div className="h-16 px-4 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-line dark:border-line-dark flex items-center justify-between gap-3 z-20 shrink-0">
      <div onClick={onToggleContactInfo} className="flex items-center gap-3 min-w-0 cursor-pointer hover:opacity-90 transition-opacity">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          className="md:hidden p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative shrink-0">
          {conversation.is_group ? (
            conversation.avatar_url ? (
              <img src={conversation.avatar_url} alt={conversation.title} className="w-10 h-10 rounded-full object-cover border border-primary/20" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                <Users className="w-5 h-5" />
              </div>
            )
          ) : conversation.avatar_url ? (
            <img src={conversation.avatar_url} alt={conversation.title} className="w-10 h-10 rounded-full object-cover border border-line dark:border-line-dark" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
              {conversation.title ? conversation.title.slice(0, 2).toUpperCase() : 'U'}
            </div>
          )}
          {!conversation.is_group && (
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-surface dark:border-surface-dark ${conversation.is_online ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          )}
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-bold text-ink dark:text-ink-dark truncate">{conversation.title}</h3>
          <p className="text-[11px] text-ink-sub dark:text-ink-sub-dark truncate font-medium">
            {conversation.is_group ? conversation.subtitle : (conversation.is_online ? 'Online' : 'Offline')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onToggleSearch}
          className={`p-2 rounded-xl transition-colors ${
            searchVisible ? 'bg-primary/10 text-primary' : 'text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark'
          }`}
          title="Search in messages"
        >
          <Search className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onToggleFavorite(conversation._id)}
          className={`p-2 rounded-xl transition-colors ${
            conversation.is_favorite ? 'text-amber-400 hover:text-amber-500' : 'text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark'
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
            isSpinning ? 'bg-primary/10 text-primary' : 'text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark'
          }`}
          title="Refresh chat"
        >
          <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
        </button>
        <button
          type="button"
          onClick={onToggleContactInfo}
          className={`p-2 rounded-xl transition-colors ${
            isContactInfoOpen ? 'bg-primary/10 text-primary' : 'text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark'
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
