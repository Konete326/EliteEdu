import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const TopbarMessages = ({ isColored, btnClass }) => {
  const { user, token } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const lastMsgIdRef = useRef(null);
  const initialMountRef = useRef(true);

  const fetchUnread = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get('/messenger/unread-count');
      if (res.data?.success) {
        const count = res.data.unreadCount || 0;
        const latest = res.data.latestMessage;
        setUnreadCount(count);

        if (latest && latest._id) {
          if (!initialMountRef.current && lastMsgIdRef.current && lastMsgIdRef.current !== latest._id) {
            const isChatPage =
              location.pathname.startsWith('/admin/messaging') ||
              location.pathname.startsWith('/teacher/messages') ||
              location.pathname.startsWith('/student/messages') ||
              location.pathname.includes('/messaging/chat') ||
              location.pathname.includes('/teacher/chat');
            if (!isChatPage) {
              const preview = (latest.content || '').length > 55 ? `${latest.content.slice(0, 52)}...` : (latest.content || 'New message');
              toast.info(`${latest.sender}: ${preview}`, 'Staff Messenger');
            }
          }
          lastMsgIdRef.current = latest._id;
        }
        initialMountRef.current = false;
      }
    } catch {}
  }, [token, location.pathname, toast]);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 12000);
    const handleRefresh = () => fetchUnread();
    window.addEventListener('chat_unread_refresh', handleRefresh);
    return () => {
      clearInterval(interval);
      window.removeEventListener('chat_unread_refresh', handleRefresh);
    };
  }, [fetchUnread]);

  const targetPath = user?.role === 'Teacher' ? '/teacher/messages' : (user?.role === 'Student' ? '/student/messages' : '/admin/messaging/internal');

  const handleClick = async () => {
    setUnreadCount(0);
    try {
      await api.put('/messenger/messages/read', {});
    } catch {}
    navigate(targetPath);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className={btnClass}
        title="Staff Messages"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-bad text-white text-[9px] font-bold flex items-center justify-center leading-none pointer-events-none">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
};

export default TopbarMessages;
