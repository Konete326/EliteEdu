import { Search, CheckCheck } from 'lucide-react';

const CATEGORIES = ['All', 'Announcement', 'Academic', 'Attendance', 'Promotion', 'Admission', 'Security'];

const NotificationFilterBar = ({
  search,
  setSearch,
  category,
  setCategory,
  unreadOnly,
  setUnreadOnly,
  onMarkAllRead,
  unreadCount = 0
}) => {
  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications by title or message..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-surface-secondary/40 dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setUnreadOnly((prev) => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              unreadOnly
                ? 'bg-primary text-white border-primary'
                : 'bg-surface-secondary/40 dark:bg-white/5 border-line dark:border-white/10 text-ink dark:text-ink-dark hover:border-primary/50'
            }`}
          >
            Unread Only {unreadCount > 0 && `(${unreadCount})`}
          </button>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-surface-secondary/40 dark:bg-white/5 border border-line dark:border-white/10 text-primary hover:bg-primary/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-secondary/30 dark:bg-white/5 text-ink-muted hover:text-ink dark:hover:text-ink-dark'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationFilterBar;
