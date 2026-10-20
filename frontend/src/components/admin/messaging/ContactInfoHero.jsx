import React, { useRef, useState } from 'react';
import { Pin, Star, Users, Camera, Loader2 } from 'lucide-react';
import api from '../../../services/api';

const ContactInfoHero = ({ conversation, onTogglePin, onToggleFavorite, onUpdateSettings }) => {
  const isOnline = Boolean(conversation?.is_online);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploading(true);
        const res = await api.post('/messaging/upload', { dataUrl: reader.result, name: file.name });
        if (res.data?.success && res.data.url && onUpdateSettings) {
          onUpdateSettings(conversation._id, { avatar_url: res.data.url });
        }
      } catch {} finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="py-4 px-5 flex flex-col items-center text-center border-b border-line dark:border-line-dark">
      <div className="relative group">
        {conversation.is_group && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        )}

        {conversation.is_group ? (
          <div
            onClick={() => conversation.is_group && !uploading && fileInputRef.current?.click()}
            className="relative w-16 h-16 rounded-full cursor-pointer shadow-xs border border-primary/20 overflow-hidden flex items-center justify-center bg-primary/10 text-primary transition-all"
          >
            {conversation.avatar_url ? (
              <img src={conversation.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <Users className="w-7 h-7" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </div>
          </div>
        ) : conversation.avatar_url ? (
          <img src={conversation.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-line dark:border-line-dark shadow-xs" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-extrabold text-lg shadow-xs border border-primary/20">
            {conversation.title?.slice(0, 2).toUpperCase() || 'U'}
          </div>
        )}

        {!conversation.is_group && (
          <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-surface dark:border-surface-dark ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        )}
      </div>

      <h4 className="text-sm font-bold text-ink dark:text-ink-dark mt-2 truncate max-w-full">
        {conversation.title}
      </h4>
      <p className="text-[11px] mt-0.5 truncate text-center font-medium">
        <span className={conversation.is_group ? 'text-ink-muted' : isOnline ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-ink-muted'}>
          {conversation.is_group ? `${conversation.participants_count || 2} members` : (isOnline ? 'Online' : 'Offline')}
        </span>
      </p>

      <div className="grid grid-cols-2 gap-2.5 w-full mt-3">
        <button
          type="button"
          onClick={() => onTogglePin(conversation._id)}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border text-xs font-semibold transition-all shadow-2xs ${conversation.is_pinned ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-surface dark:bg-surface-secondary-dark border-line dark:border-line-dark text-ink dark:text-ink-dark hover:bg-surface-secondary'}`}
        >
          <Pin className={`w-3.5 h-3.5 ${conversation.is_pinned ? 'fill-current' : ''}`} />
          <span>{conversation.is_pinned ? 'Pinned' : 'Pin'}</span>
        </button>
        <button
          type="button"
          onClick={() => onToggleFavorite(conversation._id)}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border text-xs font-semibold transition-all shadow-2xs ${conversation.is_favorite ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' : 'bg-surface dark:bg-surface-secondary-dark border-line dark:border-line-dark text-ink dark:text-ink-dark hover:bg-surface-secondary'}`}
        >
          <Star className={`w-3.5 h-3.5 ${conversation.is_favorite ? 'fill-current' : ''}`} />
          <span>{conversation.is_favorite ? 'Favorited' : 'Favorite'}</span>
        </button>
      </div>
    </div>
  );
};

export default ContactInfoHero;
