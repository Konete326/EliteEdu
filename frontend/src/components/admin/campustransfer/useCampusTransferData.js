import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';

export const useCampusTransferData = () => {
  const [campuses, setCampuses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [kpis, setKpis] = useState({});
  const [loading, setLoading] = useState(false);
  const [prereqsLoading, setPrereqsLoading] = useState(false);
  const [prereqsLoaded, setPrereqsLoaded] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/campus-transfers');
      setTransfers(res.data?.data || []);
      setKpis(res.data?.kpis || {});
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  const loadPrereqs = useCallback(async () => {
    if (prereqsLoaded || prereqsLoading) return;
    setPrereqsLoading(true);
    try {
      const [campusesRes, gradesRes, studentsRes, teachersRes] = await Promise.all([
        api.get('/campuses'),
        api.get('/grades'),
        api.get('/students?status=Active&limit=300'),
        api.get('/teachers')
      ]);
      setCampuses(campusesRes.data?.campuses || campusesRes.data?.data || []);
      setGrades(gradesRes.data?.grades || gradesRes.data?.data || []);
      setStudents(studentsRes.data?.students || studentsRes.data?.data?.students || studentsRes.data?.data || []);
      setTeachers(teachersRes.data?.teachers || teachersRes.data?.data || []);
      setPrereqsLoaded(true);
    } catch {} finally {
      setPrereqsLoading(false);
    }
  }, [prereqsLoaded, prereqsLoading]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPrereqs();
    }, 150);
    return () => clearTimeout(timer);
  }, [loadPrereqs]);

  return {
    campuses,
    grades,
    students,
    teachers,
    transfers,
    kpis,
    loading,
    prereqsLoading,
    prereqsLoaded,
    loadData,
    loadPrereqs
  };
};

export default useCampusTransferData;
