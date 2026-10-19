import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import MessengerSidebar from '../../components/common/messenger/MessengerSidebar';
import MessengerHeader from '../../components/common/messenger/MessengerHeader';
import MessageList from '../../components/common/messenger/MessageList';
import MessageInput from '../../components/common/messenger/MessageInput';
import BroadcastJumpBar from '../../components/common/messenger/BroadcastJumpBar';

const InternalMessengerPage = ({ defaultTab = 'chat' }) => {
  const { user } = useAuth();
  const initialTarget = defaultTab === 'circular'
    ? { type: 'channel', id: 'Circulars', label: 'Official Circulars' }
    : { type: 'channel', id: 'All_Staff', label: 'All Staff Room' };

  const [activeTarget, setActiveTarget] = useState(initialTarget);
  const [messages, setMessages] = useState([]);
  const [directory, setDirectory] = useState([]);
  const [pinnedCircular, setPinnedCircular] = useState(null);
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const params = {};
      if (activeTarget.type === 'channel') {
        if (activeTarget.id === 'Circulars') params.is_circular = 'true';
        else params.channel = activeTarget.id;
      } else if (activeTarget.type === 'direct') {
        params.channel = 'Direct';
        params.recipient_id = activeTarget.user?._id;
      }
      const res = await api.get('/messenger/messages', { params });
      if (res.data?.success) {
        setMessages(res.data.messages || []);
        const pinned = res.data.messages?.find((m) => m.is_pinned && m.is_circular);
        if (pinned) setPinnedCircular(pinned);
      }
    } catch {}
  }, [activeTarget]);

  const fetchDirectory = useCallback(async () => {
    try {
      const res = await api.get('/messenger/directory');
      if (res.data?.success) setDirectory(res.data.directory || []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchDirectory();
    const interval = setInterval(() => { fetchMessages(); fetchDirectory(); }, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages, fetchDirectory]);

  const handleSend = async (payload) => {
    setSending(true);
    try {
      const body = {
        ...payload,
        school_id: user?.school_id,
        channel: activeTarget.type === 'channel' ? (activeTarget.id === 'Circulars' ? 'All_Staff' : activeTarget.id) : 'Direct',
        recipient_id: activeTarget.type === 'direct' ? activeTarget.user?._id : null
      };
      if (activeTarget.id === 'Circulars') body.is_circular = true;
      const res = await api.post('/messenger/messages', body);
      if (res.data?.success) {
        setMessages((prev) => [...prev, res.data.message]);
        fetchDirectory();
      }
    } finally { setSending(false); }
  };

  const handleTogglePin = async (id) => {
    try {
      await api.put(`/messenger/messages/${id}/pin`);
      fetchMessages();
    } catch {}
  };

  return (
    <div className="w-full space-y-4">
      <BroadcastJumpBar
        pinnedCircular={pinnedCircular}
        onSelectCircular={() => setActiveTarget({ type: 'channel', id: 'Circulars', label: 'Official Circulars' })}
        userRole={user?.role}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-210px)] min-h-[500px]">
        <div className="lg:col-span-4 h-full">
          <MessengerSidebar
            activeTarget={activeTarget}
            onSelectTarget={setActiveTarget}
            directory={directory}
            currentUserId={user?._id}
          />
        </div>
        <div className="lg:col-span-8 h-full flex flex-col bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark overflow-hidden">
          <MessengerHeader activeTarget={activeTarget} />
          <MessageList
            messages={messages}
            currentUserId={user?._id}
            onTogglePin={handleTogglePin}
            canPin={user?.role === 'Admin' || user?.role === 'SuperAdmin'}
          />
          <MessageInput
            onSend={handleSend}
            sending={sending}
            canPostCircular={user?.role === 'Admin' || user?.role === 'SuperAdmin'}
          />
        </div>
      </div>
    </div>
  );
};

export default InternalMessengerPage;
