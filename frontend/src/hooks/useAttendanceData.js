import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

export const useAttendanceData = (userType = 'Student') => {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [campusId, setCampusId] = useState('');
  const [gradeId, setGradeId] = useState('');
  const [entities, setEntities] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchEntities = useCallback(async () => {
    try {
      if (userType === 'Student') {
        const params = new URLSearchParams({ limit: 200 });
        if (campusId) params.append('campus_id', campusId);
        if (gradeId) params.append('grade_id', gradeId);
        const res = await api.get(`/students?${params.toString()}`);
        setEntities(res.data?.students || []);
      } else {
        const res = await api.get('/teachers');
        setEntities(res.data?.teachers || []);
      }
    } catch {
      setEntities([]);
    }
  }, [userType, campusId, gradeId]);

  const fetchRecords = useCallback(async () => {
    try {
      const p = new URLSearchParams({ user_type: userType, date });
      if (campusId) p.append('campus_id', campusId);
      if (gradeId) p.append('grade_id', gradeId);
      const res = await api.get(`/attendance?${p.toString()}`);
      const map = {};
      (res.data?.data || []).forEach((r) => {
        map[r.record_id] = { status: r.status, remarks: r.remarks || '' };
      });
      setAttendanceMap(map);
    } catch {}
  }, [userType, date, campusId, gradeId]);

  useEffect(() => { fetchEntities(); }, [fetchEntities]);
  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleStatusChange = (id, status) => {
    setAttendanceMap((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), status } }));
  };

  const handleRemarksChange = (id, remarks) => {
    setAttendanceMap((prev) => ({ ...prev, [id]: { ...(prev[id] || { status: 'Present' }), remarks } }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    entities.forEach((ent) => {
      updated[ent._id] = { status, remarks: attendanceMap[ent._id]?.remarks || '' };
    });
    setAttendanceMap(updated);
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);
      const records = entities.map((e) => ({
        record_id: e._id,
        status: attendanceMap[e._id]?.status || 'Present',
        remarks: attendanceMap[e._id]?.remarks || ''
      }));
      await api.post('/attendance/mark', {
        user_type: userType,
        date,
        campus_id: campusId || undefined,
        grade_id: gradeId || undefined,
        records
      });
      setFeedback({ type: 'success', title: 'Saved', message: 'Attendance register saved successfully' });
      await fetchRecords();
    } catch (err) {
      setFeedback({ type: 'error', title: 'Save Failed', message: err.response?.data?.message || err.message });
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(() => {
    const counts = { Total: entities.length, Present: 0, Absent: 0, Late: 0, Excused: 0, Half_Day: 0 };
    entities.forEach((e) => {
      const s = attendanceMap[e._id]?.status || 'Present';
      if (counts[s] !== undefined) counts[s] += 1;
    });
    return counts;
  }, [entities, attendanceMap]);

  return {
    date, setDate, campusId, setCampusId, gradeId, setGradeId, entities, attendanceMap,
    saving, feedback, closeFeedback: () => setFeedback(null), handleStatusChange,
    handleRemarksChange, handleMarkAll, saveAttendance, stats
  };
};

export default useAttendanceData;
