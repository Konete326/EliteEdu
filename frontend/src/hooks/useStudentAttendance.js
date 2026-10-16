import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

export const useStudentAttendance = () => {
  const [mode, setMode] = useState('manual');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [grades, setGrades] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [feedback, setFeedback] = useState({ error: '', success: '' });

  const fetchAllowedClasses = useCallback(async () => {
    try {
      const res = await api.get('/attendance/allowed-classes');
      const list = res.data.grades || [];
      setGrades(list);
      if (list.length > 0 && !selectedGradeId) setSelectedGradeId(list[0]._id);
    } catch (_) {}
  }, [selectedGradeId]);

  useEffect(() => { fetchAllowedClasses(); }, [fetchAllowedClasses]);

  const fetchSheet = useCallback(async () => {
    if (!selectedGradeId) return;
    try {
      setLoading(true);
      const params = { date, grade_id: selectedGradeId };
      if (selectedSection !== 'ALL') params.section = selectedSection;
      const res = await api.get('/attendance/sheet', { params });
      setRecords(res.data.records || []);
      setSummary(res.data.summary || {});
    } catch (err) {
      setFeedback({ error: err.response?.data?.message || 'Failed to load sheet', success: '' });
    } finally {
      setLoading(false);
    }
  }, [date, selectedGradeId, selectedSection]);

  useEffect(() => { fetchSheet(); }, [fetchSheet]);

  const handleStatusChange = (studentId, status) => setRecords((prev) => prev.map((r) => (r.student._id === studentId ? { ...r, status } : r)));
  const handleRemarksChange = (studentId, remarks) => setRecords((prev) => prev.map((r) => (r.student._id === studentId ? { ...r, remarks } : r)));
  const handleMarkAll = (status) => setRecords((prev) => prev.map((r) => ({ ...r, status })));

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        date, grade_id: selectedGradeId, section: selectedSection,
        attendances: records.map((r) => ({
          student_id: r.student._id, status: r.status,
          remarks: r.remarks || '', marked_via: r.marked_via || 'Manual'
        }))
      };
      await api.post('/attendance/mark-bulk', payload);
      setFeedback({ success: 'Attendance saved successfully!', error: '' });
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
      const res = await api.post('/attendance/scan-card', { code, date, grade_id: selectedGradeId || undefined, status: 'P' });
      const data = res.data;
      const scanItem = { student: data.student, status: data.status, time: new Date().toLocaleTimeString() };
      setLastScanned(scanItem);
      setScanHistory((prev) => [scanItem, ...prev.slice(0, 19)]);
      if (data.summary) setSummary(data.summary);
      setRecords((prev) => prev.map((r) => (r.student._id === data.student._id ? { ...r, status: data.status, marked_via: 'Card_Scan' } : r)));
      return { success: true, student: data.student };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Scan verification failed' };
    } finally {
      setScanning(false);
    }
  };

  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter((r) => {
      const name = `${r.student.first_name || ''} ${r.student.last_name || ''}`.toLowerCase();
      const gr = (r.student.gr_number || '').toLowerCase();
      return name.includes(q) || gr.includes(q);
    });
  }, [records, search]);

  return {
    mode, setMode, date, setDate, grades, selectedGradeId, setSelectedGradeId,
    sections: grades.find((g) => g._id === selectedGradeId)?.sections || [],
    selectedSection, setSelectedSection, records, filteredRecords, summary, search, setSearch,
    loading, saving, scanning, lastScanned, scanHistory, feedback,
    handleStatusChange, handleRemarksChange, handleMarkAll, handleSave, handleScanCode
  };
};
