import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { sortGradesInSequence } from '../utils/gradeSortHelper';
import { useCampus } from '../context/CampusContext';
import { useToast } from '../context/ToastContext';

export const useGrades = (customCampusId = '') => {
  const { activeCampusId } = useCampus();
  const { showToast } = useToast();
  const effectiveCampusId = customCampusId || (activeCampusId !== 'all' ? activeCampusId : '');

  const [grades, setGrades] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const campusQuery = effectiveCampusId ? `?campus_id=${effectiveCampusId}` : '';
      const [gRes, cRes, tRes] = await Promise.all([
        api.get(`/grades${campusQuery}`),
        api.get('/campuses'),
        api.get('/teachers')
      ]);
      setGrades(sortGradesInSequence(gRes.data?.grades || []));
      setCampuses(cRes.data?.campuses || []);
      setTeachers(tRes.data?.teachers || []);
    } catch {
      showToast('Failed to fetch grades and academic levels', 'error');
    } finally {
      setLoading(false);
    }
  }, [effectiveCampusId, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveGrade = async (payload, selectedGradeId) => {
    const finalPayload = {
      ...payload,
      campus_id: payload.campus_id || (effectiveCampusId || null)
    };
    if (selectedGradeId) {
      const res = await api.put(`/grades/${selectedGradeId}`, finalPayload);
      setGrades((prev) => prev.map((g) => (g._id === selectedGradeId ? res.data.grade : g)));
      showToast(`Class "${payload.name}" updated successfully`, 'success');
    } else {
      const res = await api.post('/grades', finalPayload);
      setGrades((prev) => sortGradesInSequence([res.data.grade, ...prev]));
      showToast(`Class "${payload.name}" created successfully`, 'success');
    }
  };

  const toggleStatus = async (gradeId) => {
    try {
      const res = await api.patch(`/grades/${gradeId}/status`);
      setGrades((prev) => prev.map((g) => (g._id === gradeId ? res.data.grade : g)));
      showToast(`Class status changed to ${res.data?.grade?.status || 'Active'}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update grade status', 'error');
    }
  };

  const deleteGrade = async (gradeId) => {
    try {
      await api.delete(`/grades/${gradeId}`);
      setGrades((prev) => prev.filter((g) => g._id !== gradeId));
      showToast('Class removed successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete grade', 'error');
      throw err;
    }
  };

  const reorderGrades = async (newOrderedGrades) => {
    const updated = newOrderedGrades.map((g, index) => ({
      ...g,
      order: index + 1
    }));
    setGrades(updated);
    try {
      await api.patch('/grades/reorder', {
        orderedIds: updated.map((g) => g._id)
      });
      showToast('Class sequence order saved', 'success');
    } catch {
      showToast('Failed to save grade order', 'error');
      fetchData();
    }
  };

  const autoLoadGrades = async (targetCampusId) => {
    try {
      setIsSeeding(true);
      const res = await api.post('/grades/seed-defaults', { campus_id: targetCampusId || effectiveCampusId || null });
      showToast(res.data?.message || 'Standard grades seeded successfully', 'success');
      await fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to auto-load grades', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  return {
    grades,
    campuses,
    teachers,
    loading,
    isSeeding,
    saveGrade,
    toggleStatus,
    deleteGrade,
    reorderGrades,
    autoLoadGrades,
    reload: fetchData
  };
};

export default useGrades;
