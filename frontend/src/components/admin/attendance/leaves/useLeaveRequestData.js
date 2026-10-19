import { useState, useEffect, useCallback } from 'react';
import api from '../../../../services/api';

export const useLeaveRequestData = (activeCampusId, statusFilter, applicantFilter, search, page) => {
  const [data, setData] = useState({ leaves: [], kpis: {}, pagination: {} });
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/leaves', {
        params: { campus_id: activeCampusId, status: statusFilter, applicant_type: applicantFilter, search, page, limit: 10 }
      });
      setData(res.data);
    } catch {} finally { setLoading(false); }
  }, [activeCampusId, statusFilter, applicantFilter, search, page]);

  const loadPrereqs = useCallback(async () => {
    try {
      const [gRes, sRes, tRes] = await Promise.all([
        api.get('/grades'),
        api.get('/students?limit=250'),
        api.get('/teachers?limit=200')
      ]);
      setGrades(gRes.data?.grades || gRes.data || []);
      setStudents(sRes.data?.students || sRes.data || []);
      setTeachers(tRes.data?.teachers || tRes.data || []);
    } catch {}
  }, []);

  useEffect(() => { loadPrereqs(); }, [loadPrereqs]);
  useEffect(() => { loadLeaves(); }, [loadLeaves]);

  return { data, grades, students, teachers, loading, loadLeaves };
};
