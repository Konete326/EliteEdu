import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useCampus } from '../context/CampusContext';
import { useToast } from '../context/ToastContext';

export const useSubjectsManager = () => {
  const { activeCampusId } = useCampus();
  const { showToast } = useToast();

  const [subjects, setSubjects] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState(activeCampusId !== 'all' ? activeCampusId : 'all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStream, setSelectedStream] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', subject: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [inUseConflict, setInUseConflict] = useState(null);

  useEffect(() => {
    if (activeCampusId && activeCampusId !== 'all') {
      setSelectedCampus(activeCampusId);
    }
  }, [activeCampusId]);

  const fetchAuxiliaryData = async () => {
    try {
      const [cRes, gRes, tRes] = await Promise.all([
        api.get('/campuses').catch(() => ({ data: { campuses: [] } })),
        api.get('/grades').catch(() => ({ data: { grades: [] } })),
        api.get('/teachers').catch(() => ({ data: { teachers: [] } }))
      ]);
      setCampuses(cRes.data?.campuses || []);
      setGrades(gRes.data?.grades || []);
      setTeachers(tRes.data?.teachers || []);
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
        limit: pageSize,
        campus_id: selectedCampus,
        search: searchQuery,
        class_name: selectedClass !== 'all' ? selectedClass : undefined,
        stream: selectedStream !== 'all' ? selectedStream : undefined
      };
      const res = await api.get('/subjects', { params });
      setSubjects(res.data?.subjects || []);
      setTotalItems(res.data?.total || 0);
      setTotalPages(res.data?.pages || 1);
      setCurrentPage(res.data?.page || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  }, [selectedCampus, selectedClass, selectedStream, searchQuery, pageSize]);

  useEffect(() => {
    fetchAuxiliaryData();
  }, []);

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
      const res = await api.patch(`/subjects/${id}/toggle`, { field });
      showToast(`${target.name} ${field === 'mandatory' ? 'type' : 'status'} updated`, 'success');
      if (res.data?.subject) {
        setSubjects((prev) => prev.map((s) => (s._id === id ? { ...s, ...res.data.subject } : s)));
      }
    } catch (err) {
      setSubjects((prev) => prev.map((s) => (s._id === id ? { ...s, [field]: previousValue } : s)));
      showToast(err.response?.data?.message || 'Failed to toggle subject property', 'error');
    } finally {
      setToggleLoadingId(null);
    }
  };

  const handleAutoLoad = async () => {
    try {
      setIsSeeding(true);
      setError('');
      const res = await api.post('/subjects/seed-defaults', { campus_id: selectedCampus !== 'all' ? selectedCampus : null });
      showToast(res.data?.message || 'Standard curriculum loaded successfully', 'success');
      await fetchSubjects(1);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to auto-seed standard subjects', 'error');
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
        showToast(`Subject "${formData.name}" updated successfully`, 'success');
      } else {
        await api.post('/subjects', formData);
        showToast(`Subject "${formData.name}" created successfully`, 'success');
      }
      setModalState({ isOpen: false, mode: 'add', subject: null });
      await fetchSubjects(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save subject');
      showToast(err.response?.data?.message || 'Failed to save subject', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!subjectToDelete?._id) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/subjects/${subjectToDelete._id}`);
      showToast(`Subject "${subjectToDelete.name}" deleted successfully`, 'success');
      setSubjectToDelete(null);
      await fetchSubjects(currentPage);
    } catch (err) {
      if (err.response?.status === 409 && err.response?.data?.linked_items) {
        setInUseConflict({
          subject: subjectToDelete,
          linked_items: err.response.data.linked_items,
          message: err.response.data.message
        });
        setSubjectToDelete(null);
      } else {
        showToast(err.response?.data?.message || 'Failed to delete subject', 'error');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleInactivateFromConflict = async () => {
    if (!inUseConflict?.subject?._id) return;
    try {
      setIsSubmitting(true);
      await api.patch(`/subjects/${inUseConflict.subject._id}/toggle`, { field: 'status', value: 'Inactive' });
      showToast(`Subject "${inUseConflict.subject.name}" set to Inactive. Historical records are safe.`, 'success');
      setInUseConflict(null);
      await fetchSubjects(currentPage);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update subject status', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    subjects, campuses, grades, teachers, selectedCampus, setSelectedCampus,
    selectedClass, setSelectedClass, selectedStream, setSelectedStream,
    searchQuery, setSearchQuery, loading, error, setError,
    currentPage, totalPages, totalItems, pageSize, setPageSize, modalState, setModalState,
    isSubmitting, subjectToDelete, setSubjectToDelete,
    deleteLoading, toggleLoadingId, isSeeding, inUseConflict, setInUseConflict,
    handleToggle, handleAutoLoad, handleFormSubmit,
    handleDeleteConfirm, handleInactivateFromConflict, fetchSubjects, setCurrentPage
  };
};

export default useSubjectsManager;
