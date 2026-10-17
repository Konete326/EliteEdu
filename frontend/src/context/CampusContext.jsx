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

  const setActiveCampusId = (id) => {
    const val = id || 'all';
    setActiveCampusIdState(val);
    localStorage.setItem('elite_active_campus_id', val);
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
        loading
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
      loading: false
    };
  }
  return ctx;
};

export default CampusContext;
