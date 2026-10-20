import React from 'react';
import { MessageSquarePlus, Users, LayoutList } from 'lucide-react';

const MessagingSidebarHeader = ({ user, onNewDirect, onNewGroup, onRefresh }) => {
  const getInitials = (name) => {
    if (!name) return 'DE';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(user?.name);

  return (
    <div className="p-4 border-b border-slate-150 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-sm tracking-wider shadow-2xs select-none">
          {initials}
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Messages
        </h1>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onNewDirect}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="New Direct Message"
        >
          <MessageSquarePlus className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onNewGroup}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="New Group / Class Broadcast"
        >
          <Users className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onRefresh}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Refresh Messages"
        >
          <LayoutList className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessagingSidebarHeader;
