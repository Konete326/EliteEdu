import React from 'react';
import { Search, X } from 'lucide-react';

const MessagingSidebarSearch = ({ value, onChange }) => (
  <div className="px-4 pt-3 pb-2">
    <div className="relative flex items-center">
      <Search className="w-4 h-4 text-ink-muted absolute left-3.5 pointer-events-none z-10" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search conversations..."
        className="w-full bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark focus:border-primary rounded-xl pl-10 pr-8 py-2 text-xs font-medium text-ink dark:text-ink-dark placeholder:text-ink-muted outline-none transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 p-1 rounded-md text-ink-muted hover:text-ink z-10"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </div>
);

export default MessagingSidebarSearch;
