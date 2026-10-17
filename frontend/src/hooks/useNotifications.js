import { useState, useEffect, useCallback } from 'react';
import { getApiBase } from '../utils/apiBase';
import { useToast } from '../context/ToastContext';

export const useNotifications = (token, isAdmin) => {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadNotifications = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: '15',
        type: category,
        search,
        unread_only: String(unreadOnly)
      });
      const res = await fetch(`${getApiBase()}/notifications?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setTotal(data.total || 0);
        setUnreadCount(data.unreadCount || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, [token, page, category, search, unreadOnly]);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  useEffect(() => {
    if (!token || !isAdmin) return;
    fetch(`${getApiBase()}/campuses`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => d.campuses && setCampuses(d.campuses))
      .catch(() => {});
  }, [token, isAdmin]);

  const toggleRead = async (id, shouldRead) => {
    try {
      await fetch(`${getApiBase()}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, is_read: shouldRead } : n)));
      setUnreadCount((c) => Math.max(0, shouldRead ? c - 1 : c + 1));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await fetch(`${getApiBase()}/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('All notifications marked as read');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${getApiBase()}/notifications/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Notification deleted');
        setNotifications((prev) => prev.filter((n) => n._id !== deleteTarget._id));
        setTotal((t) => Math.max(0, t - 1));
      }
    } finally {
      setDeleteTarget(null);
    }
  };

  return {
    notifications, campuses, total, unreadCount, page, totalPages, loading,
    search, setSearch, category, setCategory, unreadOnly, setUnreadOnly,
    deleteTarget, setDeleteTarget, setPage, loadNotifications, toggleRead,
    markAllRead, confirmDelete
  };
};
