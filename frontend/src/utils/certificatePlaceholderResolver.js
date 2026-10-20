const formatDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return String(d);
  }
};

export const resolvePlaceholders = (templateStr = '', entity = {}, recipientType = 'Student', customText = '', schoolName = '') => {
  if (!templateStr) return '';
  const isStudent = recipientType === 'Student';
  const map = {
    '{{name}}': (entity.name || 'Recipient').toUpperCase(),
    '{{father_name}}': entity.father_name || '—',
    '{{gr_number}}': entity.gr_number || '—',
    '{{class_name}}': isStudent ? (entity.current_grade?.name || entity.grade_name || 'Class') : '',
    '{{section}}': isStudent ? (entity.current_section || 'A') : '',
    '{{dob}}': formatDate(entity.dob),
    '{{admission_date}}': formatDate(entity.admission_date),
    '{{custom_text}}': customText || 'outstanding performance',
    '{{designation}}': !isStudent ? (entity.designation || 'Staff') : '',
    '{{bps_grade}}': !isStudent ? (entity.bps_grade ? `BPS-${entity.bps_grade}` : '') : '',
    '{{employee_code}}': !isStudent ? (entity.employee_code || entity.personal_id || '—') : '',
    '{{date}}': formatDate(new Date()),
    '{{school_name}}': schoolName || 'Our Institution'
  };

  let resolved = templateStr;
  Object.entries(map).forEach(([token, val]) => {
    resolved = resolved.split(token).join(val);
  });
  return resolved;
};
