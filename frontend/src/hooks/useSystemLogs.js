import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

export const useSystemLogs = (user) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState({ totalLogs: 0, networkErrors: 0, consoleErrors: 0, activityLogs: 0 });
  const [category, setCategory] = useState('ALL');
  const [severity, setSeverity] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('ALL');
  const [schools, setSchools] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [livePolling, setLivePolling] = useState(true);

  const selectedLogRef = useRef(selectedLog);
  selectedLogRef.current = selectedLog;

  const fetchLogs = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const params = { page, limit };
      if (category !== 'ALL') params.category = category;
      if (severity !== 'ALL') params.severity = severity;
      if (search.trim()) params.search = search.trim();
      if (user?.role === 'SuperAdmin' && selectedSchoolId !== 'ALL') {
        params.school_id = selectedSchoolId;
      }
      const res = await api.get('/logs', { params });
      const fetchedLogs = res.data.logs || [];
      setLogs(fetchedLogs);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
      setSummary(res.data.summary || { totalLogs: 0, networkErrors: 0, consoleErrors: 0, activityLogs: 0 });
      if (!selectedLogRef.current && fetchedLogs.length > 0) {
        setSelectedLog(fetchedLogs[0]);
      } else if (selectedLogRef.current) {
        const found = fetchedLogs.find((l) => l._id === selectedLogRef.current._id);
        if (found) setSelectedLog(found);
      }
    } catch (err) {
      if (!silent) setError(err.response?.data?.message || 'Failed to fetch system logs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit, category, severity, search, selectedSchoolId, user?.role]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (user?.role !== 'SuperAdmin') return;
    api.get('/schools').then((res) => setSchools(res.data.schools || [])).catch(() => {});
  }, [user?.role]);

  useEffect(() => {
    if (!livePolling) return;
    const interval = setInterval(() => {
      fetchLogs(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [livePolling, fetchLogs]);

  const deleteLog = async (id) => {
    await api.delete(`/logs/${id}`);
    if (selectedLog?._id === id) setSelectedLog(null);
    fetchLogs(true);
  };

  const clearAllLogs = async () => {
    const params = {};
    if (category !== 'ALL') params.category = category;
    if (user?.role === 'SuperAdmin' && selectedSchoolId !== 'ALL') {
      params.school_id = selectedSchoolId;
    }
    await api.delete('/logs', { params });
    setSelectedLog(null);
    fetchLogs(true);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  return {
    logs, loading, refreshing, error, page, setPage, limit, setLimit: handleLimitChange, totalPages, total, summary,
    category, setCategory, severity, setSeverity, search, setSearch,
    selectedSchoolId, setSelectedSchoolId, schools, selectedLog, setSelectedLog,
    livePolling, setLivePolling, fetchLogs, deleteLog, clearAllLogs
  };
};
