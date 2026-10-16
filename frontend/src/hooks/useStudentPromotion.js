import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

export const useStudentPromotion = () => {
  const [candidates, setCandidates] = useState([]);
  const [grades, setGrades] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [recentPromotions, setRecentPromotions] = useState([]);
  const [passThreshold, setPassThreshold] = useState(33);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [campusId, setCampusId] = useState('ALL');
  const [sourceGradeId, setSourceGradeId] = useState('ALL');
  const [section, setSection] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [targetGradeId, setTargetGradeId] = useState('');
  const [targetSection, setTargetSection] = useState('A');
  const [mode, setMode] = useState('Manual');

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (campusId !== 'ALL') params.campus_id = campusId;
      if (sourceGradeId !== 'ALL') params.grade_id = sourceGradeId;
      if (section !== 'ALL') params.section = section;
      if (search.trim()) params.search = search.trim();

      const [cRes, gRes, campRes] = await Promise.all([
        api.get('/promotions/candidates', { params }),
        api.get('/grades'),
        api.get('/campuses')
      ]);
      setCandidates(cRes.data.students || []);
      setPassThreshold(cRes.data.passThreshold || 33);
      setRecentPromotions(cRes.data.recentPromotions || []);
      setGrades(gRes.data.grades || []);
      setCampuses(campRes.data.campuses || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch promotion candidates');
    } finally {
      setLoading(false);
    }
  }, [campusId, sourceGradeId, section, search]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  useEffect(() => {
    if (sourceGradeId && sourceGradeId !== 'ALL' && grades.length) {
      const idx = grades.findIndex((g) => g._id === sourceGradeId);
      if (idx !== -1 && idx + 1 < grades.length) {
        setTargetGradeId(grades[idx + 1]._id);
      }
    }
  }, [sourceGradeId, grades]);

  const toggleStudent = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAll = () => setSelectedIds(candidates.map((s) => s._id));
  const clearSelection = () => setSelectedIds([]);
  const selectPassed = (customThreshold) => {
    const threshold = Number(customThreshold ?? passThreshold) || 33;
    setSelectedIds(candidates.filter((s) => {
      const score = s.calculated_exam_percentage ?? s.exam_percentage ?? 0;
      return score >= threshold;
    }).map((s) => s._id));
  };

  const updateStudentScore = (id, newScore) => {
    setCandidates((prev) => prev.map((s) => {
      if (s._id !== id) return s;
      const score = Math.max(0, Math.min(100, Number(newScore) || 0));
      return { ...s, calculated_exam_percentage: score, is_eligible_for_auto_promote: score >= passThreshold };
    }));
  };

  const executePromotion = async () => {
    try {
      setSubmitting(true);
      await api.post('/promotions/promote', {
        mode,
        source_grade_id: sourceGradeId !== 'ALL' ? sourceGradeId : null,
        target_grade_id: targetGradeId,
        target_section: targetSection,
        student_ids: selectedIds,
        pass_percentage: passThreshold
      });
      setSelectedIds([]);
      fetchCandidates();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Promotion failed');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    candidates, grades, campuses, recentPromotions, passThreshold, setPassThreshold, loading, submitting, error, setError,
    campusId, setCampusId, sourceGradeId, setSourceGradeId, section, setSection, search, setSearch,
    selectedIds, toggleStudent, selectAll, clearSelection, selectPassed, updateStudentScore,
    targetGradeId, setTargetGradeId, targetSection, setTargetSection, mode, setMode,
    executePromotion, fetchCandidates
  };
};
