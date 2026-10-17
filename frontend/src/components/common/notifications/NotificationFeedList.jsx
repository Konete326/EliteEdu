import { BellOff } from 'lucide-react';
import NotificationFilterBar from './NotificationFilterBar';
import NotificationCard from './NotificationCard';
import NotificationPagination from './NotificationPagination';

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
  limit = 6,
  onLimitChange,
  onPageChange,
  isAdmin,
  onToggleRead,
  onDelete,
  onNavigate,
  onMarkAllRead
}) => {
  return (
    <div className="h-full flex flex-col min-h-0 gap-3">
      <div className="shrink-0">
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
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {loading ? (
          <div className="h-full min-h-[160px] flex flex-col items-center justify-center p-8 text-center bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-ink-muted">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="h-full min-h-[160px] flex flex-col items-center justify-center p-8 text-center bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl space-y-2">
            <BellOff className="w-8 h-8 text-ink-muted mx-auto opacity-50" />
            <p className="text-sm font-semibold text-ink dark:text-ink-dark">No notifications found</p>
            <p className="text-xs text-ink-muted max-w-sm">There are no matching notifications or announcements in this view.</p>
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
      </div>

      <div className="shrink-0">
        <NotificationPagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      </div>
    </div>
  );
};

export default NotificationFeedList;
