import { Bell, Pin, Megaphone, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BroadcastJumpBar = ({ pinnedCircular, onSelectCircular, userRole }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
          <Pin className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <span className="font-bold text-amber-800 dark:text-amber-300 mr-2">Pinned Circular:</span>
          {pinnedCircular ? (
            <button
              onClick={() => onSelectCircular(pinnedCircular)}
              className="font-medium text-ink dark:text-ink-dark hover:underline truncate inline-block max-w-[280px] align-bottom"
            >
              {pinnedCircular.content}
            </button>
          ) : (
            <span className="text-ink-muted">No active circular pinned. Broadcast notices to all staff below.</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => navigate(userRole === 'Teacher' ? '/teacher/notifications' : '/admin/notifications')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface dark:bg-surface-dark border border-line text-[11px] font-bold text-ink dark:text-ink-dark hover:border-primary shadow-xs transition-colors"
        >
          <Megaphone className="w-3 h-3 text-primary" />
          <span>Notification Center</span>
          <ArrowRight className="w-3 h-3 text-ink-muted" />
        </button>
      </div>
    </div>
  );
};

export default BroadcastJumpBar;
