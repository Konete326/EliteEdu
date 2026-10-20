import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';
import { formatStandardTime } from '../utils/timeFormatters';

const getTodayLocalDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useStudentAttendance = () => {
  const [mode, setMode] = useState('student');
  const [date, setDate] = useState(getTodayLocalDate());
  const [grades, setGrades] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({});
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [feedback, setFeedback] = useState({ error: '', success: '' });

  const fetchAllowedClasses = useCallback(async () => {
    try {
      const res = await api.get('/attendance/allowed-classes');
      let list = res.data?.classes || res.data?.grades || res.data?.data || [];
      if (!Array.isArray(list) || list.length === 0) {
        const fallbackRes = await api.get('/grades');
        list = fallbackRes.data?.grades || fallbackRes.data?.data || fallbackRes.data || [];
      }
      setGrades(Array.isArray(list) ? list : []);
    } catch (_) {
      try {
        const fallbackRes = await api.get('/grades');
        const list = fallbackRes.data?.grades || fallbackRes.data?.data || [];
        setGrades(Array.isArray(list) ? list : []);
      } catch {
        setGrades([]);
      }
    }
  }, []);

  useEffect(() => {
    fetchAllowedClasses();
  }, [fetchAllowedClasses]);

  const fetchSheet = useCallback(async () => {
    if (!selectedGradeId) return;
    try {
      setLoading(true);
      setFeedback({ error: '', success: '' });
      const params = { date, grade_id: selectedGradeId };
      if (selectedSection && selectedSection !== 'ALL') {
        params.section = selectedSection;
      }
      const res = await api.get('/attendance/sheet', { params });
      setRecords(res.data?.records || []);
      setSummary(res.data?.summary || res.data?.stats || {});
      setLoaded(true);
    } catch (err) {
      setFeedback({ error: err.response?.data?.message || 'Failed to load attendance sheet', success: '' });
    } finally {
      setLoading(false);
    }
  }, [date, selectedGradeId, selectedSection]);

  const handleShow = () => {
    if (!selectedGradeId) {
      setFeedback({ error: 'Please select a class first.', success: '' });
      return;
    }
    fetchSheet();
  };

  const recomputeSummary = (updatedRecords) => {
    let present = 0;
    let absent = 0;
    let leave = 0;
    let late = 0;
    let halfDay = 0;
    updatedRecords.forEach((r) => {
      if (r.status === 'P') present++;
      else if (r.status === 'A') absent++;
      else if (r.status === 'L') leave++;
      else if (r.status === 'LT') late++;
      else if (r.status === 'HD') halfDay++;
    });
    const total = updatedRecords.length;
    setSummary((prev) => ({
      ...prev,
      total,
      present,
      absent,
      leave,
      late,
      halfDay,
      markedCount: total
    }));
  };

  const handleStatusChange = (studentId, status) => {
    setRecords((prev) => {
      const updated = prev.map((r) => (r.student?._id === studentId || r._id === studentId ? { ...r, status } : r));
      recomputeSummary(updated);
      return updated;
    });
  };

  const handleRemarksChange = (studentId, remarks) => {
    setRecords((prev) => prev.map((r) => (r.student?._id === studentId || r._id === studentId ? { ...r, remarks } : r)));
  };

  const handleMarkAll = (status) => {
    setRecords((prev) => {
      const updated = prev.map((r) => ({ ...r, status }));
      recomputeSummary(updated);
      return updated;
    });
  };

  const handleSave = async () => {
    if (!selectedGradeId || records.length === 0) return;
    try {
      setSaving(true);
      const payload = {
        date,
        grade_id: selectedGradeId,
        section: selectedSection || 'A',
        records: records.map((r) => ({
          student_id: r.student?._id || r._id,
          status: r.status || 'P',
          remarks: r.remarks || '',
          marked_via: r.marked_via || 'Manual'
        }))
      };
      await api.post('/attendance/mark-bulk', payload);
      setFeedback({ success: 'Attendance saved successfully!', error: '' });
      setTimeout(() => setFeedback((f) => ({ ...f, success: '' })), 4000);
    } catch (err) {
      setFeedback({ error: err.response?.data?.message || 'Failed to save attendance', success: '' });
    } finally {
      setSaving(false);
    }
  };

  const handleScanCode = async (code) => {
    try {
      setScanning(true);
      const res = await api.post('/attendance/scan-card', { code, date, grade_id: selectedGradeId || undefined, status: 'P' });
      const data = res.data;
      const scanItem = { student: data.student, status: data.status, time: formatStandardTime(new Date()) };
      setLastScanned(scanItem);
      setScanHistory((prev) => [scanItem, ...prev.slice(0, 19)]);
      if (data.summary) setSummary(data.summary);
      setRecords((prev) => prev.map((r) => (r.student?._id === data.student?._id ? { ...r, status: data.status, marked_via: 'Card_Scan' } : r)));
      return { success: true, student: data.student };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Scan verification failed' };
    } finally {
      setScanning(false);
    }
  };

  const sortedAndFilteredRecords = useMemo(() => {
    let list = records;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => {
        const student = r.student || {};
        const name = (student.name || `${student.first_name || ''} ${student.last_name || ''}`).toLowerCase();
        const gr = (student.gr_number || '').toLowerCase();
        const roll = String(student.roll_number || '').toLowerCase();
        return name.includes(q) || gr.includes(q) || roll.includes(q);
      });
    }

    return [...list].sort((a, b) => {
      const sA = a.student || {};
      const sB = b.student || {};
      if (sortBy === 'roll') {
        const rollA = parseInt(sA.roll_number || sA.gr_number || '0', 10);
        const rollB = parseInt(sB.roll_number || sB.gr_number || '0', 10);
        return rollA - rollB;
      }
      if (sortBy === 'status') {
        const order = { P: 1, A: 2, L: 3, LT: 4, HD: 5 };
        return (order[a.status] || 99) - (order[b.status] || 99);
      }
      const nameA = (sA.name || `${sA.first_name || ''} ${sA.last_name || ''}`).toLowerCase();
      const nameB = (sB.name || `${sB.first_name || ''} ${sB.last_name || ''}`).toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [records, search, sortBy]);

  const currentGrade = useMemo(() => grades.find((g) => g._id === selectedGradeId), [grades, selectedGradeId]);
  const currentSections = useMemo(() => {
    if (!currentGrade) return [];
    if (Array.isArray(currentGrade.sections)) return currentGrade.sections;
    return [];
  }, [currentGrade]);

  return {
    mode, setMode, date, setDate, grades, selectedGradeId, setSelectedGradeId,
    sections: currentSections, selectedSection, setSelectedSection,
    records, filteredRecords: sortedAndFilteredRecords, summary, search, setSearch,
    sortBy, setSortBy, loading, loaded, setLoaded, saving, scanning, lastScanned, scanHistory, feedback, setFeedback,
    handleShow, handleStatusChange, handleRemarksChange, handleMarkAll, handleSave, handleScanCode
  };
};
