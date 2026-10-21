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

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/campus-transfers?limit=200');
      setTransfers(res.data?.data || []);
      setKpis(res.data?.kpis || {});
    } catch {
      setTransfers([]);
      setKpis({});
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPrereqs = useCallback(async () => {
    setPrereqsLoading(true);
    try {
      const [campusesRes, gradesRes, studentsRes, teachersRes] = await Promise.all([
        api.get('/campuses'),
        api.get('/grades'),
        api.get('/students?status=Active&limit=500'),
        api.get('/teachers')
      ]);
      setCampuses(campusesRes.data?.campuses || campusesRes.data?.data || []);
      setGrades(gradesRes.data?.grades || gradesRes.data?.data || []);
      setStudents(studentsRes.data?.students || studentsRes.data?.data?.students || studentsRes.data?.data || []);
      setTeachers(teachersRes.data?.teachers || teachersRes.data?.data || []);
    } catch {
    } finally {
      setPrereqsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    loadPrereqs();
  }, [loadData, loadPrereqs]);

  return {
    campuses,
    grades,
    students,
    teachers,
    transfers,
    kpis,
    loading,
    prereqsLoading,
    loadData,
    loadPrereqs
  };
};

export default useCampusTransferData;
