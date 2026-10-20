import React from 'react';

export const matchesChatQuery = (msg, query) => {
  if (!query) return true;
  const q = String(query).toLowerCase().trim();
  if (!q) return true;

  if (String(msg.message_text || '').toLowerCase().includes(q)) return true;
  if (String(msg.sender_name || '').toLowerCase().includes(q)) return true;
  if (String(msg.sender_role || '').toLowerCase().includes(q)) return true;
  if (String(msg.attachment_name || '').toLowerCase().includes(q)) return true;

  const card = msg.card_payload;
  if (card) {
    if (String(card.head?.title || '').toLowerCase().includes(q)) return true;
    if (String(card.head?.sub_title || '').toLowerCase().includes(q)) return true;
    if (String(card.body?.text || '').toLowerCase().includes(q)) return true;

    if (Array.isArray(card.poll_options) && card.poll_options.some((opt) => String(opt.text || '').toLowerCase().includes(q))) {
      return true;
    }
    if (Array.isArray(card.form_fields) && card.form_fields.some((f) => String(f.label || '').toLowerCase().includes(q))) {
      return true;
    }
    if (Array.isArray(card.actions) && card.actions.some((a) => String(a.label || '').toLowerCase().includes(q))) {
      return true;
    }
  }

  return false;
};

export const filterChatMessages = (messages = [], query = '') => {
  if (!query || !query.trim()) return messages;
  return messages.filter((m) => matchesChatQuery(m, query));
};

export const renderHighlightedText = (text, query) => {
  if (!query || !query.trim() || !text) return text;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = String(text).split(regex);
  if (parts.length <= 1) return text;
  return parts.map((part, i) =>
    regex.test(part)
      ? React.createElement(
          'mark',
          {
            key: i,
            className: 'bg-amber-300 dark:bg-amber-500/70 text-slate-900 dark:text-white rounded-xs px-0.5'
          },
          part
        )
      : part
  );
};
