import { decodeOfflineData } from './idCardOfflinePayload';

export const resolveOfflineStaffRecord = (id) => {
  try {
    const params = new URLSearchParams(window.location.search);
    const offlineParam = params.get('offline');
    if (offlineParam) {
      const p = decodeOfflineData(offlineParam);
      if (p && (!id || p.id === id)) {
        return {
          _id: p.id,
          name: p.n,
          father_name: p.f,
          designation: p.d,
          bps_grade: p.b,
          personal_id: p.p,
          semis_code: p.s,
          vendor_no: p.v,
          blood_group: p.bg,
          status: p.st || 'Active',
          institution: {
            school_name: 'Education Department, Govt of Sindh',
            campus_name: p.ca || 'Sindh School Campus'
          },
          isOffline: true
        };
      }
    }
    const local = localStorage.getItem(`eliteedu_staff_${id}`);
    if (local) {
      const parsed = JSON.parse(local);
      return { ...parsed, isOffline: true };
    }
  } catch (e) {
    return null;
  }
  return null;
};

export const resolveOfflineStudentRecord = (id) => {
  try {
    const params = new URLSearchParams(window.location.search);
    const offlineParam = params.get('offline');
    if (offlineParam) {
      const p = decodeOfflineData(offlineParam);
      if (p && (!id || p.id === id)) {
        return {
          _id: p.id,
          name: p.n,
          father_name: p.f,
          gr_number: p.g,
          current_grade: p.cl,
          current_section: p.sec,
          status: p.st || 'Active',
          emergency: {
            blood_group: p.bg,
            emergency_contact_number: p.em
          },
          institution: {
            school_name: 'Elite Edu Higher Secondary School',
            campus_name: p.ca || 'Main Campus'
          },
          isOffline: true
        };
      }
    }
    const local = localStorage.getItem(`eliteedu_student_${id}`);
    if (local) {
      const parsed = JSON.parse(local);
      return { ...parsed, isOffline: true };
    }
  } catch (e) {
    return null;
  }
  return null;
};
