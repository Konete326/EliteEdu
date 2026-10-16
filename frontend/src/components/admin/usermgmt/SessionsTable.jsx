import { formatRelativeTime, formatExpiresDate } from '../../../utils/sessionTimeFormatter';
import SessionActionsMenu from './SessionActionsMenu';

const SessionsTable = ({ sessions, onRevokeSingle, onRevokeUser, onToggleBlockIp }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-line dark:border-line-dark bg-surface-secondary/40 text-ink-muted font-semibold">
            <th className="py-3 px-4">User</th>
            <th className="py-3 px-4">IP Address</th>
            <th className="py-3 px-4">Device</th>
            <th className="py-3 px-4">Last Active</th>
            <th className="py-3 px-4">Expires</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line dark:divide-line-dark">
          {sessions.map((s) => (
            <tr key={s._id} className="hover:bg-surface-secondary/20 transition-colors">
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="font-bold text-ink dark:text-ink-dark">{s.user_id?.name || 'Unknown User'}</div>
                <div className="text-[11px] text-ink-muted">{s.user_id?.email || '—'}</div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-ink dark:text-ink-dark">
                <div className="inline-flex items-center gap-1.5">
                  <span>{s.ip_address}</span>
                  {s.is_blocked && <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-bad text-white">Blocked</span>}
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-ink-muted">{s.device || '—'}</td>
              <td className="py-3 px-4 whitespace-nowrap text-ink-muted">{formatRelativeTime(s.last_active)}</td>
              <td className="py-3 px-4 whitespace-nowrap text-ink-muted">{formatExpiresDate(s.expires_at)}</td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                  {s.status}
                </span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-right">
                <SessionActionsMenu session={s} onRevokeSession={onRevokeSingle} onRevokeUser={onRevokeUser} onToggleBlockIp={onToggleBlockIp} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionsTable;
