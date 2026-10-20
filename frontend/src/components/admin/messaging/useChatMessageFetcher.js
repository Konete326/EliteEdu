import { useState, useRef, useEffect, useCallback } from 'react';
import api from '../../../services/api';

export const useChatMessageFetcher = ({ activeId, setConversations }) => {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const cacheRef = useRef({});

  const fetchMessages = useCallback(async (id, signal) => {
    if (!id) return;
    try {
      const res = await api.get(`/messaging/conversations/${id}/messages`, { signal });
      if (res.data?.success) {
        const list = res.data.data || [];
        cacheRef.current[id] = list;
        setMessages(list);
        setLoadingMessages(false);
        setConversations((prev) => prev.map((c) => (c._id === id ? { ...c, unread_count: 0 } : c)));
      }
    } catch {
      setLoadingMessages(false);
    }
  }, [setConversations]);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      setLoadingMessages(false);
      return;
    }
    if (cacheRef.current[activeId]) {
      setMessages(cacheRef.current[activeId]);
      setLoadingMessages(false);
    } else {
      setMessages([]);
      setLoadingMessages(true);
    }
    const c = new AbortController();
    fetchMessages(activeId, c.signal);
    return () => c.abort();
  }, [activeId, fetchMessages]);

  const appendMessage = (id, msg) => {
    setMessages((prev) => {
      const next = prev.some((m) => m._id === msg._id) ? prev : [...prev, msg];
      if (id) cacheRef.current[id] = next;
      return next;
    });
  };

  const updateMessage = (id, msgId, updated) => {
    setMessages((prev) => {
      const next = prev.map((m) => (m._id === msgId ? updated : m));
      if (id) cacheRef.current[id] = next;
      return next;
    });
  };

  const removeMessage = (id, msgId) => {
    setMessages((prev) => {
      const next = prev.filter((m) => m._id !== msgId);
      if (id) cacheRef.current[id] = next;
      return next;
    });
  };

  return {
    messages, setMessages, loadingMessages, fetchMessages,
    appendMessage, updateMessage, removeMessage
  };
};
