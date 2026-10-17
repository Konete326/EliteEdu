export const encodeOfflineData = (data) => {
  try {
    const json = JSON.stringify(data);
    return encodeURIComponent(btoa(encodeURIComponent(json)));
  } catch (e) {
    return '';
  }
};

export const decodeOfflineData = (encoded) => {
  try {
    if (!encoded) return null;
    const json = decodeURIComponent(atob(decodeURIComponent(encoded)));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

export const packStaffOfflinePayload = (staff) => {
  if (!staff || typeof staff !== 'object') return '';
  return encodeOfflineData({
    id: staff._id,
    n: staff.name,
    f: staff.father_name || staff.spouse_name || '',
    d: staff.designation || 'Staff',
    b: staff.bps_grade || '',
    p: staff.personal_id || staff.employee_code || '',
    s: staff.semis_code || '',
    v: staff.vendor_no || '',
    bg: staff.blood_group || '',
    ca: staff.campus_id?.name || '',
    cn: staff.cnic ? staff.cnic.slice(-4) : '',
    st: staff.status || 'Active',
    ts: Date.now()
  });
};

export const packStudentOfflinePayload = (student) => {
  if (!student || typeof student !== 'object') return '';
  return encodeOfflineData({
    id: student._id,
    n: student.name,
    f: student.father_name || '',
    g: student.gr_number || '',
    cl: student.current_grade?.name || student.grade_name || '',
    sec: student.current_section || 'A',
    bg: student.blood_group || '',
    em: student.emergency_contact_number || student.contact_number || '',
    ca: student.campus_id?.name || '',
    st: student.status || 'Active',
    ts: Date.now()
  });
};
