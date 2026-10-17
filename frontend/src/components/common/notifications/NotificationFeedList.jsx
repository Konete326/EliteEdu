import { BellOff, ChevronLeft, ChevronRight } from 'lucide-react';
import NotificationFilterBar from './NotificationFilterBar';
import NotificationCard from './NotificationCard';

const NotificationFeedList = ({
  notifications = [],
  loading,
  search,
  setSearch,
  category,
  setCategory,
  unreadOnly,
  setUnreadOnly,
  unreadCount = 0,
  page = 1,
  totalPages = 1,
  total = 0,
  onPageChange,
  isAdmin,
  onToggleRead,
  onDelete,
  onNavigate,
  onMarkAllRead
}) => {
  return (
    <div className="space-y-4">
      <NotificationFilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        unreadOnly={unreadOnly}
        setUnreadOnly={setUnreadOnly}
        onMarkAllRead={onMarkAllRead}
        unreadCount={unreadCount}
      />

      {loading ? (
        <div className="p-12 text-center bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-ink-muted">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl space-y-2">
          <BellOff className="w-8 h-8 text-ink-muted mx-auto opacity-50" />
          <p className="text-sm font-semibold text-ink dark:text-ink-dark">No notifications found</p>
          <p className="text-xs text-ink-muted">There are no matching notifications or announcements in this view.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationCard
              key={n._id}
              notification={n}
              isAdmin={isAdmin}
              onToggleRead={onToggleRead}
              onDelete={onDelete}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 text-xs">
          <span className="text-ink-muted">
            Page {page} of {totalPages} ({total} alerts)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/5 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/5 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationFeedList;
