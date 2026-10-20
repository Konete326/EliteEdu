import React, { useState, useEffect } from 'react';
import { Video } from 'lucide-react';
import axios from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import ZoomConnectionStatusCard from '../../components/admin/settings/zoom/ZoomConnectionStatusCard';
import ZoomCredentialsForm from '../../components/admin/settings/zoom/ZoomCredentialsForm';
import ZoomWebhookAuditLog from '../../components/admin/settings/zoom/ZoomWebhookAuditLog';

const ZoomSettingsPage = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    client_id: '',
    client_secret: '',
    account_id: '',
    bot_jid: '',
    verification_token: '',
    is_active: false
  });
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/zoom/settings');
      if (res.data?.success && res.data?.data) {
        setSettings(res.data.data);
        setFormData({
          client_id: res.data.data.client_id || '',
          client_secret: res.data.data.client_secret || '',
          account_id: res.data.data.account_id || '',
          bot_jid: res.data.data.bot_jid || '',
          verification_token: res.data.data.verification_token || '',
          is_active: Boolean(res.data.data.is_active)
        });
      }
    } catch {
      toast.error('Failed to load Zoom settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await axios.post('/zoom/settings', formData);
      if (res.data?.success) {
        toast.success('Zoom settings saved successfully');
        fetchSettings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save Zoom settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    try {
      setTesting(true);
      const res = await axios.post('/zoom/test-connection');
      if (res.data?.success) {
        toast.success(res.data.message || 'Connected to Zoom API');
        fetchSettings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Zoom connection failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Zoom Team Chat & Webhook Integration</h1>
            <p className="text-xs text-slate-500">Configure bot credentials, HMAC webhook verification, and outbound alerts</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading Zoom configuration...</div>
      ) : (
        <div className="space-y-6">
          <ZoomConnectionStatusCard settings={settings} onTestConnection={handleTest} testing={testing} />
          <ZoomCredentialsForm formData={formData} onChange={handleChange} onSubmit={handleSave} saving={saving} />
          <ZoomWebhookAuditLog logs={settings?.webhook_logs || []} />
        </div>
      )}
    </div>
  );
};

export default ZoomSettingsPage;
