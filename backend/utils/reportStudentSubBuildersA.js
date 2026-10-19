const { calculateAge } = require('./reportHelpers');

const buildStrengthSummary = (students) => {
  const map = {};
  students.forEach((s) => {
    const key = `${s.current_grade?.name || 'Unassigned'}__${s.current_section || 'A'}`;
    if (!map[key]) {
      map[key] = {
        class_name: s.current_grade?.name || 'Unassigned',
        section: s.current_section || 'A',
        boys: 0, girls: 0, active: 0, inactive: 0, total: 0
      };
    }
    const isMale = (s.gender || 'Male').toLowerCase() === 'male';
    if (isMale) map[key].boys++; else map[key].girls++;
    const isActive = (s.status || 'Active').toLowerCase() === 'active';
    if (isActive) map[key].active++; else map[key].inactive++;
    map[key].total++;
  });

  const rows = Object.values(map).map((item, idx) => ({ sr: idx + 1, id: `strength-${idx + 1}`, ...item }));
  const columns = [
    { key: 'sr', label: '#', visible: true },
    { key: 'class_name', label: 'Class', visible: true },
    { key: 'section', label: 'Section', visible: true },
    { key: 'boys', label: 'Boys', visible: true },
    { key: 'girls', label: 'Girls', visible: true },
    { key: 'total', label: 'Total Strength', visible: true },
    { key: 'active', label: 'Active', visible: true },
    { key: 'inactive', label: 'Inactive / Left', visible: true }
  ];
  return { columns, rows };
};

const buildSiblingsReport = (students) => {
  const map = {};
  students.forEach((s) => {
    const key = (s.parents_cnic?.father_cnic || s.father_details?.mobile_no || s.father_name || '').trim().toLowerCase();
    if (key) {
      if (!map[key]) map[key] = [];
      map[key].push(s);
    }
  });

  const rows = [];
  let sr = 1;
  Object.keys(map).forEach((key) => {
    const group = map[key];
    group.forEach((s) => {
      rows.push({
        sr: sr++,
        id: s._id,
        family_group: s.father_name || '—',
        cnic_contact: s.parents_cnic?.father_cnic || s.father_details?.mobile_no || s.contact_number || '—',
        name: s.name || '',
        gr_number: s.gr_number || '',
        class_name: s.current_grade?.name || 'Unassigned',
        section: s.current_section || 'A',
        total_siblings: group.length,
        status: s.status || 'Active'
      });
    });
  });

  const columns = [
    { key: 'sr', label: '#', visible: true },
    { key: 'family_group', label: 'Parent / Family Head', visible: true },
    { key: 'cnic_contact', label: 'CNIC / Phone', visible: true },
    { key: 'gr_number', label: 'GR #', visible: true },
    { key: 'name', label: 'Student Name', visible: true },
    { key: 'class_name', label: 'Class', visible: true },
    { key: 'section', label: 'Section', visible: true },
    { key: 'total_siblings', label: 'Siblings', visible: true },
    { key: 'status', label: 'Status', visible: true }
  ];
  return { columns, rows };
};

const buildBirthdayList = (students) => {
  const sorted = [...students].sort((a, b) => {
    const da = a.dob ? new Date(a.dob).getMonth() * 100 + new Date(a.dob).getDate() : 9999;
    const db = b.dob ? new Date(b.dob).getMonth() * 100 + new Date(b.dob).getDate() : 9999;
    return da - db;
  });

  const rows = sorted.map((s, idx) => ({
    sr: idx + 1,
    id: s._id,
    gr_number: s.gr_number || '',
    name: s.name || '',
    father_name: s.father_name || '',
    class_name: s.current_grade?.name || 'Unassigned',
    section: s.current_section || 'A',
    dob: s.dob ? new Date(s.dob).toISOString().split('T')[0] : '—',
    age: calculateAge(s.dob),
    status: s.status || 'Active'
  }));

  const columns = [
    { key: 'sr', label: '#', visible: true },
    { key: 'gr_number', label: 'GR #', visible: true },
    { key: 'name', label: 'Student Name', visible: true },
    { key: 'father_name', label: 'Father Name', visible: true },
    { key: 'class_name', label: 'Class', visible: true },
    { key: 'section', label: 'Section', visible: true },
    { key: 'dob', label: 'Date of Birth', visible: true },
    { key: 'age', label: 'Age', visible: true },
    { key: 'status', label: 'Status', visible: true }
  ];
  return { columns, rows };
};

module.exports = { buildStrengthSummary, buildSiblingsReport, buildBirthdayList };
