import { useState, useEffect } from 'react';
import api from '../../../services/api';

let cachedSchool = null;
let cachedSignatures = null;
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

const fetchSignaturesOnce = async () => {
  if (cachedSignatures) return cachedSignatures;
  try {
    const res = await api.get('/signatures');
    const items = res.data?.data || [];
    const defaultSig = items.find((s) => !s.is_stamp && s.is_default)?.image_url || '';
    const defaultStamp = items.find((s) => s.is_stamp && s.is_default)?.image_url || '';
    cachedSignatures = { defaultSig, defaultStamp };
    return cachedSignatures;
  } catch {
    return { defaultSig: '', defaultStamp: '' };
  }
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
  const [signatures, setSignatures] = useState(() => cachedSignatures || { defaultSig: '', defaultStamp: '' });
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
    fetchSignaturesOnce().then((sigs) => {
      if (mounted && sigs) setSignatures(sigs);
    });
    return () => { mounted = false; };
  }, [campusIdProp]);

  const institutionName = school?.name || school?.school_name || campus?.name || 'ELITE EDUCATION SYSTEM';
  const campusName = campus?.name || 'Main Campus';
  const slogan = school?.slogan || 'Excellence in Education';
  const semisCode = campus?.semis_code || school?.semis_code || school?.emis_code || '';
  const urduMotto = school?.urdu_motto || school?.motto_urdu || '';
  const logoUrl = school?.logo_url || school?.logo || campus?.logo || '/logo.png';
  const areaName = campus?.area || campus?.address || school?.address || '';
  const schoolPhone = campus?.contact_number || campus?.phone || school?.contact_number || '';
  const schoolEmail = campus?.email || school?.email || '';
  const schoolWebsite = school?.website || '';
  const principalName = school?.principal_name || 'Principal';
  const principalSignatureUrl = signatures.defaultSig || school?.principal_signature_url || '';
  const stampUrl = signatures.defaultStamp || school?.stamp_url || '';
  const activeColor = school?.theme_settings?.activeColor || '#0d9488';

  return {
    school,
    campus,
    loading,
    institutionName,
    campusName,
    slogan,
    semisCode,
    urduMotto,
    logoUrl,
    areaName,
    schoolPhone,
    schoolEmail,
    schoolWebsite,
    principalName,
    principalSignatureUrl,
    stampUrl,
    activeColor
  };
};

export default useIdCardInstitution;
