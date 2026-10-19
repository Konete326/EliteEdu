const buildIdCardsStatus = (students) => {
  const rows = students.map((s, idx) => ({
    sr: idx + 1, id: s._id, gr_number: s.gr_number || '', name: s.name || '',
    class_name: s.current_grade?.name || 'Unassigned', section: s.current_section || 'A',
    photo_status: s.photo_url ? 'Attached' : 'Missing Photo', b_form: s.b_form || '—',
    status: s.status || 'Active', id_card_link: `/admin/students/id-cards?studentId=${s._id}`
  }));
  const columns = [
    { key: 'sr', label: '#', visible: true }, { key: 'gr_number', label: 'GR #', visible: true },
    { key: 'name', label: 'Student Name', visible: true }, { key: 'class_name', label: 'Class', visible: true },
    { key: 'section', label: 'Section', visible: true }, { key: 'photo_status', label: 'Photo Status', visible: true },
    { key: 'b_form', label: 'B-Form / CNIC', visible: true }, { key: 'status', label: 'Enrollment', visible: true }
  ];
  return { columns, rows };
};

const buildFeeStatusSummary = (students) => {
  const map = {};
  students.forEach((s) => {
    const key = s.current_grade?.name || 'Unassigned';
    if (!map[key]) map[key] = { class_name: key, total_students: 0, total_fee: 0, total_concession: 0 };
    map[key].total_students++;
    map[key].total_fee += Number(s.monthly_fee) || 0;
    map[key].total_concession += Number(s.discount) || 0;
  });
  const rows = Object.values(map).map((item, idx) => ({
    sr: idx + 1, id: `fee-summary-${idx + 1}`, ...item,
    net_receivable: Math.max(0, item.total_fee - item.total_concession)
  }));
  const columns = [
    { key: 'sr', label: '#', visible: true }, { key: 'class_name', label: 'Class', visible: true },
    { key: 'total_students', label: 'Students', visible: true }, { key: 'total_fee', label: 'Gross Fee', visible: true },
    { key: 'total_concession', label: 'Concessions', visible: true }, { key: 'net_receivable', label: 'Net Expected Fee', visible: true }
  ];
  return { columns, rows };
};

const buildFeeStudentWise = (students) => {
  const rows = students.map((s, idx) => {
    const fee = Number(s.monthly_fee) || 0;
    const disc = Number(s.discount) || 0;
    return {
      sr: idx + 1, id: s._id, gr_number: s.gr_number || '', name: s.name || '',
      class_name: s.current_grade?.name || 'Unassigned', monthly_fee: fee, discount: disc,
      net_fee: Math.max(0, fee - disc), status: s.status || 'Active'
    };
  });
  const columns = [
    { key: 'sr', label: '#', visible: true }, { key: 'gr_number', label: 'GR #', visible: true },
    { key: 'name', label: 'Student Name', visible: true }, { key: 'class_name', label: 'Class', visible: true },
    { key: 'monthly_fee', label: 'Monthly Fee', visible: true }, { key: 'discount', label: 'Discount', visible: true },
    { key: 'net_fee', label: 'Net Monthly Fee', visible: true }, { key: 'status', label: 'Status', visible: true }
  ];
  return { columns, rows };
};

const buildProfileSheet = (students) => {
  const rows = students.map((s, idx) => ({
    sr: idx + 1, id: s._id, gr_number: s.gr_number || '', name: s.name || '',
    father_name: s.father_name || '', father_cnic: s.parents_cnic?.father_cnic || s.father_details?.national_id || '—',
    contact: s.father_details?.mobile_no || s.contact_number || '—', class_name: s.current_grade?.name || 'Unassigned',
    blood_group: s.blood_group || '—', religion: s.religion || 'Islam',
    address: s.address?.street_address || s.address?.city || '—', status: s.status || 'Active'
  }));
  const columns = [
    { key: 'sr', label: '#', visible: true }, { key: 'gr_number', label: 'GR #', visible: true },
    { key: 'name', label: 'Student Name', visible: true }, { key: 'father_name', label: 'Father Name', visible: true },
    { key: 'father_cnic', label: 'Father CNIC', visible: true }, { key: 'contact', label: 'Contact', visible: true },
    { key: 'class_name', label: 'Class', visible: true }, { key: 'blood_group', label: 'Blood Grp', visible: true },
    { key: 'religion', label: 'Religion', visible: true }, { key: 'status', label: 'Status', visible: true }
  ];
  return { columns, rows };
};

module.exports = { buildIdCardsStatus, buildFeeStatusSummary, buildFeeStudentWise, buildProfileSheet };
