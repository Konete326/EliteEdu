import { useState, useRef, useEffect } from 'react';

export const useChatComposer = ({
  onSendMessage,
  replyingTo,
  onCancelReply,
  editingMessage,
  onSaveEdit,
  onCancelEdit,
  sending = false
}) => {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);

  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.message_text || '');
      textInputRef.current?.focus();
    }
  }, [editingMessage]);

  const handleSend = () => {
    const trimmed = text.trim();
    if ((!trimmed && !attachment) || sending) return;
    if (editingMessage) {
      onSaveEdit(editingMessage._id, trimmed);
      setText('');
      onCancelEdit?.();
      return;
    }
    onSendMessage({
      message_text: trimmed,
      attachment_url: attachment?.dataUrl || '',
      attachment_name: attachment?.name || '',
      reply_to: replyingTo ? {
        message_id: replyingTo._id,
        sender_name: replyingTo.sender_name,
        message_text: replyingTo.message_text
      } : null
    });
    setText('');
    setAttachment(null);
    onCancelReply?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAttachment({ name: file.name, dataUrl: reader.result });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const hasContent = Boolean(text.trim() || attachment || editingMessage);

  return {
    text,
    setText,
    attachment,
    setAttachment,
    showEmoji,
    setShowEmoji,
    fileInputRef,
    textInputRef,
    handleSend,
    handleKeyDown,
    handleFileChange,
    hasContent
  };
};
