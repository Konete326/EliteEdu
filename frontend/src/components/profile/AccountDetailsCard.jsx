import { useState, useRef, useEffect } from 'react';
import { Camera, Mail, Phone, ShieldCheck, Check, AlertCircle, Trash2 } from 'lucide-react';
import ImageCropModal from '../common/ImageCropModal';
import axios from 'axios';

const AccountDetailsCard = ({ user, onUserUpdated }) => {
  const [name, setName] = useState(user?.name || '');
  const [contactNumber, setContactNumber] = useState(user?.contact_number || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photo_url || '');
  const [rawImage, setRawImage] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setContactNumber(user.contact_number || '');
      setPhotoUrl(user.photo_url || '');
    }
  }, [user]);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'ED';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Full name is required');
      return;
    }

    if (contactNumber.trim()) {
      const cleanPhone = contactNumber.replace(/[\s-]/g, '');
      const pkPhoneRegex = /^((\+92)|(0092)|(92)|0)?3[0-9]{9}$/;
      const intlPhoneRegex = /^\+?[0-9]{10,15}$/;
      if (!pkPhoneRegex.test(cleanPhone) && !intlPhoneRegex.test(cleanPhone)) {
        setError('Please enter a valid phone number (e.g. +923001234567)');
        return;
      }
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      const token = localStorage.getItem('token');
      const response = await axios.put(
        '/api/auth/profile',
        {
          name: name.trim(),
          contact_number: contactNumber.trim(),
          photo_url: photoUrl
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.user && onUserUpdated) {
        onUserUpdated(response.data.user);
      }
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-6 shadow-sm space-y-6">
      <h2 className="text-base font-bold text-ink dark:text-ink-dark">Account Details</h2>

      {error && (
        <div className="p-3.5 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} className="underline font-semibold">Dismiss</button>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-good/10 text-good border border-good/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
          <button type="button" onClick={() => setSuccess('')} className="underline font-semibold">Dismiss</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
              onClick={() => fileInputRef.current?.click()}
              title="Upload new photo"
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-md transition-transform active:scale-95 border-2 border-surface dark:border-[#0c0c0f]"
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
              onClick={() => setPhotoUrl('')}
              className="inline-flex items-center gap-1 text-[11px] text-bad hover:underline mt-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove photo</span>
            </button>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 dark:bg-[#141418] text-ink dark:text-ink-dark outline-none focus:border-primary transition-colors font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark" />
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/60 dark:bg-black/30 text-ink-muted dark:text-ink-muted-dark outline-none cursor-not-allowed font-medium select-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
            Phone
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark" />
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="+923001234567"
              className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 dark:bg-[#141418] text-ink dark:text-ink-dark outline-none focus:border-primary transition-colors font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
            Role
          </label>
          <div className="relative">
            <ShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark" />
            <input
              type="text"
              disabled
              value={user?.role || ''}
              className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/60 dark:bg-black/30 text-ink-muted dark:text-ink-muted-dark outline-none cursor-not-allowed font-medium capitalize select-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
        >
          {submitting ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>

      <ImageCropModal
        isOpen={isCropOpen}
        imageSrc={rawImage}
        onClose={() => setIsCropOpen(false)}
        onApplyCrop={(croppedUrl) => setPhotoUrl(croppedUrl)}
      />
    </div>
  );
};

export default AccountDetailsCard;
