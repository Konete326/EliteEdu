import React, { useState } from 'react';
import { X, Pin, Star, Users } from 'lucide-react';
import ContactInfoMedia from './ContactInfoMedia';
import ContactInfoActions from './ContactInfoActions';
import ConversationActionModal from './ConversationActionModal';

const ChatContactInfoDrawer = ({
  conversation,
  messages = [],
  onClose,
  onTogglePin,
  onToggleFavorite,
  onUpdateSettings,
  onClearChat,
  onDeleteConversation
}) => {
  const [showClearModal, setShowClearModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!conversation) return null;

  return (
    <div className="w-full md:w-80 lg:w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full shrink-0 z-30 overflow-y-auto">
      <div className="h-16 px-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {conversation.is_group ? 'Group info' : 'Contact info'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 flex flex-col items-center text-center border-b border-slate-100 dark:border-slate-800">
        <div className="relative">
          {conversation.is_group ? (
            <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold text-3xl shadow-sm border border-indigo-100 dark:border-indigo-900">
              <Users className="w-10 h-10" />
            </div>
          ) : conversation.avatar_url ? (
            <img src={conversation.avatar_url} alt="" className="w-24 h-24 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800 shadow-sm" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-extrabold text-2xl shadow-sm border border-indigo-200/60 dark:border-indigo-900">
              {conversation.title?.slice(0, 2).toUpperCase() || 'U'}
            </div>
          )}
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
        </div>

        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-3 truncate max-w-full">
          {conversation.title}
        </h4>
        <p className="text-xs text-slate-400 mt-0.5 truncate">
          {conversation.is_group ? `${conversation.participants_count || 2} members` : 'online'}
        </p>

        <div className="grid grid-cols-2 gap-3 w-full mt-5">
          <button
            type="button"
            onClick={() => onTogglePin(conversation._id)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all shadow-2xs ${conversation.is_pinned ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/60 dark:border-indigo-900' : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
          >
            <Pin className={`w-3.5 h-3.5 ${conversation.is_pinned ? 'fill-current' : ''}`} />
            <span>{conversation.is_pinned ? 'Pinned' : 'Pin'}</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleFavorite(conversation._id)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all shadow-2xs ${conversation.is_favorite ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/60 dark:border-amber-900' : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
          >
            <Star className={`w-3.5 h-3.5 ${conversation.is_favorite ? 'fill-current' : ''}`} />
            <span>{conversation.is_favorite ? 'Favorited' : 'Favorite'}</span>
          </button>
        </div>
      </div>

      <ContactInfoMedia messages={messages} />

      <ContactInfoActions
        conversation={conversation}
        messages={messages}
        onUpdateSettings={onUpdateSettings}
        onOpenClearModal={() => setShowClearModal(true)}
        onOpenDeleteModal={() => setShowDeleteModal(true)}
      />

      <ConversationActionModal
        isOpen={showClearModal}
        title="Clear Chat?"
        description="All messages in this conversation will be deleted permanently."
        confirmText="Clear Chat"
        isDanger={false}
        onClose={() => setShowClearModal(false)}
        onConfirm={() => onClearChat(conversation._id)}
      />
      <ConversationActionModal
        isOpen={showDeleteModal}
        title="Delete Conversation?"
        description="This conversation and its history will be deleted permanently."
        confirmText="Delete"
        isDanger={true}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDeleteConversation(conversation._id)}
      />
    </div>
  );
};

export default ChatContactInfoDrawer;
