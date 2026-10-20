import { useEffect } from 'react';

export const useChatStreamListener = ({ activeId, setMessages, fetchConversations }) => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const streamUrl = `/api/messaging/stream?token=${encodeURIComponent(token)}`;
    const eventSource = new EventSource(streamUrl);

    eventSource.addEventListener('new_message', (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload?.conversation_id === activeId && payload?.message) {
          setMessages((prev) => (prev.some((m) => m._id === payload.message._id) ? prev : [...prev, payload.message]));
        }
        fetchConversations();
      } catch {}
    });

    eventSource.addEventListener('messages_read', (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload?.conversation_id === activeId) {
          setMessages((prev) => prev.map((m) => (m.read_by?.includes(payload.read_by) ? m : { ...m, read_by: [...(m.read_by || []), payload.read_by] })));
        }
      } catch {}
    });

    eventSource.addEventListener('card_updated', (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload?.message_id) {
          setMessages((prev) => prev.map((m) => (m._id === payload.message_id ? { ...m, card_payload: payload.card_payload } : m)));
        }
      } catch {}
    });

    eventSource.addEventListener('message_deleted', (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload?.message_id) setMessages((prev) => prev.filter((m) => m._id !== payload.message_id));
      } catch {}
    });

    eventSource.addEventListener('message_edited', (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload?.message?._id) {
          setMessages((prev) => prev.map((m) => (m._id === payload.message._id ? payload.message : m)));
        }
        fetchConversations();
      } catch {}
    });

    eventSource.addEventListener('chat_cleared', (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload?.conversation_id === activeId) setMessages([]);
        fetchConversations();
      } catch {}
    });

    eventSource.addEventListener('conversation_deleted', (e) => {
      try {
        fetchConversations();
      } catch {}
    });

    return () => {
      eventSource.close();
    };
  }, [activeId, setMessages, fetchConversations]);
};
