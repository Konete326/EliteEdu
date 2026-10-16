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
  currency: 'PKR'
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
        setSettings(res.data.school);
        setInitialSettings(res.data.school);
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
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

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
    handleSave,
    closeFeedback: () => setFeedback(null),
    reload: fetchSettings
  };
};

export default useSchoolGeneralSettings;
