import React, { useRef, useState } from 'react';
import { Camera, Loader2, Users } from 'lucide-react';
import api from '../../../services/api';

const GroupAvatarUploader = ({ avatarUrl, onAvatarChange, size = 'w-16 h-16' }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploading(true);
        const res = await api.post('/messaging/upload', { dataUrl: reader.result, name: file.name });
        if (res.data?.success && res.data.url) {
          onAvatarChange(res.data.url);
        }
      } catch {} finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col items-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative ${size} rounded-full cursor-pointer group shadow-xs border-2 border-dashed border-primary/40 hover:border-primary transition-all flex items-center justify-center overflow-hidden bg-primary/5`}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center text-primary">
            <Users className="w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
        </div>
      </div>
      <p className="text-[10px] text-ink-muted mt-1 font-medium">Click to set group photo</p>
    </div>
  );
};

export default GroupAvatarUploader;
