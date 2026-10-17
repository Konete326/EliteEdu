import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiBase } from '../../utils/apiBase';

const TopbarNotifications = ({ isColored, btnClass }) => {
  const { token, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const fetchRecent = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${getApiBase()}/notifications?limit=6`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {}
  }, [token]);

  useEffect(() => {
    fetchRecent();
    const interval = setInterval(fetchRecent, 20000);
    return () => clearInterval(interval);
  }, [fetchRecent]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${getApiBase()}/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {}
  };

  const handleClickItem = async (n) => {
    if (!n.is_read) {
      try {
        await fetch(`${getApiBase()}/notifications/${n._id}/read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadCount((c) => Math.max(0, c - 1));
        setNotifications((prev) => prev.map((item) => (item._id === n._id ? { ...item, is_read: true } : item)));
      } catch {}
    }
    setOpen(false);
    if (n.action_url) navigate(n.action_url);
  };

  const viewAllPath = user?.role === 'Teacher' ? '/teacher/notifications' : '/admin/notifications';

  return (
    <div className="relative" ref={menuRef}>
      <button type="button" onClick={() => setOpen((prev) => !prev)} className={`relative ${btnClass}`} title="Notifications">
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-bad text-white text-[9px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
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
              <button type="button" onClick={handleMarkAllRead} className="flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer">
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
                  onClick={() => handleClickItem(n)}
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
              onClick={() => { setOpen(false); navigate(viewAllPath); }}
              className="w-full py-1.5 text-xs font-semibold text-primary hover:underline flex items-center justify-center gap-1 cursor-pointer"
            >
              View All Notifications <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopbarNotifications;
