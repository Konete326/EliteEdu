import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const useMyProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.get('/auth/profile')
      .then((res) => {
        if (!mounted) return;
        const p = res.data?.profile || res.data?.user || user;
        setProfile(p);
        setFormData(p || {});
      })
      .catch(() => {
        if (mounted && user) {
          setProfile(user);
          setFormData(user);
        }
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFieldChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoUpload = async (photoBase64) => {
    try {
      setSaving(true);
      let newPhotoUrl = photoBase64;
      try {
        const res = await api.post('/auth/upload-avatar', { image: photoBase64 });
        if (res.data?.photo_url) {
          newPhotoUrl = res.data.photo_url;
        }
        if (res.data?.user) {
          updateUser(res.data.user);
          setProfile(res.data.user);
        }
      } catch {
        const res = await api.put('/auth/profile', { photo_url: photoBase64 });
        if (res.data?.user) {
          updateUser(res.data.user);
          setProfile(res.data.user);
          if (res.data.user.photo_url) newPhotoUrl = res.data.user.photo_url;
        }
      }
      handleFieldChange('photo_url', newPhotoUrl);
      showToast('Profile photo cropped & uploaded successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload photo', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.name?.trim()) {
      showToast('Full Name is required.', 'error');
      return;
    }
    try {
      setSaving(true);
      const res = await api.put('/auth/profile', formData);
      const updated = res.data?.profile || res.data?.user;
      setProfile(updated);
      if (updated) updateUser(updated);
      showToast('Profile updated successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (currentPassword, newPassword, resetForm) => {
    try {
      setSaving(true);
      await api.put('/auth/profile', { current_password: currentPassword, new_password: newPassword });
      resetForm();
      showToast('Password changed successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };

  return {
    profile, formData, activeTab, setActiveTab, loading, saving, toast,
    handleFieldChange, handlePhotoUpload, handleSaveProfile, handlePasswordChange
  };
};
