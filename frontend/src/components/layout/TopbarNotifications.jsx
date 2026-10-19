import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getApiBase } from '../../utils/apiBase';
import TopbarNotificationDropdown from './TopbarNotificationDropdown';

const TopbarNotifications = ({ btnClass }) => {
  const { token, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef(null);
  const lastNotifIdRef = useRef(null);
  const initialMountRef = useRef(true);

  const fetchRecent = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${getApiBase()}/notifications?limit=6`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const list = data.notifications || [];
        setNotifications(list);
        setUnreadCount(data.unreadCount || 0);

        if (list.length > 0 && !list[0].is_read) {
          const newest = list[0];
          if (!initialMountRef.current && lastNotifIdRef.current && lastNotifIdRef.current !== newest._id) {
            toast.info(newest.message, newest.title || 'Notification');
          }
          lastNotifIdRef.current = newest._id;
        }
        initialMountRef.current = false;
      }
    } catch {}
  }, [token, toast]);

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
        <TopbarNotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={handleMarkAllRead}
          onClickItem={handleClickItem}
          viewAllPath={viewAllPath}
          onClose={() => { setOpen(false); navigate(viewAllPath); }}
        />
      )}
    </div>
  );
};

export default TopbarNotifications;
