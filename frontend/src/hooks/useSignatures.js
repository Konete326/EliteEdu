import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useSignatures = () => {
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchSignatures = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/signatures');
      setSignatures(res.data?.data || []);
    } catch (err) {
      setFeedback({
        type: 'error',
        title: 'Error Loading Signatures',
        message: err.response?.data?.message || err.message || 'Unable to fetch signatures'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignatures();
  }, [fetchSignatures]);

  const saveSignature = async (payload) => {
    try {
      setSaving(true);
      let userId;
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const u = JSON.parse(raw);
          userId = u?._id || u?.id;
        }
      } catch (e) {}
      const body = userId ? { user_id: userId, ...payload } : payload;
      const res = await api.post('/signatures', body);
      setFeedback({
        type: 'success',
        title: 'Success',
        message: `${payload.is_stamp ? 'Official Stamp' : 'Signature'} saved successfully`
      });
      await fetchSignatures();
      return res.data?.data;
    } catch (err) {
      setFeedback({
        type: 'error',
        title: 'Failed to Save',
        message: err.response?.data?.message || err.message || 'Could not save signature'
      });
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const setDefault = async (id) => {
    try {
      await api.patch(`/signatures/${id}/default`);
      setFeedback({
        type: 'success',
        title: 'Default Updated',
        message: 'Default signature/stamp updated successfully'
      });
      await fetchSignatures();
    } catch (err) {
      setFeedback({
        type: 'error',
        title: 'Update Failed',
        message: err.response?.data?.message || err.message || 'Failed to update default'
      });
    }
  };

  const deleteSignature = async (id) => {
    try {
      await api.delete(`/signatures/${id}`);
      setFeedback({
        type: 'success',
        title: 'Deleted',
        message: 'Signature removed successfully'
      });
      await fetchSignatures();
    } catch (err) {
      setFeedback({
        type: 'error',
        title: 'Delete Failed',
        message: err.response?.data?.message || err.message || 'Failed to delete signature'
      });
    }
  };

  const stamps = signatures.filter((s) => s.is_stamp);
  const pens = signatures.filter((s) => !s.is_stamp);
  const defaultSignature = pens.find((s) => s.is_default) || pens[0] || null;
  const defaultStamp = stamps.find((s) => s.is_default) || stamps[0] || null;

  return {
    signatures,
    stamps,
    pens,
    defaultSignature,
    defaultStamp,
    loading,
    saving,
    feedback,
    closeFeedback: () => setFeedback(null),
    saveSignature,
    setDefault,
    deleteSignature,
    refresh: fetchSignatures
  };
};

export default useSignatures;
