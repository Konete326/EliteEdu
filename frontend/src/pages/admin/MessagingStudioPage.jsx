import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMessagingChat } from '../../components/admin/messaging/useMessagingChat';
import MessagingSidebar from '../../components/admin/messaging/MessagingSidebar';
import MessagingChatArea from '../../components/admin/messaging/MessagingChatArea';
import ChatContactInfoDrawer from '../../components/admin/messaging/ChatContactInfoDrawer';
import NewChatModal from '../../components/admin/messaging/NewChatModal';
import CreateGroupModal from '../../components/admin/messaging/CreateGroupModal';
import SendRichCardModal from '../../components/admin/messaging/SendRichCardModal';

const MessagingStudioPage = () => {
  const { user } = useAuth();
  const chat = useMessagingChat();

  const activeConv = chat.conversations.find((c) => c._id === chat.activeId);
  const unreadTotal = chat.conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0);

  return (
    <div className="relative w-full h-full flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex shadow-xs">
      <div className={`${chat.activeId ? 'hidden md:flex' : 'flex'} w-full md:w-auto h-full shrink-0`}>
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
          onRefresh={chat.fetchConversations}
        />
      </div>

      <div className={`${!chat.activeId ? 'hidden md:flex' : 'flex'} flex-1 min-w-0 h-full`}>
        <MessagingChatArea
          conversation={activeConv}
          messages={chat.messages}
          loadingMessages={chat.loadingMessages}
          currentUserId={user?.id}
          onBack={() => chat.setActiveId(null)}
          onToggleFavorite={chat.handleToggleFavorite}
          onRefresh={() => chat.fetchMessages(chat.activeId)}
          onSendMessage={chat.handleSendMessage}
          onDeleteMessage={chat.handleDeleteMessage}
          onEditMessage={chat.handleEditMessage}
          onCardAction={chat.handleCardAction}
          onOpenCardModal={() => chat.setIsCardModalOpen(true)}
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
    </div>
  );
};

export default MessagingStudioPage;
