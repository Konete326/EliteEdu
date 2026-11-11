import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatStandardTime } from '../utils/timeFormatters';

const getTodayLocalDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useStudentAttendance = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'Teacher';
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
  const isInitialMount = useRef(true);

  const fetchSheet = useCallback(async (gradeId = selectedGradeId, sec = selectedSection, dt = date) => {
    const targetGrade = gradeId || selectedGradeId;
    if (!targetGrade) return;
    try {
      setLoading(true);
      setFeedback({ error: '', success: '' });
      const params = { date: dt, grade_id: targetGrade };
      if (sec && sec !== 'ALL') {
        params.section = sec;
      }
      const res = await api.get('/attendance/sheet', { params });
      const rawRecords = res.data?.records || [];
      const stats = res.data?.summary || res.data?.stats || {};

      const isFresh = (stats.markedCount === 0) || rawRecords.every((r) => !r.is_marked);
      const preparedRecords = rawRecords.map((r) => ({
        ...r,
        status: r.status || 'P'
      }));

      setRecords(preparedRecords);
      if (isFresh && preparedRecords.length > 0) {
        setSummary({
          total: preparedRecords.length,
          present: preparedRecords.length,
          absent: 0,
          leave: 0,
          late: 0,
          halfDay: 0,
          markedCount: preparedRecords.length,
          unmarked: 0,
          isFreshDefault: true
        });
      } else {
        setSummary({
          ...stats,
          isFreshDefault: false
        });
      }
      setLoaded(true);
    } catch (err) {
      setFeedback({ error: err.response?.data?.message || 'Failed to load attendance sheet', success: '' });
    } finally {
      setLoading(false);
    }
  }, [date, selectedGradeId, selectedSection]);

  const fetchAllowedClasses = useCallback(async () => {
    try {
      const res = await api.get('/attendance/allowed-classes');
      let list = res.data?.classes || res.data?.grades || res.data?.data || [];
      if (!Array.isArray(list) || list.length === 0) {
        const fallbackRes = await api.get('/grades');
        list = fallbackRes.data?.grades || fallbackRes.data?.data || fallbackRes.data || [];
      }
      let valid = Array.isArray(list) ? list : [];
      if (isTeacher && valid.length > 0) {
        const userId = String(user?.id || user?._id || '');
        const filtered = valid.filter((g) => {
          const isCt = String(g.class_teacher?._id || g.class_teacher) === userId;
          const hasSec = (g.section_teachers || []).some(
            (st) => String(st.teacher_id?._id || st.teacher_id) === userId
          );
          return isCt || hasSec;
        });
        if (filtered.length > 0) valid = filtered;
      }
      setGrades(valid);

      if (valid.length > 0 && !selectedGradeId) {
        const first = valid[0];
        setSelectedGradeId(first._id);
        fetchSheet(first._id, selectedSection, date);
      }
    } catch (_) {
      try {
        const fallbackRes = await api.get('/grades');
        const list = fallbackRes.data?.grades || fallbackRes.data?.data || [];
        const valid = Array.isArray(list) ? list : [];
        setGrades(valid);
        if (valid.length > 0 && !selectedGradeId) {
          const first = valid[0];
          setSelectedGradeId(first._id);
          fetchSheet(first._id, selectedSection, date);
        }
      } catch {
        setGrades([]);
      }
    }
  }, [date, selectedGradeId, selectedSection, fetchSheet]);

  useEffect(() => {
    fetchAllowedClasses();
  }, [fetchAllowedClasses]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (selectedGradeId) {
      fetchSheet(selectedGradeId, selectedSection, date);
    }
  }, [selectedGradeId, selectedSection, date, fetchSheet]);

  const handleShow = () => {
    if (!selectedGradeId) {
      setFeedback({ error: 'Please select a class first.', success: '' });
      return;
    }
    fetchSheet(selectedGradeId, selectedSection, date);
  };

  const recomputeSummary = useCallback((updatedRecords) => {
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
      markedCount: total,
      isFreshDefault: false
    }));
  }, []);

  const handleStatusChange = useCallback((studentId, status) => {
    setRecords((prev) => {
      const updated = prev.map((r) => (r.student?._id === studentId || r._id === studentId ? { ...r, status } : r));
      recomputeSummary(updated);
      return updated;
    });
  }, [recomputeSummary]);

  const handleRemarksChange = useCallback((studentId, remarks) => {
    setRecords((prev) => prev.map((r) => (r.student?._id === studentId || r._id === studentId ? { ...r, remarks } : r)));
  }, []);

  const handleMarkAll = useCallback((status) => {
    setRecords((prev) => {
      const updated = prev.map((r) => ({ ...r, status }));
      recomputeSummary(updated);
      return updated;
    });
  }, [recomputeSummary]);

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
    if (!Array.isArray(currentGrade.sections)) return [];
    if (isTeacher) {
      const userId = String(user?.id || user?._id || '');
      const mySections = (currentGrade.section_teachers || [])
        .filter((st) => String(st.teacher_id?._id || st.teacher_id) === userId)
        .map((st) => st.section);
      if (mySections.length > 0) return mySections;
    }
    return currentGrade.sections;
  }, [currentGrade, isTeacher, user]);

  useEffect(() => {
    if (currentSections.length > 0 && (!selectedSection || !currentSections.includes(selectedSection))) {
      setSelectedSection(currentSections[0]);
    }
  }, [currentSections, selectedSection]);

  return {
    mode, setMode, date, setDate, grades, selectedGradeId, setSelectedGradeId,
    sections: currentSections, selectedSection, setSelectedSection,
    records, filteredRecords: sortedAndFilteredRecords, summary, search, setSearch,
    sortBy, setSortBy, loading, loaded, setLoaded, saving, scanning, lastScanned, scanHistory, feedback, setFeedback,
    handleShow, handleStatusChange, handleRemarksChange, handleMarkAll, handleSave, handleScanCode
  };
};
