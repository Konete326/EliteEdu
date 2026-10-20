import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatAreaEmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none z-10">
    <div className="w-16 h-16 rounded-2xl bg-surface dark:bg-surface-secondary-dark border border-line dark:border-line-dark shadow-xs flex items-center justify-center text-ink-muted mb-4">
      <MessageSquare className="w-8 h-8 stroke-[1.6]" />
    </div>
    <h2 className="text-base font-extrabold text-ink dark:text-ink-dark tracking-tight mb-1">
      Select a conversation
    </h2>
    <p className="text-xs text-ink-muted font-medium">
      Select a conversation or start a new one
    </p>
  </div>
);

export default ChatAreaEmptyState;
