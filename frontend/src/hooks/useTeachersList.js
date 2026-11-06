import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const DESIGNATIONS = [
  'PST', 'JEST', 'JST', 'HST', 'SST', 'HEADMASTER', 'INCHARGE HEADMASTER',
  'SECTION INCHARGE', 'AT', 'OT', 'DT', 'SLT', 'SS', 'NAIB QASID',
  'MALI', 'CHOWKIDAR', 'SWEEPER', 'PEON'
];

let memoryTeachers = null;
let memoryCampuses = null;
let memoryDesignations = null;

export const useTeachersList = () => {
  const [teachers, setTeachers] = useState(() => memoryTeachers || []);
  const [campuses, setCampuses] = useState(() => memoryCampuses || []);
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedDesignation, setSelectedDesignation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(() => !memoryTeachers);
  const [error, setError] = useState('');
  const [viewTeacher, setViewTeacher] = useState(null);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [designations, setDesignations] = useState(() => memoryDesignations || DESIGNATIONS);

  const fetchCampuses = async () => {
    try {
      const [cRes, rRes] = await Promise.allSettled([
        memoryCampuses ? Promise.resolve({ data: { campuses: memoryCampuses } }) : api.get('/campuses'),
        memoryDesignations ? Promise.resolve({ data: { roles: [] } }) : api.get('/user-management/roles')
      ]);
      if (cRes.status === 'fulfilled' && cRes.value.data?.campuses) {
        memoryCampuses = cRes.value.data.campuses;
        setCampuses(cRes.value.data.campuses);
      }
      if (rRes.status === 'fulfilled' && rRes.value.data?.roles?.length) {
        const names = rRes.value.data.roles.map((ro) => ro.name);
        const merged = Array.from(new Set([...DESIGNATIONS, ...names]));
        memoryDesignations = merged;
        setDesignations(merged);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeachers = useCallback(async () => {
    try {
      if (!memoryTeachers) setLoading(true);
      setError('');
      const params = {
        campus_id: selectedCampus,
        designation: selectedDesignation,
        search: searchQuery
      };
      const res = await api.get('/teachers', { params });
      const list = res.data.teachers || [];
      if (selectedCampus === 'all' && selectedDesignation === 'all' && !searchQuery) {
        memoryTeachers = list;
      }
      setTeachers(list);
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
    if (!searchQuery) {
      fetchTeachers();
      return;
    }
    const timer = setTimeout(() => {
      fetchTeachers();
    }, 150);
    return () => clearTimeout(timer);
  }, [fetchTeachers, searchQuery]);

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setTeachers((prev) => {
      const next = prev.map((t) => (t._id === id ? { ...t, status: nextStatus, is_active: nextStatus === 'Active' } : t));
      if (selectedCampus === 'all' && selectedDesignation === 'all' && !searchQuery) {
        memoryTeachers = next;
      }
      return next;
    });
    try {
      await api.patch(`/teachers/${id}/status`, { status: nextStatus });
    } catch (err) {
      setTeachers((prev) => {
        const rollback = prev.map((t) => (t._id === id ? { ...t, status: currentStatus, is_active: currentStatus === 'Active' } : t));
        if (selectedCampus === 'all' && selectedDesignation === 'all' && !searchQuery) {
          memoryTeachers = rollback;
        }
        return rollback;
      });
      setError(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete?._id) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/teachers/${teacherToDelete._id}`);
      setTeacherToDelete(null);
      setTeachers((prev) => {
        const next = prev.filter((t) => t._id !== teacherToDelete._id);
        if (selectedCampus === 'all' && selectedDesignation === 'all' && !searchQuery) {
          memoryTeachers = next;
        }
        return next;
      });
      await fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    teachers,
    campuses,
    loading,
    error,
    setError,
    designations,
    selectedCampus,
    setSelectedCampus,
    selectedDesignation,
    setSelectedDesignation,
    searchQuery,
    setSearchQuery,
    viewTeacher,
    setViewTeacher,
    teacherToDelete,
    setTeacherToDelete,
    deleteLoading,
    handleToggleStatus,
    handleDeleteConfirm,
    fetchTeachers
  };
};
