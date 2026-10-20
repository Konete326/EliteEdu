import React, { useState } from 'react';
import { SquarePen, Users, RotateCw } from 'lucide-react';

const MessagingSidebarHeader = ({ user, onNewDirect, onNewGroup, onRefresh, onOpenProfile }) => {
  const [spinning, setSpinning] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'AD';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(user?.name);

  const handleRefresh = async () => {
    try {
      setSpinning(true);
      if (onRefresh) await onRefresh();
    } finally {
      setTimeout(() => setSpinning(false), 500);
    }
  };

  return (
    <div className="p-4 border-b border-line dark:border-line-dark flex items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenProfile}
          className="relative w-10 h-10 rounded-full border border-line dark:border-line-dark flex items-center justify-center font-bold text-ink dark:text-ink-dark text-sm tracking-wider shadow-2xs overflow-hidden hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer group"
          title="Click to view your profile"
        >
          {user?.photo_url || user?.avatar_url ? (
            <img src={user.photo_url || user.avatar_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              {initials}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-surface dark:border-surface-dark" />
        </button>
        <h1 className="text-xl font-extrabold text-ink dark:text-ink-dark tracking-tight">
          Messages
        </h1>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onNewDirect}
          className="p-2 rounded-xl text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors"
          title="New Direct Message"
          aria-label="New Direct Message"
        >
          <SquarePen className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onNewGroup}
          className="p-2 rounded-xl text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors"
          title="New Group & Broadcast"
          aria-label="New Group & Broadcast"
        >
          <Users className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={spinning}
          className={`p-2 rounded-xl text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors ${spinning ? 'text-primary bg-primary/10' : ''}`}
          title="Refresh Messages"
          aria-label="Refresh Messages"
        >
          <RotateCw className={`w-5 h-5 ${spinning ? 'animate-spin text-primary' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default MessagingSidebarHeader;
