import { useState, useEffect } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import ProfileAvatarSection from './ProfileAvatarSection';
import AccountDetailsForm from './AccountDetailsForm';
import axios from 'axios';

const AccountDetailsCard = ({ user, onUserUpdated }) => {
  const [name, setName] = useState(user?.name || '');
  const [contactNumber, setContactNumber] = useState(user?.contact_number || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photo_url || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Full name is required');
      return;
    }
    if (contactNumber.trim()) {
      const clean = contactNumber.replace(/[\s-]/g, '');
      const valid = /^((\+92)|(0092)|(92)|0)?3[0-9]{9}$/.test(clean) || /^\+?[0-9]{10,15}$/.test(clean);
      if (!valid) {
        setError('Please enter a valid phone number (e.g. +923001234567)');
        return;
      }
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      const token = localStorage.getItem('token');
      const res = await axios.put(
        '/api/auth/profile',
        { name: name.trim(), contact_number: contactNumber.trim(), photo_url: photoUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.user && onUserUpdated) onUserUpdated(res.data.user);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
      <h2 className="text-base font-bold text-ink dark:text-ink-dark">Account Details</h2>

      {error && (
        <div className="p-3 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} className="underline font-semibold">Dismiss</button>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl bg-good/10 text-good border border-good/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
          <button type="button" onClick={() => setSuccess('')} className="underline font-semibold">Dismiss</button>
        </div>
      )}

      <ProfileAvatarSection
        photoUrl={photoUrl}
        initials={initials}
        onPhotoChange={setPhotoUrl}
        disabled={submitting}
      />

      <AccountDetailsForm
        name={name}
        onNameChange={setName}
        email={user?.email}
        contactNumber={contactNumber}
        onContactNumberChange={setContactNumber}
        role={user?.role}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AccountDetailsCard;
