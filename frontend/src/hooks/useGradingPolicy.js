import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useGradingPolicy = () => {
  const [policy, setPolicy] = useState(null);
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCampuses = useCallback(async () => {
    try {
      const res = await api.get('/campuses');
      if (res.data?.campuses) setCampuses(res.data.campuses);
    } catch {
      setCampuses([]);
    }
  }, []);

  const fetchPolicy = useCallback(async (campusId = selectedCampus) => {
    try {
      setLoading(true);
      setError('');
      const q = campusId && campusId !== 'all' ? `?campus_id=${campusId}` : '';
      const res = await api.get(`/grading-policies${q}`);
      if (res.data?.policy) setPolicy(res.data.policy);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load policy');
    } finally {
      setLoading(false);
    }
  }, [selectedCampus]);

  useEffect(() => { fetchCampuses(); }, [fetchCampuses]);
  useEffect(() => { fetchPolicy(selectedCampus); }, [selectedCampus, fetchPolicy]);

  const mutate = async (url, method, data, msg) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const cid = selectedCampus && selectedCampus !== 'all' ? selectedCampus : null;
      const res = await api[method](url, { campus_id: cid, ...data });
      if (res.data?.policy) setPolicy(res.data.policy);
      setSuccess(msg);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    policy,
    campuses,
    selectedCampus,
    setSelectedCampus,
    loading,
    saving,
    error,
    setError,
    success,
    setSuccess,
    saveScale: (grading_scale) => mutate('/grading-policies/scale', 'put', { grading_scale }, 'Grading scale saved successfully'),
    saveCriteria: (fail_criteria) => mutate('/grading-policies/fail-criteria', 'put', fail_criteria, 'Fail criteria saved successfully'),
    resetDefaults: () => mutate('/grading-policies/reset-defaults', 'post', {}, 'Standard scale reset successfully'),
    refresh: () => fetchPolicy(selectedCampus)
  };
};
