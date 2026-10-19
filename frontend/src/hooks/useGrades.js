import { useState, useEffect } from 'react';
import api from '../services/api';
import { sortGradesInSequence } from '../utils/gradeSortHelper';

export const useGrades = () => {
  const [grades, setGrades] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gRes, cRes, tRes] = await Promise.all([
        api.get('/grades'),
        api.get('/campuses'),
        api.get('/teachers')
      ]);
      setGrades(sortGradesInSequence(gRes.data?.grades || []));
      setCampuses(cRes.data?.campuses || []);
      setTeachers(tRes.data?.teachers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveGrade = async (payload, selectedGradeId) => {
    if (selectedGradeId) {
      const res = await api.put(`/grades/${selectedGradeId}`, payload);
      setGrades((prev) => prev.map((g) => (g._id === selectedGradeId ? res.data.grade : g)));
    } else {
      const res = await api.post('/grades', payload);
      setGrades((prev) => [res.data.grade, ...prev]);
    }
  };

  const toggleStatus = async (gradeId) => {
    try {
      const res = await api.patch(`/grades/${gradeId}/status`);
      setGrades((prev) => prev.map((g) => (g._id === gradeId ? res.data.grade : g)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteGrade = async (gradeId) => {
    await api.delete(`/grades/${gradeId}`);
    setGrades((prev) => prev.filter((g) => g._id !== gradeId));
  };

  const reorderGrades = async (newOrderedGrades) => {
    setGrades(newOrderedGrades);
    try {
      await api.patch('/grades/reorder', {
        orderedIds: newOrderedGrades.map((g) => g._id)
      });
    } catch (err) {
      console.error(err);
      fetchData();
    }
  };

  const autoLoadGrades = async (campusId) => {
    try {
      setIsSeeding(true);
      await api.post('/grades/seed-defaults', { campus_id: campusId || null });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSeeding(false);
    }
  };

  return {
    grades, campuses, teachers, loading, isSeeding,
    saveGrade, toggleStatus, deleteGrade, reorderGrades, autoLoadGrades
  };
};
