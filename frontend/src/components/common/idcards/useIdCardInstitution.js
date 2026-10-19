import { useState, useEffect } from 'react';
import api from '../../../services/api';

const useIdCardInstitution = (campusIdProp) => {
  const [school, setSchool] = useState(null);
  const [campus, setCampus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchSchool = async () => {
      let schoolData = null;
      try {
        const res = await api.get('/schools/active');
        schoolData = res.data?.school || res.data || null;
      } catch {
        try {
          const res2 = await api.get('/schools');
          const list = res2.data?.schools || res2.data || [];
          schoolData = Array.isArray(list) ? list[0] : list;
        } catch {
          schoolData = null;
        }
      }
      if (!mounted) return;
      setSchool(schoolData);

      const campusId = campusIdProp || schoolData?.campus_id || schoolData?.default_campus_id;
      if (campusId) {
        try {
          const cRes = await api.get('/campuses/' + campusId);
          if (mounted) setCampus(cRes.data?.campus || cRes.data || null);
        } catch {
          if (mounted) setCampus(null);
        }
      }
      if (mounted) setLoading(false);
    };
    fetchSchool();
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
