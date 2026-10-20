import React from 'react';
import { MessageSquare, MessageSquarePlus, Users } from 'lucide-react';

const ConversationEmptyState = ({ onNewDirect, onNewGroup }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
    <div className="w-14 h-14 rounded-2xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark flex items-center justify-center text-ink-muted mb-3 shadow-2xs">
      <MessageSquare className="w-7 h-7 stroke-[1.6]" />
    </div>
    <h3 className="text-sm font-bold text-ink dark:text-ink-dark mb-1">
      No conversations yet
    </h3>
    <p className="text-xs text-ink-muted max-w-[210px] leading-relaxed mb-4">
      Start a direct message or create a group to get going
    </p>
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <button
        type="button"
        onClick={onNewDirect}
        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-hover text-white flex items-center gap-1.5 shadow-xs transition-colors"
      >
        <MessageSquarePlus className="w-3.5 h-3.5" />
        <span>New Message</span>
      </button>
      <button
        type="button"
        onClick={onNewGroup}
        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-surface-secondary hover:bg-surface-secondary/80 dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark flex items-center gap-1.5 transition-colors"
      >
        <Users className="w-3.5 h-3.5" />
        <span>Create Group</span>
      </button>
    </div>
  </div>
);

export default ConversationEmptyState;
