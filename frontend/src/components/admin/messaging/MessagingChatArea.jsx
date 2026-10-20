import React, { useState } from 'react';
import DoodleBackground from './DoodleBackground';
import ChatAreaEmptyState from './ChatAreaEmptyState';
import ChatHeaderBar from './ChatHeaderBar';
import ChatMessagesList from './ChatMessagesList';
import ChatComposerBar from './ChatComposerBar';
import DeleteMessageModal from './DeleteMessageModal';

const MessagingChatArea = ({
  conversation,
  messages = [],
  loadingMessages = false,
  currentUserId,
  onBack,
  onToggleFavorite,
  onRefresh,
  onSendMessage,
  onDeleteMessage,
  onEditMessage,
  onCardAction,
  onOpenCardModal,
  onToggleContactInfo,
  isContactInfoOpen = false
}) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
        <DoodleBackground />
        <ChatAreaEmptyState />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 h-full">
      <DoodleBackground />

      <ChatHeaderBar
        conversation={conversation}
        onBack={onBack}
        onToggleFavorite={onToggleFavorite}
        onRefresh={onRefresh}
        searchVisible={searchVisible}
        onToggleSearch={() => {
          setSearchVisible(!searchVisible);
          if (searchVisible) setSearchTerm('');
        }}
        onToggleContactInfo={onToggleContactInfo}
        isContactInfoOpen={isContactInfoOpen}
      />

      {searchVisible && (
        <div className="px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-20">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search messages in this conversation..."
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none"
            autoFocus
          />
        </div>
      )}

      <ChatMessagesList
        messages={messages}
        loadingMessages={loadingMessages}
        currentUserId={currentUserId}
        onReply={(msg) => setReplyingTo(msg)}
        onEdit={(msg) => setEditingMessage(msg)}
        onDelete={(id) => {
          const target = messages.find((m) => m._id === id);
          setDeleteTarget(target || { _id: id });
        }}
        onCardAction={onCardAction}
        searchTerm={searchTerm}
      />

      <ChatComposerBar
        onSendMessage={onSendMessage}
        onOpenCardModal={onOpenCardModal}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        editingMessage={editingMessage}
        onSaveEdit={async (id, text) => {
          await onEditMessage?.(id, text);
          setEditingMessage(null);
        }}
        onCancelEdit={() => setEditingMessage(null)}
      />

      <DeleteMessageModal
        isOpen={Boolean(deleteTarget)}
        message={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget?._id) {
            await onDeleteMessage(deleteTarget._id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
};

export default MessagingChatArea;
