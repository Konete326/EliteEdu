import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { useChatStreamListener } from './useChatStreamListener';
import { useConversationActions } from './useConversationActions';
import { useChatMessageFetcher } from './useChatMessageFetcher';

export const useMessagingChat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isDirectOpen, setIsDirectOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false);

  const {
    messages, setMessages, loadingMessages, fetchMessages,
    appendMessage, updateMessage, removeMessage
  } = useChatMessageFetcher({ activeId, setConversations });

  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get(`/messaging/conversations?filter=${filter}&search=${encodeURIComponent(search)}`);
      if (res.data?.success) setConversations(res.data.data || []);
    } catch {}
  }, [filter, search]);

  useChatStreamListener({ activeId, setMessages, fetchConversations });

  useEffect(() => {
    fetchConversations();
    const id = setInterval(fetchConversations, 12000);
    return () => clearInterval(id);
  }, [fetchConversations]);

  const handleSelectContact = async (contact) => {
    try {
      const payload = {
        target_user_id: contact.user_id, target_model: contact.user_model,
        target_name: contact.name, target_role: contact.role_label, target_avatar: contact.avatar_url
      };
      const res = await api.post('/messaging/conversations/direct', payload);
      if (res.data?.success) {
        setIsDirectOpen(false);
        await fetchConversations();
        setActiveId(res.data.data._id);
      }
    } catch {}
  };

  const handleSlashCommand = async (conversationId, commandText) => {
    const targetId = conversationId || activeId;
    if (!targetId || !commandText) return;
    try {
      const res = await api.post(`/messaging/conversations/${targetId}/slash-command`, { commandText });
      if (res.data?.success) {
        appendMessage(targetId, res.data.data);
        fetchConversations();
        return res.data.data;
      }
    } catch {}
  };

  const handleSendMessage = async (payload) => {
    if (!activeId) return;
    const txt = payload?.message_text?.trim() || '';
    if (txt.startsWith('/') && ['/student', '/attendance', '/defaulters', '/leave', '/circular'].some((c) => txt.toLowerCase().startsWith(c))) {
      return handleSlashCommand(activeId, txt);
    }
    try {
      const res = await api.post(`/messaging/conversations/${activeId}/messages`, payload);
      if (res.data?.success) {
        appendMessage(activeId, res.data.data);
        fetchConversations();
      }
    } catch {}
  };

  const handleCardAction = async (messageId, actionValue) => {
    try {
      const res = await api.post(`/messaging/messages/${messageId}/card-action`, { action_value: actionValue });
      if (res.data?.success) updateMessage(activeId, messageId, res.data.data);
    } catch {}
  };

  const actions = useConversationActions({
    activeId, setActiveId, setMessages, setConversations, fetchConversations
  });

  const handleDeleteMessage = async (msgId) => {
    try {
      await api.delete(`/messaging/messages/${msgId}`);
      removeMessage(activeId, msgId);
    } catch {}
  };

  return {
    conversations, activeId, setActiveId, filter, setFilter, search, setSearch,
    messages, loadingMessages,
    isDirectOpen, setIsDirectOpen, isGroupOpen, setIsGroupOpen, isCardModalOpen, setIsCardModalOpen,
    isContactInfoOpen, setIsContactInfoOpen,
    fetchConversations, fetchMessages, handleSelectContact, handleSendMessage, handleSlashCommand,
    handleCardAction, handleDeleteMessage, ...actions
  };
};
