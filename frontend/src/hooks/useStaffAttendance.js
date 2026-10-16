import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

export const useStaffAttendance = () => {
  const [mode, setMode] = useState('manual');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [campuses, setCampuses] = useState([]);
  const [campusId, setCampusId] = useState('ALL');
  const [designation, setDesignation] = useState('ALL');
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [feedback, setFeedback] = useState({ error: '', success: '' });

  useEffect(() => {
    api.get('/campuses').then((res) => setCampuses(res.data.campuses || [])).catch(() => {});
  }, []);

  const fetchSheet = useCallback(async () => {
    try {
      setLoading(true);
      const params = { date };
      if (campusId !== 'ALL') params.campus_id = campusId;
      if (designation !== 'ALL') params.designation = designation;
      const res = await api.get('/staff-attendance/sheet', { params });
      setRecords(res.data.records || []);
      setSummary(res.data.summary || {});
    } catch (err) {
      setFeedback({ error: err.response?.data?.message || 'Failed to load staff sheet', success: '' });
    } finally {
      setLoading(false);
    }
  }, [date, campusId, designation]);

  useEffect(() => { fetchSheet(); }, [fetchSheet]);

  const handleStatusChange = (staffId, status) => setRecords((prev) => prev.map((r) => (r.staff._id === staffId ? { ...r, status } : r)));
  const handleTimeChange = (staffId, field, value) => setRecords((prev) => prev.map((r) => (r.staff._id === staffId ? { ...r, [field]: value } : r)));
  const handleRemarksChange = (staffId, remarks) => setRecords((prev) => prev.map((r) => (r.staff._id === staffId ? { ...r, remarks } : r)));
  const handleMarkAll = (status) => setRecords((prev) => prev.map((r) => ({ ...r, status })));

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        date,
        attendances: records.map((r) => ({
          staff_id: r.staff._id,
          campus_id: r.staff.campus_id?._id || r.staff.campus_id || null,
          status: r.status,
          check_in_time: r.check_in_time || '',
          check_out_time: r.check_out_time || '',
          remarks: r.remarks || '',
          marked_via: r.marked_via || 'Manual'
        }))
      };
      await api.post('/staff-attendance/mark-bulk', payload);
      setFeedback({ success: 'Staff attendance saved successfully!', error: '' });
      fetchSheet();
      setTimeout(() => setFeedback((f) => ({ ...f, success: '' })), 3000);
    } catch (err) {
      setFeedback({ error: err.response?.data?.message || 'Save failed', success: '' });
    } finally {
      setSaving(false);
    }
  };

  const handleScanCode = async (code) => {
    try {
      setScanning(true);
      const res = await api.post('/staff-attendance/scan-card', { code, date, status: 'P' });
      const data = res.data;
      const scanItem = { staff: data.staff, status: data.attendance?.status || 'P', time: data.attendance?.check_in_time || new Date().toLocaleTimeString(), attendance: data.attendance };
      setLastScanned(scanItem);
      setScanHistory((prev) => [scanItem, ...prev.slice(0, 19)]);
      if (data.summary) setSummary(data.summary);
      setRecords((prev) => prev.map((r) => (r.staff._id === data.staff._id ? { ...r, status: data.attendance?.status || 'P', check_in_time: data.attendance?.check_in_time, marked_via: 'Card_Scan' } : r)));
      return { success: true, staff: data.staff };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Staff scan failed' };
    } finally {
      setScanning(false);
    }
  };

  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter((r) => {
      const name = (r.staff.name || '').toLowerCase();
      const emp = (r.staff.employee_code || '').toLowerCase();
      const pers = (r.staff.personal_id || '').toLowerCase();
      const cnic = (r.staff.cnic || '').toLowerCase();
      return name.includes(q) || emp.includes(q) || pers.includes(q) || cnic.includes(q);
    });
  }, [records, search]);

  return {
    mode, setMode, date, setDate, campuses, campusId, setCampusId,
    designation, setDesignation, records, filteredRecords, summary, search, setSearch,
    loading, saving, scanning, lastScanned, scanHistory, feedback,
    handleStatusChange, handleTimeChange, handleRemarksChange, handleMarkAll, handleSave, handleScanCode
  };
};
