import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';
import { useCampus } from '../context/CampusContext';
import { useToast } from '../context/ToastContext';

export const useCampusManager = () => {
  const { refreshCampuses, activeCampusId, setActiveCampusId, activeCampus, requestCampusSwitch } = useCampus();
  const { showToast } = useToast();
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', campus: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campusToDelete, setCampusToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCampuses = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/campuses');
      setCampuses(res.data.campuses || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load campuses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampuses();
  }, [fetchCampuses]);

  const kpis = useMemo(() => {
    const total = campuses.length;
    const active = campuses.filter((c) => c.status === 'Active').length;
    const inactive = total - active;
    const totalStudents = campuses.reduce((sum, c) => sum + (c.students_count || 0), 0);
    const totalTeachers = campuses.reduce((sum, c) => sum + (c.teachers_count || 0), 0);
    return { total, active, inactive, totalStudents, totalTeachers };
  }, [campuses]);

  const filteredCampuses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return campuses.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (!query) return true;
      const name = c.name?.toLowerCase() || '';
      const email = c.email?.toLowerCase() || '';
      const website = c.website?.toLowerCase() || '';
      const address = c.address?.toLowerCase() || '';
      const phone = c.contact_number?.toLowerCase() || '';
      return name.includes(query) || email.includes(query) || website.includes(query) || address.includes(query) || phone.includes(query);
    });
  }, [campuses, searchQuery, statusFilter]);

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      if (modalState.mode === 'edit' && modalState.campus?._id) {
        const res = await api.put(`/campuses/${modalState.campus._id}`, formData);
        setCampuses((prev) => prev.map((c) => (c._id === modalState.campus._id ? res.data.campus : c)));
        showToast('Campus details updated successfully', 'success');
      } else {
        const res = await api.post('/campuses', formData);
        setCampuses((prev) => [res.data.campus, ...prev]);
        showToast('New campus registered successfully', 'success');
      }
      refreshCampuses?.();
      setModalState({ isOpen: false, mode: 'add', campus: null });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save campus';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!campusToDelete?._id) return;
    try {
      setDeleteLoading(true);
      setError('');
      await api.delete(`/campuses/${campusToDelete._id}`);
      setCampuses((prev) => prev.filter((c) => c._id !== campusToDelete._id));
      if (activeCampusId === campusToDelete._id) {
        setActiveCampusId('all');
      }
      refreshCampuses?.();
      showToast('Campus removed successfully', 'success');
      setCampusToDelete(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete campus';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleQuickSwitch = (campus) => {
    if (!campus?._id) return;
    requestCampusSwitch(campus._id, campus.name);
  };

  return {
    campuses, loading, error, setError, searchQuery, setSearchQuery,
    statusFilter, setStatusFilter, filteredCampuses, kpis, modalState, setModalState,
    isSubmitting, campusToDelete, setCampusToDelete, deleteLoading,
    handleFormSubmit, handleDeleteConfirm, handleQuickSwitch,
    reload: fetchCampuses, activeCampusId, activeCampus, setActiveCampusId
  };
};
