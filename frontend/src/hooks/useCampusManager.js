import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';

export const useCampusManager = () => {
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', campus: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campusToDelete, setCampusToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCampuses = async () => {
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
  };

  useEffect(() => {
    fetchCampuses();
  }, []);

  const filteredCampuses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return campuses;
    return campuses.filter((c) => {
      const name = c.name?.toLowerCase() || '';
      const email = c.email?.toLowerCase() || '';
      const website = c.website?.toLowerCase() || '';
      const address = c.address?.toLowerCase() || '';
      const phone = c.contact_number?.toLowerCase() || '';
      return name.includes(query) || email.includes(query) || website.includes(query) || address.includes(query) || phone.includes(query);
    });
  }, [campuses, searchQuery]);

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      if (modalState.mode === 'edit' && modalState.campus?._id) {
        const res = await api.put(`/campuses/${modalState.campus._id}`, formData);
        setCampuses((prev) => prev.map((c) => (c._id === modalState.campus._id ? res.data.campus : c)));
      } else {
        const res = await api.post('/campuses', formData);
        setCampuses((prev) => [res.data.campus, ...prev]);
      }
      setModalState({ isOpen: false, mode: 'add', campus: null });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save campus');
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
      setCampusToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete campus');
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    campuses, loading, error, setError, searchQuery, setSearchQuery,
    filteredCampuses, modalState, setModalState, isSubmitting,
    campusToDelete, setCampusToDelete, deleteLoading,
    handleFormSubmit, handleDeleteConfirm
  };
};
