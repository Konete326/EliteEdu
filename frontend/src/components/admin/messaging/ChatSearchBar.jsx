import React from 'react';
import { Search, X } from 'lucide-react';

const ChatSearchBar = ({ searchTerm, onSearchChange, onClose, matchCount = 0 }) => {
  return (
    <div className="px-4 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-20 flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-800/90 rounded-xl px-3 py-1.5 border border-slate-200/60 dark:border-slate-700/60 focus-within:border-indigo-400 dark:focus-within:border-indigo-500 transition-colors">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
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
          className="flex-1 bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none"
          autoFocus
        />
        {searchTerm && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              matchCount > 0
                ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900'
                : 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900'
            }`}>
              {matchCount > 0 ? `${matchCount} found` : 'No matches'}
            </span>
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
        className="px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
      >
        Done
      </button>
    </div>
  );
};

export default ChatSearchBar;
