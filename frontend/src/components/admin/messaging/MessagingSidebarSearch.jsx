import React from 'react';
import { Search, X } from 'lucide-react';

const MessagingSidebarSearch = ({ value, onChange }) => (
  <div className="px-4 pt-3 pb-2">
    <div className="relative flex items-center">
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none z-10" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search conversations..."
        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-slate-300 dark:focus:border-slate-600 rounded-xl pl-10 pr-8 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </div>
);

export default MessagingSidebarSearch;
