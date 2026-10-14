import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const DESIGNATIONS = [
  'PST', 'JEST', 'JST', 'HST', 'SST', 'HEADMASTER', 'INCHARGE HEADMASTER',
  'SECTION INCHARGE', 'AT', 'OT', 'DT', 'SLT', 'SS', 'NAIB QASID',
  'MALI', 'CHOWKIDAR', 'SWEEPER', 'PEON'
];

export const useTeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedDesignation, setSelectedDesignation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewTeacher, setViewTeacher] = useState(null);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCampuses = async () => {
    try {
      const res = await api.get('/campuses');
      setCampuses(res.data.campuses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        campus_id: selectedCampus,
        designation: selectedDesignation,
        search: searchQuery
      };
      const res = await api.get('/teachers', { params });
      setTeachers(res.data.teachers || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  }, [selectedCampus, selectedDesignation, searchQuery]);

  useEffect(() => {
    fetchCampuses();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTeachers();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchTeachers]);

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setTeachers((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: nextStatus, is_active: nextStatus === 'Active' } : t))
    );
    try {
      await api.patch(`/teachers/${id}/status`, { status: nextStatus });
    } catch (err) {
      setTeachers((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: currentStatus, is_active: currentStatus === 'Active' } : t))
      );
      setError(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete?._id) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/teachers/${teacherToDelete._id}`);
      setTeacherToDelete(null);
      await fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    teachers, campuses, loading, error, setError,
    selectedCampus, setSelectedCampus,
    selectedDesignation, setSelectedDesignation,
    searchQuery, setSearchQuery,
    viewTeacher, setViewTeacher,
    teacherToDelete, setTeacherToDelete,
    deleteLoading, handleToggleStatus, handleDeleteConfirm
  };
};
