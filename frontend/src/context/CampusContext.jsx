import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CampusContext = createContext(null);

export const CampusProvider = ({ children }) => {
  const { user } = useAuth();
  const [campuses, setCampuses] = useState([]);
  const [activeCampusId, setActiveCampusIdState] = useState(() => {
    return localStorage.getItem('elite_active_campus_id') || 'all';
  });
  const [loading, setLoading] = useState(false);
  const [pendingSwitch, setPendingSwitch] = useState(null);

  const fetchCampuses = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/campuses');
      const list = res.data?.campuses || res.data || [];
      setCampuses(Array.isArray(list) ? list : []);
    } catch {
      setCampuses([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCampuses();
  }, [fetchCampuses]);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'Teacher') {
      const assignedId = String(user.campus_id?._id || user.campus_id || user.last_active_campus?._id || user.last_active_campus || '');
      if (assignedId && assignedId !== activeCampusId) {
        setActiveCampusIdState(assignedId);
        localStorage.setItem('elite_active_campus_id', assignedId);
      }
    } else if (user.last_active_campus) {
      const id = String(user.last_active_campus._id || user.last_active_campus);
      const stored = localStorage.getItem('elite_active_campus_id');
      if (!stored) {
        setActiveCampusIdState(id);
        localStorage.setItem('elite_active_campus_id', id);
      }
    }
  }, [user, activeCampusId]);

  const setActiveCampusId = useCallback((id) => {
    if (user?.role === 'Teacher') return;
    const val = id || 'all';
    setActiveCampusIdState(val);
    localStorage.setItem('elite_active_campus_id', val);
    if (user) {
      api.patch('/auth/active-campus', { campus_id: val }).catch(() => {});
    }
  }, [user]);

  const requestCampusSwitch = useCallback((targetId, targetName) => {
    if (user?.role === 'Teacher') return;
    const id = targetId || 'all';
    let name = targetName;
    if (!name) {
      if (id === 'all') name = 'All Campuses';
      else {
        const found = campuses.find((c) => String(c._id) === String(id));
        name = found?.name || 'Selected Campus';
      }
    }
    setPendingSwitch({ id, name });
  }, [campuses, user?.role]);

  const confirmCampusSwitch = useCallback(() => {
    if (user?.role === 'Teacher') return '';
    if (!pendingSwitch) return '';
    setActiveCampusId(pendingSwitch.id);
    const switchedName = pendingSwitch.name;
    setPendingSwitch(null);
    return switchedName;
  }, [pendingSwitch, setActiveCampusId, user?.role]);

  const cancelCampusSwitch = useCallback(() => {
    setPendingSwitch(null);
  }, []);

  const activeCampus = useMemo(() => {
    if (activeCampusId === 'all') return null;
    return campuses.find((c) => String(c._id) === String(activeCampusId)) || null;
  }, [activeCampusId, campuses]);

  const value = useMemo(
    () => ({
      campuses,
      activeCampusId,
      setActiveCampusId,
      activeCampus,
      refreshCampuses: fetchCampuses,
      loading,
      pendingSwitch,
      requestCampusSwitch,
      confirmCampusSwitch,
      cancelCampusSwitch
    }),
    [
      campuses,
      activeCampusId,
      setActiveCampusId,
      activeCampus,
      fetchCampuses,
      loading,
      pendingSwitch,
      requestCampusSwitch,
      confirmCampusSwitch,
      cancelCampusSwitch
    ]
  );

  return (
    <CampusContext.Provider value={value}>
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = () => {
  const ctx = useContext(CampusContext);
  if (!ctx) {
    return {
      campuses: [],
      activeCampusId: 'all',
      setActiveCampusId: () => {},
      activeCampus: null,
      refreshCampuses: () => {},
      loading: false,
      pendingSwitch: null,
      requestCampusSwitch: () => {},
      confirmCampusSwitch: () => '',
      cancelCampusSwitch: () => {}
    };
  }
  return ctx;
};

export default CampusContext;
