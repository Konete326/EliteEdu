import { useState, useRef } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import ImageCropModal from '../common/ImageCropModal';

const ProfileAvatarSection = ({ photoUrl, initials, onPhotoChange, disabled = false }) => {
  const [rawImage, setRawImage] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawImage(ev.target.result);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="relative w-28 h-28 rounded-full border-2 border-line dark:border-line-dark bg-surface-secondary dark:bg-[#16161d] flex items-center justify-center shadow-xs">
        {photoUrl ? (
          <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
        ) : (
          <span className="text-2xl font-bold text-ink-sub dark:text-ink-sub-dark tracking-wider">
            {initials}
          </span>
        )}
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          title="Upload new photo"
          className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-md transition-transform active:scale-95 border-2 border-surface dark:border-[#0c0c0f] cursor-pointer"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark mt-2.5">
        .JPG or PNG, up to 5MB
      </p>
      {photoUrl && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onPhotoChange('')}
          className="inline-flex items-center gap-1 text-[11px] text-bad hover:underline mt-1 cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          <span>Remove photo</span>
        </button>
      )}

      <ImageCropModal
        isOpen={isCropOpen}
        imageSrc={rawImage}
        onClose={() => setIsCropOpen(false)}
        onApplyCrop={(croppedUrl) => onPhotoChange(croppedUrl)}
      />
    </div>
  );
};

export default ProfileAvatarSection;
