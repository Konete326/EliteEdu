import { useState, useRef } from 'react';
import { Camera, Mail, Phone, Building, Loader2, Crop } from 'lucide-react';
import ImageCropModal from '../ImageCropModal';

const ProfileHeaderHero = ({ profile, onPhotoUpload, saving }) => {
  const [rawImage, setRawImage] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const fileInputRef = useRef(null);

  const name = profile?.name || 'User Profile';
  const role = profile?.role || 'Staff';
  const email = profile?.email || '';
  const phone = profile?.contact_number || profile?.phone || 'No phone set';
  const campus = profile?.campus_id?.name || 'Main Campus';
  const designation = profile?.designation || profile?.role || 'Staff Member';

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setRawImage(reader.result);
        setIsCropOpen(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropApply = (croppedUrl) => {
    if (onPhotoUpload) {
      onPhotoUpload(croppedUrl);
    }
  };

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-5 sm:py-6 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative group shrink-0">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-primary/20 bg-primary/10 flex items-center justify-center text-primary font-black text-3xl shadow-md">
            {profile?.photo_url ? (
              <img src={profile.photo_url} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span>{name.charAt(0).toUpperCase()}</span>
            )}

            {saving && (
              <div className="absolute inset-0 bg-ink/70 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-1 z-10 animate-in fade-in">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span className="text-[9px] font-bold tracking-tight">Uploading...</span>
              </div>
            )}

            {!saving && profile?.photo_url && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setRawImage(profile.photo_url);
                    setIsCropOpen(true);
                  }}
                  title="Crop & Resize Avatar"
                  className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <Crop className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Choose New Photo"
                  className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <label
            title="Upload and crop photo"
            className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-primary text-white shadow-lg cursor-pointer hover:bg-primary-hover active:scale-95 transition-all"
          >
            <Camera className="w-4 h-4" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={handleFileChange}
              disabled={saving}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-ink dark:text-ink-dark tracking-tight truncate">
              {name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
              {role}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-surface-secondary text-ink-muted">
              {designation}
            </span>
          </div>

          <p className="text-xs text-ink-muted flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" /> {email || 'No email registered'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-500" /> {phone}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-500" /> {campus}
            </span>
          </p>
        </div>
      </div>

      <ImageCropModal
        isOpen={isCropOpen}
        imageSrc={rawImage}
        onClose={() => setIsCropOpen(false)}
        onApplyCrop={handleCropApply}
      />
    </div>
  );
};

export default ProfileHeaderHero;
