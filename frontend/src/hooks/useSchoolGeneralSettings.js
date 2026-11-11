import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DEFAULT_SETTINGS = {
  name: '',
  code: '',
  school_type: 'Private',
  board: '',
  address: '',
  contact_number: '',
  email: '',
  logo_url: '',
  slogan: '',
  website: '',
  affiliation_number: '',
  established_year: '',
  principal_name: '',
  principal_signature_url: '',
  teacher_signature_url: '',
  currency: 'PKR'
};

const generateCodeFromName = (schoolName) => {
  if (!schoolName) return '';
  const words = schoolName.trim().split(/\s+/).filter(Boolean);
  const initials = words.map((w) => w[0].toUpperCase()).join('').slice(0, 5);
  return `${initials || 'SCH'}-01`;
};

export const useSchoolGeneralSettings = () => {
  const { updateUser } = useAuth();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [initialSettings, setInitialSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/schools/general-settings');
      if (res.data?.school) {
        const loaded = res.data.school;
        setSettings(loaded);
        setInitialSettings(loaded);

        if (!loaded.principal_signature_url || !loaded.teacher_signature_url) {
          api.get('/signatures').then((sigRes) => {
            const sigs = sigRes.data?.signatures || sigRes.data || [];
            const defaultSign = sigs.find((s) => s.is_default && !s.is_stamp) || sigs.find((s) => !s.is_stamp);
            const defaultStamp = sigs.find((s) => s.is_default && s.is_stamp) || sigs.find((s) => s.is_stamp);
            setSettings((prev) => ({
              ...prev,
              principal_signature_url: prev.principal_signature_url || defaultSign?.image_url || '',
              teacher_signature_url: prev.teacher_signature_url || defaultStamp?.image_url || ''
            }));
          }).catch(() => {});
        }
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        title: 'Failed to load settings',
        message: err.response?.data?.message || err.message || 'Unable to fetch school profile'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (field, value) => {
    setSettings((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'name' && (!prev.code || prev.code.endsWith('-01'))) {
        updated.code = generateCodeFromName(value);
      }
      return updated;
    });
  };

  const handleBatchChange = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const syncSignaturesFromStudio = useCallback(async () => {
    try {
      const res = await api.get('/signatures');
      const sigs = res.data?.signatures || res.data || [];
      const defaultSign = sigs.find((s) => s.is_default && !s.is_stamp) || sigs.find((s) => !s.is_stamp);
      const defaultStamp = sigs.find((s) => s.is_default && s.is_stamp) || sigs.find((s) => s.is_stamp);

      const updates = {};
      if (defaultSign?.image_url) updates.principal_signature_url = defaultSign.image_url;
      if (defaultStamp?.image_url) updates.teacher_signature_url = defaultStamp.image_url;

      if (Object.keys(updates).length > 0) {
        setSettings((prev) => ({ ...prev, ...updates }));
        setFeedback({
          type: 'success',
          title: 'Signatures Synchronized',
          message: 'Official signatures successfully linked from Signatures Studio.'
        });
        return true;
      }

      setFeedback({
        type: 'error',
        title: 'No Signatures Found',
        message: 'Please add signatures in General Settings > Signatures first.',
        actionLink: '/admin/general-settings/signatures',
        actionLabel: 'Open Signatures Studio'
      });
      return false;
    } catch (err) {
      setFeedback({
        type: 'error',
        title: 'Sync Failed',
        message: err.message || 'Could not fetch signatures from studio.'
      });
      return false;
    }
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!settings.name.trim()) {
      setFeedback({
        type: 'error',
        title: 'Validation Error',
        message: 'School Name cannot be empty.'
      });
      return;
    }

    try {
      setSaving(true);
      const res = await api.put('/schools/general-settings', settings);
      if (res.data?.success) {
        setSettings(res.data.school);
        setInitialSettings(res.data.school);
        updateUser({
          school_name: res.data.school.name,
          school_logo: res.data.school.logo_url,
          school_slogan: res.data.school.slogan
        });
        setFeedback({
          type: 'success',
          title: 'Settings Saved',
          message: 'School profile and document settings updated successfully.'
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        title: 'Save Failed',
        message: err.response?.data?.message || err.message || 'Could not update school settings.'
      });
    } finally {
      setSaving(false);
    }
  };

  const isDirty = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  return {
    settings,
    loading,
    saving,
    feedback,
    isDirty,
    handleChange,
    handleBatchChange,
    syncSignaturesFromStudio,
    handleSave,
    closeFeedback: () => setFeedback(null),
    reload: fetchSettings
  };
};

export default useSchoolGeneralSettings;
