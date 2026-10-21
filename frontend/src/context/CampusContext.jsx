import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
    if (user?.last_active_campus) {
      const id = String(user.last_active_campus._id || user.last_active_campus);
      const stored = localStorage.getItem('elite_active_campus_id');
      if (!stored) {
        setActiveCampusIdState(id);
        localStorage.setItem('elite_active_campus_id', id);
      }
    }
  }, [user]);

  const setActiveCampusId = (id) => {
    const val = id || 'all';
    setActiveCampusIdState(val);
    localStorage.setItem('elite_active_campus_id', val);
    if (user) {
      api.patch('/auth/active-campus', { campus_id: val }).catch(() => {});
    }
  };

  const requestCampusSwitch = (targetId, targetName) => {
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
  };

  const confirmCampusSwitch = () => {
    if (!pendingSwitch) return '';
    setActiveCampusId(pendingSwitch.id);
    const switchedName = pendingSwitch.name;
    setPendingSwitch(null);
    return switchedName;
  };

  const cancelCampusSwitch = () => {
    setPendingSwitch(null);
  };

  const activeCampus = activeCampusId === 'all'
    ? null
    : campuses.find((c) => String(c._id) === String(activeCampusId)) || null;

  return (
    <CampusContext.Provider
      value={{
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
      }}
    >
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
