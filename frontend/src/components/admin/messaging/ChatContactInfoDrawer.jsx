import React, { useState } from 'react';
import { X } from 'lucide-react';
import ContactInfoHero from './ContactInfoHero';
import ContactInfoMedia from './ContactInfoMedia';
import ContactInfoActions from './ContactInfoActions';
import ConversationActionModal from './ConversationActionModal';
import { exportChatTranscript } from '../../../utils/chatExportHelper';

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
  const [showExportModal, setShowExportModal] = useState(false);

  if (!conversation) return null;

  return (
    <div className="w-full md:w-80 lg:w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full shrink-0 z-30 overflow-y-auto">
      <div className="h-13 px-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
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

      <ContactInfoHero
        conversation={conversation}
        onTogglePin={onTogglePin}
        onToggleFavorite={onToggleFavorite}
      />

      <ContactInfoMedia messages={messages} />

      <ContactInfoActions
        conversation={conversation}
        messages={messages}
        onUpdateSettings={onUpdateSettings}
        onOpenExportModal={() => setShowExportModal(true)}
        onOpenClearModal={() => setShowClearModal(true)}
        onOpenDeleteModal={() => setShowDeleteModal(true)}
      />

      <ConversationActionModal
        isOpen={showClearModal}
        title="Clear Chat?"
        description="All messages in this chat will be permanently deleted for all participants. Are you sure you want to clear this chat?"
        confirmText="Clear Chat"
        variant="warning"
        onClose={() => setShowClearModal(false)}
        onConfirm={() => onClearChat(conversation._id)}
      />
      <ConversationActionModal
        isOpen={showDeleteModal}
        title="Delete Conversation?"
        description="This conversation and its history will be deleted permanently. This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDeleteConversation(conversation._id)}
      />
      <ConversationActionModal
        isOpen={showExportModal}
        title="Export Chat?"
        description="Download a full text (.txt) transcript of all messages, media links, and timestamps in this conversation."
        confirmText="Download Transcript"
        variant="info"
        onClose={() => setShowExportModal(false)}
        onConfirm={() => exportChatTranscript(conversation.title, messages)}
      />
    </div>
  );
};

export default ChatContactInfoDrawer;
