import React from 'react';
import MessagingSidebarHeader from './MessagingSidebarHeader';
import MessagingSidebarSearch from './MessagingSidebarSearch';
import MessagingFilterPills from './MessagingFilterPills';
import ConversationItem from './ConversationItem';
import ConversationEmptyState from './ConversationEmptyState';

const MessagingSidebar = ({
  user,
  conversations = [],
  activeId,
  filter,
  search,
  unreadTotal,
  onFilterChange,
  onSearchChange,
  onSelectConversation,
  onToggleFavorite,
  onNewDirect,
  onNewGroup,
  onRefresh
}) => (
  <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900 shrink-0 h-full">
    <MessagingSidebarHeader
      user={user}
      onNewDirect={onNewDirect}
      onNewGroup={onNewGroup}
      onRefresh={onRefresh}
    />

    <MessagingSidebarSearch
      value={search}
      onChange={onSearchChange}
    />

    <MessagingFilterPills
      activeFilter={filter}
      onFilterChange={onFilterChange}
      unreadTotal={unreadTotal}
    />

    <div className="flex-1 overflow-y-auto divide-y divide-slate-100/60 dark:divide-slate-800/40">
      {conversations.length === 0 ? (
        <ConversationEmptyState
          onNewDirect={onNewDirect}
          onNewGroup={onNewGroup}
        />
      ) : (
        conversations.map((c) => (
          <ConversationItem
            key={c._id}
            conversation={c}
            isActive={c._id === activeId}
            onSelect={onSelectConversation}
            onToggleFavorite={onToggleFavorite}
          />
        ))
      )}
    </div>
  </div>
);

export default MessagingSidebar;
