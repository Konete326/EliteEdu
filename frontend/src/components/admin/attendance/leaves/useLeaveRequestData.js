import { useState, useEffect, useCallback } from 'react';
import api from '../../../../services/api';
import { useAuth } from '../../../../context/AuthContext';

export const useLeaveRequestData = (activeCampusId, statusFilter, applicantFilter, search, page) => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'Teacher';
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
      if (isTeacher) {
        const [classesRes, studentsRes] = await Promise.all([
          api.get('/attendance/allowed-classes').catch(() => api.get('/grades')),
          api.get('/teacher-portal/my-students').catch(() => api.get('/students?limit=250'))
        ]);
        const gList = classesRes.data?.classes || classesRes.data?.grades || classesRes.data?.data || [];
        const sList = studentsRes.data?.students || studentsRes.data || [];
        setGrades(Array.isArray(gList) ? gList : []);
        setStudents(Array.isArray(sList) ? sList : []);
        setTeachers([{ _id: user?.id, name: user?.name, designation: user?.designation || 'Teacher', employee_code: user?.employee_code }]);
      } else {
        const [gRes, sRes, tRes] = await Promise.all([
          api.get('/grades'),
          api.get('/students?limit=250'),
          api.get('/teachers?limit=200')
        ]);
        setGrades(gRes.data?.grades || gRes.data || []);
        setStudents(sRes.data?.students || sRes.data || []);
        setTeachers(tRes.data?.teachers || tRes.data || []);
      }
    } catch {}
  }, [isTeacher, user]);

  useEffect(() => { loadPrereqs(); }, [loadPrereqs]);
  useEffect(() => { loadLeaves(); }, [loadLeaves]);

  return { data, grades, students, teachers, loading, loadLeaves };
};
