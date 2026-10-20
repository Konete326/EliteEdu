import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatAreaEmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none z-10">
    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-md flex items-center justify-center text-slate-400 mb-4">
      <MessageSquare className="w-8 h-8 stroke-[1.6]" />
    </div>
    <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mb-1">
      Select a conversation
    </h2>
    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
      Select a conversation or start a new one
    </p>
  </div>
);

export default ChatAreaEmptyState;
