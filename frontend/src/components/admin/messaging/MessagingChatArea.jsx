import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import DoodleBackground from './DoodleBackground';
import ChatAreaEmptyState from './ChatAreaEmptyState';
import ChatHeaderBar from './ChatHeaderBar';
import ChatMessagesList from './ChatMessagesList';
import ChatComposerBar from './ChatComposerBar';
import DeleteMessageModal from './DeleteMessageModal';
import ChatSearchBar from './ChatSearchBar';
import { filterChatMessages } from '../../../utils/chatSearchHelper';

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
  onFormSubmit,
  onOpenCardModal,
  onOpenFormPollModal,
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
      <div className="flex-1 flex flex-col relative overflow-hidden bg-surface-secondary/40 dark:bg-surface-dark">
        <DoodleBackground />
        <ChatAreaEmptyState />
      </div>
    );
  }

  const matchCount = searchTerm ? filterChatMessages(messages, searchTerm).length : 0;

  return (
    <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden bg-surface-secondary/40 dark:bg-surface-dark h-full">
      <DoodleBackground />

      <ChatHeaderBar
        conversation={conversation}
        onBack={onBack}
        onToggleFavorite={onToggleFavorite}
        onRefresh={onRefresh}
        searchVisible={searchVisible}
        onToggleSearch={() => { setSearchVisible(!searchVisible); if (searchVisible) setSearchTerm(''); }}
        onToggleContactInfo={onToggleContactInfo}
        isContactInfoOpen={isContactInfoOpen}
      />

      {conversation.disappearing_messages && (
        <div className="px-4 py-1.5 bg-primary/10 border-b border-primary/20 z-10 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-primary">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Disappearing messages is active • Messages disappear after 24h</span>
        </div>
      )}

      {searchVisible && (
        <ChatSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClose={() => { setSearchVisible(false); setSearchTerm(''); }}
          matchCount={matchCount}
        />
      )}

      <ChatMessagesList
        messages={messages}
        loadingMessages={loadingMessages}
        currentUserId={currentUserId}
        conversation={conversation}
        onReply={(msg) => setReplyingTo(msg)}
        onEdit={(msg) => setEditingMessage(msg)}
        onDelete={(id) => {
          const target = messages.find((m) => m._id === id);
          setDeleteTarget(target || { _id: id });
        }}
        onCardAction={onCardAction}
        onFormSubmit={onFormSubmit}
        searchTerm={searchTerm}
      />

      <ChatComposerBar
        onSendMessage={onSendMessage}
        onOpenCardModal={onOpenCardModal}
        onOpenFormPollModal={onOpenFormPollModal}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        editingMessage={editingMessage}
        onSaveEdit={async (id, text) => { await onEditMessage?.(id, text); setEditingMessage(null); }}
        onCancelEdit={() => setEditingMessage(null)}
      />

      <DeleteMessageModal
        isOpen={Boolean(deleteTarget)}
        message={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget?._id) await onDeleteMessage(deleteTarget._id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
};

export default MessagingChatArea;
