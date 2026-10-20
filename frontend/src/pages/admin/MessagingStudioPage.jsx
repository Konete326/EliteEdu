import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMessagingChat } from '../../components/admin/messaging/useMessagingChat';
import MessagingSidebar from '../../components/admin/messaging/MessagingSidebar';
import MessagingChatArea from '../../components/admin/messaging/MessagingChatArea';
import ChatContactInfoDrawer from '../../components/admin/messaging/ChatContactInfoDrawer';
import NewChatModal from '../../components/admin/messaging/NewChatModal';
import CreateGroupModal from '../../components/admin/messaging/CreateGroupModal';
import SendRichCardModal from '../../components/admin/messaging/SendRichCardModal';
import SendFormPollModal from '../../components/admin/messaging/SendFormPollModal';
import AdminProfileModal from '../../components/admin/messaging/AdminProfileModal';

const MessagingStudioPage = () => {
  const { user } = useAuth();
  const chat = useMessagingChat();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const activeConv = chat.conversations.find((c) => c._id === chat.activeId);
  const unreadTotal = chat.conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0);

  const handleGlobalRefresh = async () => {
    await Promise.all([
      chat.fetchConversations(),
      chat.activeId ? chat.fetchMessages(chat.activeId) : Promise.resolve()
    ]);
  };

  return (
    <div className="relative w-full h-full flex-1 min-h-0 bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark overflow-hidden flex shadow-xs">
      <div className={`${chat.activeId ? 'hidden md:flex' : 'flex'} w-full md:w-auto h-full min-h-0 shrink-0`}>
        <MessagingSidebar
          user={user}
          conversations={chat.conversations}
          activeId={chat.activeId}
          filter={chat.filter}
          search={chat.search}
          unreadTotal={unreadTotal}
          onFilterChange={chat.setFilter}
          onSearchChange={chat.setSearch}
          onSelectConversation={(id) => chat.setActiveId(id)}
          onToggleFavorite={chat.handleToggleFavorite}
          onNewDirect={() => chat.setIsDirectOpen(true)}
          onNewGroup={() => chat.setIsGroupOpen(true)}
          onRefresh={handleGlobalRefresh}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      </div>

      <div className={`${!chat.activeId ? 'hidden md:flex' : 'flex'} flex-1 min-w-0 h-full min-h-0`}>
        <MessagingChatArea
          conversation={activeConv}
          messages={chat.messages}
          loadingMessages={chat.loadingMessages}
          currentUserId={user?.id}
          onBack={() => chat.setActiveId(null)}
          onRefresh={handleGlobalRefresh}
          onSendMessage={chat.handleSendMessage}
          onDeleteMessage={chat.handleDeleteMessage}
          onEditMessage={chat.handleEditMessage}
          onCardAction={chat.handleCardAction}
          onFormSubmit={chat.handleFormSubmit}
          onOpenCardModal={() => chat.setIsCardModalOpen(true)}
          onOpenFormPollModal={() => chat.setIsFormPollOpen(true)}
          onToggleContactInfo={() => chat.setIsContactInfoOpen((p) => !p)}
          isContactInfoOpen={chat.isContactInfoOpen}
        />
      </div>

      {chat.isContactInfoOpen && activeConv && (
        <div className="absolute inset-y-0 right-0 z-40 lg:static flex h-full shrink-0 shadow-2xl lg:shadow-none">
          <ChatContactInfoDrawer
            conversation={activeConv}
            messages={chat.messages}
            onClose={() => chat.setIsContactInfoOpen(false)}
            onTogglePin={chat.handleTogglePin}
            onToggleFavorite={chat.handleToggleFavorite}
            onUpdateSettings={chat.handleUpdateSettings}
            onClearChat={chat.handleClearChat}
            onDeleteConversation={chat.handleDeleteConversation}
          />
        </div>
      )}

      <AdminProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />
      <NewChatModal
        isOpen={chat.isDirectOpen}
        onClose={() => chat.setIsDirectOpen(false)}
        onSelectContact={chat.handleSelectContact}
      />
      <CreateGroupModal
        isOpen={chat.isGroupOpen}
        onClose={() => chat.setIsGroupOpen(false)}
        onGroupCreated={(g) => {
          chat.setActiveId(g._id);
          chat.fetchConversations();
        }}
      />
      <SendRichCardModal
        isOpen={chat.isCardModalOpen}
        onClose={() => chat.setIsCardModalOpen(false)}
        onSendCard={chat.handleSendMessage}
      />
      <SendFormPollModal
        isOpen={chat.isFormPollOpen}
        onClose={() => chat.setIsFormPollOpen(false)}
        onSendFormPoll={chat.handleSendMessage}
      />
    </div>
  );
};

export default MessagingStudioPage;
