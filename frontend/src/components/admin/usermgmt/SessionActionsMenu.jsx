import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, ShieldOff, Trash2, Globe } from 'lucide-react';

const SessionActionsMenu = ({ session, onRevokeSession, onRevokeUser, onToggleBlockIp }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  return (
    <div className="relative inline-block text-right" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary/60 cursor-pointer"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-40 w-48 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl shadow-xl py-1.5 text-left text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => { setOpen(false); onRevokeSession(session); }}
            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-ink dark:text-ink-dark hover:bg-surface-secondary/70 transition-colors cursor-pointer"
          >
            <ShieldOff className="w-3.5 h-3.5 text-ink-muted" />
            <span>Revoke Session</span>
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); onRevokeUser(session); }}
            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-ink dark:text-ink-dark hover:bg-surface-secondary/70 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-ink-muted" />
            <span>Revoke All for User</span>
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); onToggleBlockIp(session); }}
            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-ink dark:text-ink-dark hover:bg-surface-secondary/70 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-ink-muted" />
            <span>{session.is_blocked ? 'Unblock IP' : 'Block IP'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionActionsMenu;
