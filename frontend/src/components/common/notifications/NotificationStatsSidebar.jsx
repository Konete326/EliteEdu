import { Bell, AlertTriangle, ShieldAlert, Sparkles, Filter } from 'lucide-react';

const CATEGORIES = [
  'All', 'Announcement', 'Academic', 'Attendance', 'Promotion', 'Admission', 'Security'
];

const NotificationStatsSidebar = ({
  total = 0,
  unreadCount = 0,
  urgentCount = 0,
  activeCategory = 'All',
  onSelectCategory
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-4 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-ink dark:text-ink-dark flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-primary" /> Notifications Overview
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-surface-secondary/50 dark:bg-white/5 border border-line dark:border-white/5">
            <p className="text-[10px] text-ink-muted">Total</p>
            <p className="text-sm font-bold text-ink dark:text-ink-dark">{total}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-[10px] text-primary">Unread</p>
            <p className="text-sm font-bold text-primary">{unreadCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-bad/10 border border-bad/20">
            <p className="text-[10px] text-bad">Urgent</p>
            <p className="text-sm font-bold text-bad">{urgentCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-4 shadow-xs space-y-2.5">
        <h4 className="text-xs font-bold text-ink dark:text-ink-dark flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-primary" /> Filter by Category
        </h4>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-surface-secondary/40 dark:bg-white/5 text-ink dark:text-ink-dark hover:bg-surface-secondary'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Sync</span>
        </div>
        <p className="text-[11px] text-ink-muted leading-relaxed">
          Notifications refresh live every 20 seconds. Clicking an item marks it as read and redirects to relevant workflow pages.
        </p>
      </div>
    </div>
  );
};

export default NotificationStatsSidebar;
