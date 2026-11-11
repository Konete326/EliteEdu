import { formatRelativeTime, formatExpiresDate } from '../../../utils/sessionTimeFormatter';
import SessionActionsMenu from './SessionActionsMenu';
import { Smartphone, Globe } from 'lucide-react';

const SessionMobileCard = ({ session: s, onRevokeSingle, onRevokeUser, onToggleBlockIp }) => {
  const isActive = s.status === 'Active';

  return (
    <div className="p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark space-y-3 shadow-2xs">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <h4 className="font-black text-sm text-ink dark:text-white truncate">
            {s.user_id?.name || 'Unknown User'}
          </h4>
          <p className="text-[11px] text-ink-muted truncate">{s.user_id?.email || '—'}</p>
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
            isActive
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
          }`}
        >
          {s.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] bg-surface-secondary/40 p-2.5 rounded-xl">
        <div className="truncate">
          <span className="text-[10px] uppercase font-bold text-ink-muted block">IP &amp; Device</span>
          <div className="flex items-center gap-1 font-mono text-ink dark:text-white mt-0.5">
            <Globe size={11} className="text-primary shrink-0" />
            <span className="truncate">{s.ip_address}</span>
            {s.is_blocked && (
              <span className="px-1 py-0.2 rounded text-[8px] font-bold bg-bad text-white">Blocked</span>
            )}
          </div>
          <p className="text-[10px] text-ink-muted truncate mt-0.5">{s.device || 'Browser'}</p>
        </div>

        <div className="truncate">
          <span className="text-[10px] uppercase font-bold text-ink-muted block">Activity</span>
          <p className="font-semibold text-ink dark:text-white truncate">
            Active: {formatRelativeTime(s.last_active)}
          </p>
          <p className="text-[10px] text-ink-muted truncate">
            Exp: {formatExpiresDate(s.expires_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end pt-2 border-t border-line/60 dark:border-line-dark/60">
        <SessionActionsMenu
          session={s}
          onRevokeSession={onRevokeSingle}
          onRevokeUser={onRevokeUser}
          onToggleBlockIp={onToggleBlockIp}
        />
      </div>
    </div>
  );
};

export default SessionMobileCard;

