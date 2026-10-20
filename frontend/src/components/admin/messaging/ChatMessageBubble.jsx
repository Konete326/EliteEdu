import React from 'react';
import { CheckCheck, Reply, Pencil, Trash2, FileText, ExternalLink } from 'lucide-react';
import ChatRichCardBubble from './ChatRichCardBubble';
import ChatFormPollBubble from './ChatFormPollBubble';
import { renderHighlightedText } from '../../../utils/chatSearchHelper';

const ChatMessageBubble = ({ message, currentUserId, conversation, onReply, onEdit, onDelete, onCardAction, onFormSubmit, searchTerm = '' }) => {
  const isOutgoing = String(message.sender_id) === String(currentUserId);
  const isFormPoll = ['Interactive_Poll', 'Interactive_Form'].includes(message.card_payload?.card_type);
  const isCard = message.card_payload?.card_type && message.card_payload.card_type !== 'None';
  const isCustomCard = isFormPoll || isCard;
  const time = new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const isGroup = Boolean(conversation?.is_group);
  const participants = Array.isArray(conversation?.participants) ? conversation.participants : [];
  const readBy = Array.isArray(message.read_by) ? message.read_by.map(String) : [];
  const otherMember = participants.find((p) => String(p.user_id || p._id || p) !== String(currentUserId));
  const isFullyRead = isGroup
    ? (participants.length > 0 ? participants.every((p) => readBy.includes(String(p.user_id || p._id || p))) : readBy.length > 2)
    : (otherMember ? readBy.includes(String(otherMember.user_id || otherMember._id || otherMember)) : readBy.length > 1);

  const isImage = Boolean(
    message.attachment_url && (
      message.attachment_url.includes('cloudinary') ||
      message.attachment_url.startsWith('data:image') ||
      message.attachment_url.match(/\.(jpeg|jpg|gif|png|webp)/i)
    )
  );
  const isImageFileName = isImage && Boolean(
    message.message_text && (
      message.message_text === message.attachment_name ||
      message.message_text === 'Attachment' ||
      /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(message.message_text.trim())
    )
  );
  const hasText = Boolean(message.message_text && !isImageFileName);

  return (
    <div className={`flex w-full ${isOutgoing ? 'justify-end' : 'justify-start'} group mb-2.5`}>
      <div className={`max-w-[92%] sm:max-w-[75%] flex flex-col ${isOutgoing ? 'items-end' : 'items-start'}`}>
        {!isOutgoing && (
          <div className="flex items-center gap-1.5 mb-1 px-1">
            <span className="text-[11px] font-bold text-primary">
              {renderHighlightedText(message.sender_name, searchTerm)}
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-surface-secondary dark:bg-surface-secondary-dark text-ink-sub dark:text-ink-sub-dark font-medium">{message.sender_role}</span>
          </div>
        )}

        <div className={`relative text-xs rounded-2xl shadow-xs transition-all ${isCustomCard ? 'p-1 bg-transparent border-0' : `px-3.5 py-2.5 ${isOutgoing ? 'rounded-tr-none bg-primary text-white' : 'rounded-tl-none bg-surface dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark'}`}`}>
          {message.reply_to && !isCustomCard && (
            <div className={`mb-2 p-2 rounded-lg text-[11px] border-l-3 ${isOutgoing ? 'bg-white/10 border-white/40 text-white/90' : 'bg-surface-secondary dark:bg-surface-dark border-primary text-ink-sub dark:text-ink-sub-dark'}`}>
              <span className="font-bold block text-[10px] opacity-90">{message.reply_to.sender_name}</span>
              <p className="truncate line-clamp-1">{message.reply_to.message_text}</p>
            </div>
          )}

          {message.attachment_url && (
            <div className={hasText ? 'mb-2' : ''}>
              {isImage ? (
                <a href={message.attachment_url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl">
                  <img src={message.attachment_url} alt="" className="rounded-xl max-h-56 max-w-full object-cover border border-line dark:border-line-dark hover:opacity-95 transition-opacity cursor-pointer" />
                </a>
              ) : (
                <a href={message.attachment_url} target="_blank" rel="noreferrer" className={`flex items-center gap-2 p-2 rounded-xl text-[11px] font-semibold underline ${isOutgoing ? 'bg-white/10 text-white' : 'bg-surface-secondary dark:bg-surface-dark text-primary border border-line dark:border-line-dark'}`}>
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="truncate flex-1">{renderHighlightedText(message.attachment_name || 'Download file', searchTerm)}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              )}
            </div>
          )}

          {isFormPoll ? (
            <ChatFormPollBubble message={message} currentUserId={currentUserId} onFormSubmit={onFormSubmit} />
          ) : isCard ? (
            <ChatRichCardBubble message={message} onAction={onCardAction} />
          ) : hasText ? (
            <p className="whitespace-pre-wrap break-words leading-relaxed">{renderHighlightedText(message.message_text, searchTerm)}</p>
          ) : null}

          <div className={`mt-1 flex items-center gap-1.5 text-[9px] ${isOutgoing ? 'text-white/80 justify-end' : 'text-ink-muted dark:text-ink-muted-dark justify-end'}`}>
            {message.is_edited && <span className="opacity-75 italic text-[8px]">(edited)</span>}
            <span>{time}</span>
            {isOutgoing && (
              <CheckCheck
                className={`w-3.5 h-3.5 transition-colors ${
                  isFullyRead
                    ? (isCustomCard ? 'text-sky-500' : 'text-sky-300')
                    : (isCustomCard ? 'text-ink-muted' : 'text-white/40')
                }`}
                title={isFullyRead ? 'Seen' : 'Delivered'}
              />
            )}
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-0.5 px-1">
          <button type="button" onClick={() => onReply(message)} className="p-1 rounded text-ink-muted hover:text-ink dark:hover:text-ink-dark" title="Reply">
            <Reply className="w-3 h-3" />
          </button>
          {isOutgoing && !isCustomCard && (
            <button type="button" onClick={() => onEdit(message)} className="p-1 rounded text-ink-muted hover:text-primary" title="Edit message">
              <Pencil className="w-3 h-3" />
            </button>
          )}
          {isOutgoing && (
            <button type="button" onClick={() => onDelete(message._id)} className="p-1 rounded text-ink-muted hover:text-rose-500" title="Delete message">
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageBubble;
