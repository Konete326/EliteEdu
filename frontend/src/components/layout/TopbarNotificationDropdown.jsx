import { CheckCheck, ExternalLink } from 'lucide-react';

const TopbarNotificationDropdown = ({
  notifications = [],
  unreadCount = 0,
  onMarkAllRead,
  onClickItem,
  viewAllPath,
  onClose
}) => {
  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-ink dark:text-ink-dark">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button type="button" onClick={onMarkAllRead} className="flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer">
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-72 overflow-y-auto divide-y divide-line dark:divide-white/5">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-ink-muted">No notifications yet</div>
        ) : (
          notifications.map((n) => (
            <button
              key={n._id}
              type="button"
              onClick={() => onClickItem(n)}
              className={`w-full text-left p-3 flex items-start gap-2.5 hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors cursor-pointer ${
                !n.is_read ? 'bg-primary/5 dark:bg-primary/10 font-medium' : ''
              }`}
            >
              <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.is_read ? 'bg-primary' : 'bg-transparent'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="font-bold text-ink dark:text-ink-dark truncate">{n.title}</p>
                  <span className="text-[10px] text-ink-muted shrink-0">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-[11px] text-ink-muted line-clamp-2 mt-0.5">{n.message}</p>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="p-2 border-t border-line dark:border-white/10 bg-surface-alt dark:bg-white/5 text-center">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-1.5 text-xs font-semibold text-primary hover:underline flex items-center justify-center gap-1 cursor-pointer"
        >
          View All Notifications <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default TopbarNotificationDropdown;
