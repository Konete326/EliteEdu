import {
  Bell, AlertTriangle, AlertOctagon, Check, ExternalLink, Trash2,
  Calendar, GraduationCap, ShieldAlert, Sparkles, Building2
} from 'lucide-react';

const TYPE_ICONS = {
  Announcement: Bell,
  Academic: GraduationCap,
  Attendance: Calendar,
  Promotion: Sparkles,
  Admission: GraduationCap,
  Security: ShieldAlert,
  System: AlertOctagon
};

const PRIORITY_BADGES = {
  Urgent: 'bg-bad/15 text-bad border-bad/30',
  Important: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  Normal: 'bg-primary/10 text-primary border-primary/20'
};

const NotificationCard = ({ notification, isAdmin, onToggleRead, onDelete, onNavigate }) => {
  const { _id, title, message, type, priority, is_read, createdAt, created_by, campus_id, target_audience, action_url } = notification;
  const Icon = TYPE_ICONS[type] || Bell;
  const badgeClass = PRIORITY_BADGES[priority] || PRIORITY_BADGES.Normal;

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-150 space-y-3 ${
      !is_read
        ? 'bg-primary/5 dark:bg-primary/[0.07] border-primary/30 shadow-xs'
        : 'bg-surface dark:bg-[#0c0c0c] border-line dark:border-white/10'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-surface-secondary dark:bg-white/10 text-ink flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`w-2 h-2 rounded-full shrink-0 ${!is_read ? 'bg-primary animate-pulse' : 'bg-transparent'}`} />
              <h4 className="font-bold text-sm text-ink dark:text-ink-dark truncate">{title}</h4>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>{priority}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-secondary dark:bg-white/5 border border-line dark:border-white/10 text-ink-muted">{type}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-ink-muted mt-1 flex-wrap">
              <span>By {created_by?.name || 'Administrator'}</span>
              <span>•</span>
              <span>{new Date(createdAt).toLocaleString()}</span>
              {campus_id?.name && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {campus_id.name}</span>
                </>
              )}
              {target_audience && target_audience !== 'All' && (
                <>
                  <span>•</span>
                  <span className="px-1.5 py-0.2 rounded bg-white/40 dark:bg-white/5 font-semibold text-[10px]">{target_audience}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onToggleRead(_id, !is_read)}
            title={is_read ? 'Mark as Unread' : 'Mark as Read'}
            className="p-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-surface-secondary dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Check className={`w-4 h-4 ${is_read ? 'text-primary' : ''}`} />
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => onDelete(notification)}
              title="Delete Notification"
              className="p-1.5 rounded-lg text-ink-muted hover:text-bad hover:bg-bad/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-ink-muted dark:text-ink-muted-dark leading-relaxed pl-11">{message}</p>

      {action_url && (
        <div className="pl-11 pt-1">
          <button
            type="button"
            onClick={() => onNavigate(action_url)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
          >
            <span>Open Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
