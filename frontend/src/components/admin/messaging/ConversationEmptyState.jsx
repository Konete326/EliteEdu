import React from 'react';
import { MessageSquare, MessageSquarePlus, Users } from 'lucide-react';

const ConversationEmptyState = ({ onNewDirect, onNewGroup }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center text-slate-400 mb-3 shadow-2xs">
      <MessageSquare className="w-7 h-7 stroke-[1.6]" />
    </div>
    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
      No conversations yet
    </h3>
    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[210px] leading-relaxed mb-4">
      Start a direct message or create a group to get going
    </p>
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <button
        type="button"
        onClick={onNewDirect}
        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#1e1b4b] hover:bg-indigo-900 text-white flex items-center gap-1.5 shadow-xs transition-colors"
      >
        <MessageSquarePlus className="w-3.5 h-3.5" />
        <span>New Message</span>
      </button>
      <button
        type="button"
        onClick={onNewGroup}
        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
      >
        <Users className="w-3.5 h-3.5" />
        <span>Create Group</span>
      </button>
    </div>
  </div>
);

export default ConversationEmptyState;
