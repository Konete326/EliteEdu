import api from '../../../services/api';

export const useConversationActions = ({ activeId, setActiveId, setMessages, setConversations, fetchConversations }) => {
  const handleTogglePin = async (id) => {
    try {
      const res = await api.patch(`/messaging/conversations/${id}/pin`);
      if (res.data?.success) {
        setConversations((prev) =>
          prev
            .map((c) => (c._id === id ? { ...c, is_pinned: res.data.is_pinned } : c))
            .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0))
        );
      }
    } catch {}
  };

  const handleToggleFavorite = async (id) => {
    try {
      const res = await api.patch(`/messaging/conversations/${id}/favorite`);
      if (res.data?.success) {
        setConversations((prev) =>
          prev.map((c) => (c._id === id ? { ...c, is_favorite: res.data.is_favorite } : c))
        );
      }
    } catch {}
  };

  const handleUpdateSettings = async (id, settings) => {
    try {
      const res = await api.patch(`/messaging/conversations/${id}/settings`, settings);
      if (res.data?.success) {
        setConversations((prev) =>
          prev.map((c) => (c._id === id ? { ...c, ...res.data.data } : c))
        );
      }
    } catch {}
  };

  const handleClearChat = async (id) => {
    try {
      const res = await api.delete(`/messaging/conversations/${id}/messages`);
      if (res.data?.success) {
        setMessages([]);
        fetchConversations();
      }
    } catch {}
  };

  const handleDeleteConversation = async (id) => {
    try {
      const res = await api.delete(`/messaging/conversations/${id}`);
      if (res.data?.success) {
        setConversations((prev) => prev.filter((c) => c._id !== id));
        if (activeId === id) setActiveId(null);
      }
    } catch {}
  };

  const handleEditMessage = async (msgId, text) => {
    try {
      const res = await api.put(`/messaging/messages/${msgId}`, { message_text: text });
      if (res.data?.success) {
        setMessages((prev) => prev.map((m) => (m._id === msgId ? res.data.data : m)));
        fetchConversations();
        return res.data.data;
      }
    } catch {}
  };

  return {
    handleTogglePin,
    handleToggleFavorite,
    handleUpdateSettings,
    handleClearChat,
    handleDeleteConversation,
    handleEditMessage
  };
};
