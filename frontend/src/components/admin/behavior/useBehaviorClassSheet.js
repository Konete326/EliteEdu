import { useState, useCallback, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import api from '../../../services/api';

export const useBehaviorClassSheet = (selectedGrade, selectedSection, term, session, selectedCampus) => {
  const { showToast } = useToast();
  const [students, setStudents] = useState([]);
  const [evaluations, setEvaluations] = useState({});
  const [kpis, setKpis] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadSheet = useCallback(async () => {
    if (!selectedGrade) return;
    setLoading(true);
    try {
      let q = `?grade_id=${selectedGrade}&section=${selectedSection}&term=${encodeURIComponent(term)}&academic_session=${session}`;
      if (selectedCampus) q += `&campus_id=${selectedCampus}`;
      const res = await api.get(`/behavior/class-sheet${q}`);
      const sheet = res.data?.students || [];
      setStudents(sheet);
      setKpis(res.data?.kpis || {});
      const evMap = {};
      sheet.forEach(({ student, behaviorRecord }) => {
        evMap[student._id] = {
          student_id: student._id,
          affective_ratings: { ...behaviorRecord.affective_ratings },
          psychomotor_ratings: { ...behaviorRecord.psychomotor_ratings },
          general_conduct: behaviorRecord.general_conduct || 'Good',
          teacher_observation: behaviorRecord.teacher_observation || ''
        };
      });
      setEvaluations(evMap);
    } catch {
      showToast('Failed to load class behavior sheet', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedGrade, selectedSection, term, session, selectedCampus]);

  useEffect(() => { loadSheet(); }, [loadSheet]);

  const handleRatingChange = (id, domain, key, val) => {
    setEvaluations((prev) => ({
      ...prev,
      [id]: { ...prev[id], [`${domain}_ratings`]: { ...(prev[id]?.[`${domain}_ratings`] || {}), [key]: val } }
    }));
  };

  const handleConductChange = (id, conduct) => {
    setEvaluations((prev) => ({ ...prev, [id]: { ...prev[id], general_conduct: conduct } }));
  };

  const handleObservationChange = (id, obs) => {
    setEvaluations((prev) => ({ ...prev, [id]: { ...prev[id], teacher_observation: obs } }));
  };

  const handleQuickRateStudent = (id, score, conduct = 'Good') => {
    setEvaluations((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        general_conduct: conduct,
        affective_ratings: { punctuality: score, discipline: score, neatness: score, obedience: score, teamwork: score },
        psychomotor_ratings: { handwriting: score, communication: score, sports: score, creativity: score, computer_skills: score }
      }
    }));
  };

  const handleSetAll = (score, conduct) => {
    setEvaluations((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        next[id] = {
          ...next[id], general_conduct: conduct,
          affective_ratings: { punctuality: score, discipline: score, neatness: score, obedience: score, teamwork: score },
          psychomotor_ratings: { handwriting: score, communication: score, sports: score, creativity: score, computer_skills: score }
        };
      });
      return next;
    });
    showToast(`Batch applied ${score}/5 rating and ${conduct} conduct`, 'info');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        grade_id: selectedGrade, section: selectedSection, term_name: term,
        academic_session: session, campus_id: selectedCampus,
        evaluations: Object.values(evaluations)
      };
      await api.post('/behavior/bulk-save', payload);
      showToast('Class behavior sheet saved and synced to student report cards', 'success');
      loadSheet();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save behavior sheet', 'error');
    } finally {
      setSaving(false);
    }
  };

  return {
    students, evaluations, kpis, loading, saving,
    handleRatingChange, handleConductChange, handleObservationChange, handleQuickRateStudent, handleSetAll, handleSave
  };
};
