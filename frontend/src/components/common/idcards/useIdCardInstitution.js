import { useState, useEffect } from 'react';
import api from '../../../services/api';

let cachedSchool = null;
const campusCache = new Map();

const getInitialSchool = () => {
  if (cachedSchool) return cachedSchool;
  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u) {
        return {
          name: u.school_name || '',
          logo_url: u.school_logo || '',
          slogan: u.school_slogan || '',
          campus_id: u.campus_id || ''
        };
      }
    }
  } catch {}
  return null;
};

const fetchSchoolOnce = async () => {
  if (cachedSchool) return cachedSchool;
  try {
    const res = await api.get('/schools/general-settings');
    if (res.data?.school) {
      cachedSchool = res.data.school;
      return cachedSchool;
    }
  } catch {}
  cachedSchool = getInitialSchool() || {};
  return cachedSchool;
};

const fetchCampusOnce = async (id) => {
  if (!id) return null;
  if (campusCache.has(id)) return campusCache.get(id);
  try {
    const res = await api.get('/campuses/' + id);
    const data = res.data?.campus || res.data || null;
    campusCache.set(id, data);
    return data;
  } catch {
    return null;
  }
};

const useIdCardInstitution = (campusIdProp) => {
  const [school, setSchool] = useState(getInitialSchool);
  const [campus, setCampus] = useState(() => (campusIdProp ? campusCache.get(campusIdProp) || null : null));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchSchoolOnce().then((s) => {
      if (!mounted) return;
      setSchool(s);
      const targetCampusId = campusIdProp || s?.campus_id || s?.default_campus_id;
      if (targetCampusId) {
        fetchCampusOnce(targetCampusId).then((c) => {
          if (mounted) setCampus(c);
        });
      }
    });
    return () => { mounted = false; };
  }, [campusIdProp]);

  const institutionName = school?.name || school?.school_name || '';
  const semisCode = school?.semis_code || school?.emis_code || '';
  const urduMotto = school?.urdu_motto || school?.motto_urdu || '';
  const logoUrl = school?.logo_url || school?.logo || '';
  const areaName = campus?.area || campus?.name || school?.area || '';

  return { school, campus, loading, institutionName, semisCode, urduMotto, logoUrl, areaName };
};

export default useIdCardInstitution;
