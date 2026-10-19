import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useSubjectsManager = () => {
  const [subjects, setSubjects] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', subject: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchCampusesAndGrades = async () => {
    try {
      const [cRes, gRes] = await Promise.all([
        api.get('/campuses').catch(() => ({ data: { campuses: [] } })),
        api.get('/grades').catch(() => ({ data: { grades: [] } }))
      ]);
      setCampuses(cRes.data?.campuses || []);
      setGrades(gRes.data?.grades || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubjects = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page,
        limit: 10,
        campus_id: selectedCampus,
        search: searchQuery,
        class_name: selectedClass !== 'all' ? selectedClass : undefined
      };
      const res = await api.get('/subjects', { params });
      setSubjects(res.data.subjects || []);
      setTotalItems(res.data.total || 0);
      setTotalPages(res.data.pages || 1);
      setCurrentPage(res.data.page || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  }, [selectedCampus, selectedClass, searchQuery]);

  useEffect(() => { fetchCampusesAndGrades(); }, []);

  useEffect(() => {
    if (!searchQuery) {
      fetchSubjects(1);
      return;
    }
    const timer = setTimeout(() => { fetchSubjects(1); }, 150);
    return () => clearTimeout(timer);
  }, [fetchSubjects, searchQuery]);

  const handleToggle = async (id, field) => {
    const target = subjects.find((s) => s._id === id);
    if (!target) return;
    const previousValue = target[field];
    const optimisticValue = field === 'status' ? (previousValue === 'Active' ? 'Inactive' : 'Active') : !previousValue;
    setSubjects((prev) => prev.map((s) => (s._id === id ? { ...s, [field]: optimisticValue } : s)));
    try {
      setToggleLoadingId(id);
      await api.patch(`/subjects/${id}/toggle`, { field });
    } catch (err) {
      setSubjects((prev) => prev.map((s) => (s._id === id ? { ...s, [field]: previousValue } : s)));
      setError(err.response?.data?.message || 'Failed to toggle subject property');
    } finally {
      setToggleLoadingId(null);
    }
  };

  const handleAutoLoad = async () => {
    try {
      setIsSeeding(true);
      setError('');
      await api.post('/subjects/seed-defaults', { campus_id: selectedCampus !== 'all' ? selectedCampus : null });
      await fetchSubjects(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to auto-seed standard subjects');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      if (modalState.mode === 'edit' && modalState.subject?._id) {
        await api.put(`/subjects/${modalState.subject._id}`, formData);
      } else {
        await api.post('/subjects', formData);
      }
      setModalState({ isOpen: false, mode: 'add', subject: null });
      await fetchSubjects(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!subjectToDelete?._id) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/subjects/${subjectToDelete._id}`);
      setSubjectToDelete(null);
      await fetchSubjects(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete subject');
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    subjects, campuses, grades, selectedCampus, setSelectedCampus,
    selectedClass, setSelectedClass,
    searchQuery, setSearchQuery, loading, error, setError,
    currentPage, totalPages, totalItems, modalState, setModalState,
    isSubmitting, subjectToDelete, setSubjectToDelete,
    deleteLoading, toggleLoadingId, isSeeding,
    handleToggle, handleAutoLoad, handleFormSubmit,
    handleDeleteConfirm, fetchSubjects, setCurrentPage
  };
};
