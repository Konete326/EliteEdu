import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';
import { formatStandardTime, normalizeTimeString } from '../utils/timeFormatters';

const getPolicyTime = (field, fallback) => {
  try {
    const raw = localStorage.getItem('elite_attendance_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed[field]) return normalizeTimeString(parsed[field]);
    }
  } catch {}
  return fallback;
};

export const useStaffAttendance = () => {
  const [mode, setMode] = useState('manual');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [campuses, setCampuses] = useState([]);
  const [campusId, setCampusId] = useState('ALL');
  const [department, setDepartment] = useState('ALL');
  const [designation, setDesignation] = useState('ALL');
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('sno');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
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
    } catch (err) {
      setFeedback({ error: err.response?.data?.message || 'Failed to load staff sheet', success: '' });
    } finally {
      setLoading(false);
    }
  }, [date, campusId, designation]);

  useEffect(() => {
    fetchSheet();
  }, [fetchSheet]);

  const summary = useMemo(() => {
    const counts = {
      total: records.length,
      present: 0,
      absent: 0,
      leave: 0,
      shortLeave: 0,
      late: 0,
      halfDay: 0,
      holiday: 0,
      unmarked: 0
    };
    records.forEach((r) => {
      const st = r.status;
      if (st === 'P') counts.present += 1;
      else if (st === 'A') counts.absent += 1;
      else if (st === 'L') counts.leave += 1;
      else if (st === 'SL') counts.shortLeave += 1;
      else if (st === 'Late' || st === 'LT') counts.late += 1;
      else if (st === 'HD') counts.halfDay += 1;
      else if (st === 'Hol' || st === 'H' || st === 'Off') counts.holiday += 1;
      else if (st === 'U') counts.unmarked += 1;
      else counts.unmarked += 1;
    });
    return counts;
  }, [records]);

  const handleStatusChange = (staffId, status) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.staff._id !== staffId) return r;
        const updates = { ...r, status };
        if (status === 'P' && !r.check_in_time) {
          updates.check_in_time = getPolicyTime('entryTime', '08:00 AM');
          if (!r.check_out_time) updates.check_out_time = getPolicyTime('departureTime', '02:00 PM');
        }
        return updates;
      })
    );
  };

  const handleTimeChange = (staffId, field, value) => {
    setRecords((prev) => prev.map((r) => (r.staff._id === staffId ? { ...r, [field]: value } : r)));
  };

  const handleRemarksChange = (staffId, remarks) => {
    setRecords((prev) => prev.map((r) => (r.staff._id === staffId ? { ...r, remarks } : r)));
  };

  const handleMarkAll = (status) => {
    setRecords((prev) =>
      prev.map((r) => {
        const updates = { ...r, status };
        if (status === 'P' && !r.check_in_time) {
          updates.check_in_time = getPolicyTime('entryTime', '08:00 AM');
          if (!r.check_out_time) updates.check_out_time = getPolicyTime('departureTime', '02:00 PM');
        }
        return updates;
      })
    );
  };

  const handleToggleSort = () => {
    setSortBy((prev) => {
      if (prev === 'sno') return 'name_asc';
      if (prev === 'name_asc') return 'name_desc';
      if (prev === 'name_desc') return 'status';
      return 'sno';
    });
  };

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
      setTimeout(() => setFeedback((f) => ({ ...f, success: '' })), 3000);
    } catch (err) {
      setFeedback({ error: err.response?.data?.message || 'Save failed', success: '' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setResetting(true);
      await api.post('/staff-attendance/reset', { date });
      setRecords((prev) => prev.map((r) => ({ ...r, status: 'U', check_in_time: '', check_out_time: '' })));
      setFeedback({ success: `Staff attendance cleared for ${date}`, error: '' });
      setTimeout(() => setFeedback((f) => ({ ...f, success: '' })), 3000);
      return true;
    } catch (err) {
      setFeedback({ error: err.response?.data?.message || 'Failed to reset attendance', success: '' });
      return false;
    } finally {
      setResetting(false);
    }
  };

  const handleScanCode = async (code) => {
    try {
      setScanning(true);
      const res = await api.post('/staff-attendance/scan-card', { code, date, status: 'P' });
      const data = res.data;
      const scanItem = {
        staff: data.staff,
        status: data.attendance?.status || 'P',
        time: data.attendance?.check_in_time || formatStandardTime(new Date()),
        attendance: data.attendance
      };
      setLastScanned(scanItem);
      setScanHistory((prev) => [scanItem, ...prev.slice(0, 19)]);
      setRecords((prev) =>
        prev.map((r) =>
          r.staff._id === data.staff._id
            ? { ...r, status: data.attendance?.status || 'P', check_in_time: data.attendance?.check_in_time, marked_via: 'Card_Scan' }
            : r
        )
      );
      return { success: true, staff: data.staff };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Staff scan failed' };
    } finally {
      setScanning(false);
    }
  };

  const filteredRecords = useMemo(() => {
    let list = records;
    if (department && department !== 'ALL' && department !== 'All Departments') {
      const depQ = department.toLowerCase();
      list = list.filter((r) => (r.staff.department || '').toLowerCase().includes(depQ));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => {
        const name = (r.staff.name || '').toLowerCase();
        const fname = (r.staff.father_name || '').toLowerCase();
        const emp = (r.staff.employee_code || '').toLowerCase();
        const pers = (r.staff.personal_id || '').toLowerCase();
        const cnic = (r.staff.cnic || '').toLowerCase();
        return name.includes(q) || fname.includes(q) || emp.includes(q) || pers.includes(q) || cnic.includes(q);
      });
    }

    if (sortBy === 'name_asc') {
      return [...list].sort((a, b) => (a.staff.name || '').localeCompare(b.staff.name || ''));
    }
    if (sortBy === 'name_desc') {
      return [...list].sort((a, b) => (b.staff.name || '').localeCompare(a.staff.name || ''));
    }
    if (sortBy === 'status') {
      return [...list].sort((a, b) => (a.status || '').localeCompare(b.status || ''));
    }

    return list;
  }, [records, department, search, sortBy]);

  const { departmentCounts, departmentList } = useMemo(() => {
    const counts = { ALL: records.length };
    const deptSet = new Set();
    records.forEach((r) => {
      const dep = r.staff?.department || 'Academic';
      counts[dep] = (counts[dep] || 0) + 1;
      deptSet.add(dep);
    });
    return { departmentCounts: counts, departmentList: Array.from(deptSet).sort() };
  }, [records]);

  return {
    mode,
    setMode,
    date,
    setDate,
    campuses,
    campusId,
    setCampusId,
    department,
    setDepartment,
    departmentCounts,
    departmentList,
    designation,
    setDesignation,
    records,
    filteredRecords,
    summary,
    search,
    setSearch,
    sortBy,
    handleToggleSort,
    loading,
    saving,
    resetting,
    scanning,
    lastScanned,
    scanHistory,
    feedback,
    fetchSheet,
    handleStatusChange,
    handleTimeChange,
    handleRemarksChange,
    handleMarkAll,
    handleSave,
    handleReset,
    handleScanCode
  };
};
