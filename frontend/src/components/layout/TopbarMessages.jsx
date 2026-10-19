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
            const isChatPage = location.pathname.includes('/messaging/chat') || location.pathname.includes('/teacher/chat');
            if (!isChatPage) {
              const preview = latest.content.length > 55 ? `${latest.content.slice(0, 52)}...` : latest.content;
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
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  const targetPath = user?.role === 'Teacher' ? '/teacher/chat' : '/admin/messaging/chat';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setUnreadCount(0);
          navigate(targetPath);
        }}
        className={btnClass}
        title="Staff Messages"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-bad text-white text-[9px] font-bold flex items-center justify-center leading-none pointer-events-none animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
};

export default TopbarMessages;
