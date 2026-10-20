import React from 'react';
import { Search, X } from 'lucide-react';

const ChatSearchBar = ({ searchTerm, onSearchChange, onClose, matchCount = 0 }) => {
  return (
    <div className="px-4 py-2 bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-line dark:border-line-dark z-20 flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2 bg-surface-secondary dark:bg-surface-secondary-dark rounded-xl px-3 py-1.5 border border-line dark:border-line-dark focus-within:border-primary transition-colors">
        <Search className="w-4 h-4 text-ink-muted shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              if (searchTerm) onSearchChange('');
              else onClose();
            }
          }}
          placeholder="Search in conversation (messages, cards, sender, attachments)..."
          className="flex-1 bg-transparent text-xs text-ink dark:text-ink-dark placeholder:text-ink-muted outline-none"
          autoFocus
        />
        {searchTerm && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              matchCount > 0
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
            }`}>
              {matchCount > 0 ? `${matchCount} found` : 'No matches'}
            </span>
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-1 rounded-md text-ink-muted hover:text-ink"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="px-2.5 py-1.5 text-xs font-semibold text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark rounded-xl transition-colors"
      >
        Done
      </button>
    </div>
  );
};

export default ChatSearchBar;
