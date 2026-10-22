import { rgb } from 'pdf-lib';

const parseColor = (hex, def = { r: 0, g: 0.23, b: 0.45 }) => {
  if (!hex || typeof hex !== 'string') return rgb(def.r, def.g, def.b);
  const clean = hex.replace('#', '').trim();
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    return rgb(r, g, b);
  }
  return rgb(def.r, def.g, def.b);
};

const fmtDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? String(d) : `${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
};

const addYears = (d, y) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return '—';
  dt.setFullYear(dt.getFullYear() + y);
  return fmtDate(dt);
};

const getInstInfo = (student, institution = {}) => {
  const campus = student?.campus_id || {};
  const school = student?.school_id || {};
  let userSchool = {};
  try {
    const raw = localStorage.getItem('user');
    if (raw) userSchool = JSON.parse(raw) || {};
  } catch (e) {}

  const name = (institution.institutionName || school?.name || userSchool?.school_name || campus?.name || 'ELITE EDUCATION SYSTEM').toUpperCase();
  const campusName = institution.campusName || campus?.name || 'Main Campus';
  const phone = institution.schoolPhone || campus?.contact_number || school?.contact_number || '';
  return { name, campusName, phone };
};

const resolveEmergency = (student) => {
  if (student?.emergency_contact_no) return String(student.emergency_contact_no);
  if (typeof student?.emergency_contact === 'object') {
    return student.emergency_contact?.phone || student.emergency_contact?.name || '';
  }
  if (student?.emergency_contact) return String(student.emergency_contact);
  return student?.parent_phone || student?.contact_number || '—';
};

const drawVerticalStudentBack = (page, coords, student, fonts, qrImage, opts) => {
  const { x, y, width, height } = coords;
  const { accentColor, institution } = opts;
  const accent = parseColor(accentColor);
  const inst = getInstInfo(student, institution);

  page.drawRectangle({
    x, y, width, height,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.85, 0.88, 0.92),
    borderWidth: 0.8,
  });

  page.drawRectangle({
    x: x + 1,
    y: y + height - 28,
    width: width - 2,
    height: 27,
    color: accent,
  });

  page.drawText('STUDENT IDENTITY BACK', {
    x: x + 12,
    y: y + height - 13,
    size: 6,
    font: fonts.bold,
    color: rgb(0.9, 0.95, 1),
  });

  page.drawText(inst.name.slice(0, 26), {
    x: x + 12,
    y: y + height - 22,
    size: 7,
    font: fonts.bold,
    color: rgb(1, 1, 1),
  });

  const admDate = student?.date_of_admission || student?.admission_date;
  const father = student?.father_name ? `S/O ${student.father_name}` : '—';
  const blood = student?.blood_group || '—';
  const bform = student?.b_form || student?.cnic || '—';
  const emPhone = resolveEmergency(student);
  const route = student?.transport_route || 'Self Transport';
  const address = student?.address?.current_address || student?.current_address || '—';

  const rows = [
    { label: 'Father Name:', val: father.slice(0, 24) },
    { label: 'Date of Birth:', val: fmtDate(student?.dob) },
    { label: 'Blood Group:', val: blood },
    { label: 'B-Form / CNIC:', val: bform.slice(0, 18) },
    { label: 'Emergency Phone:', val: emPhone.slice(0, 16) },
    { label: 'Transport / Bus:', val: route.slice(0, 20) },
    { label: 'Issued / Valid:', val: `${fmtDate(admDate)} to ${addYears(admDate, 2)}` },
  ];

  rows.forEach((r, idx) => {
    const ry = y + height - 42 - idx * 13;
    page.drawText(r.label, {
      x: x + 10,
      y: ry,
      size: 5.5,
      font: fonts.bold,
      color: rgb(0.4, 0.45, 0.52),
    });
    page.drawText(String(r.val), {
      x: x + 58,
      y: ry,
      size: 5.5,
      font: fonts.regular,
      color: rgb(0.12, 0.16, 0.22),
    });
    page.drawLine({
      start: { x: x + 10, y: ry - 2 },
      end: { x: x + width - 10, y: ry - 2 },
      thickness: 0.4,
      color: rgb(0.92, 0.94, 0.96),
    });
  });

  const addressY = y + height - 138;
  page.drawText('Residential Address:', {
    x: x + 10,
    y: addressY,
    size: 5,
    font: fonts.bold,
    color: rgb(0.4, 0.45, 0.52),
  });
  page.drawText(address.slice(0, 42), {
    x: x + 10,
    y: addressY - 8,
    size: 5,
    font: fonts.regular,
    color: rgb(0.15, 0.2, 0.25),
  });

  const termsY = y + 54;
  page.drawRectangle({
    x: x + 8,
    y: termsY - 18,
    width: width - 16,
    height: 24,
    color: rgb(0.96, 0.97, 0.99),
    borderColor: rgb(0.9, 0.92, 0.95),
    borderWidth: 0.5,
  });
  page.drawText('TERMS & CONDITIONS', {
    x: x + 12,
    y: termsY + 1,
    size: 4.5,
    font: fonts.bold,
    color: accent,
  });
  page.drawText('1. Non-transferable. Must be displayed on campus.', {
    x: x + 12,
    y: termsY - 6,
    size: 4.2,
    font: fonts.regular,
    color: rgb(0.35, 0.4, 0.45),
  });
  page.drawText(`2. If lost, report to office: ${inst.phone || 'Admin Desk'}`, {
    x: x + 12,
    y: termsY - 13,
    size: 4.2,
    font: fonts.regular,
    color: rgb(0.35, 0.4, 0.45),
  });

  if (qrImage) {
    page.drawImage(qrImage, {
      x: x + width - 36,
      y: y + 10,
      width: 24,
      height: 24,
    });
  }

  page.drawLine({
    start: { x: x + 12, y: y + 20 },
    end: { x: x + 70, y: y + 20 },
    thickness: 0.5,
    color: rgb(0.65, 0.7, 0.75),
  });
  page.drawText('Authorized Principal', {
    x: x + 16,
    y: y + 12,
    size: 4.8,
    font: fonts.bold,
    color: accent,
  });
};

const drawHorizontalStudentBack = (page, coords, student, fonts, qrImage, opts) => {
  const { x, y, width, height } = coords;
  const { accentColor, institution } = opts;
  const accent = parseColor(accentColor);
  const inst = getInstInfo(student, institution);

  page.drawRectangle({
    x, y, width, height,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.85, 0.88, 0.92),
    borderWidth: 0.8,
  });

  page.drawRectangle({
    x: x + 1,
    y: y + height - 20,
    width: width - 2,
    height: 19,
    color: accent,
  });

  page.drawText('STUDENT IDENTITY BACK', {
    x: x + 10,
    y: y + height - 13,
    size: 6.5,
    font: fonts.bold,
    color: rgb(1, 1, 1),
  });
  page.drawText(inst.name.slice(0, 32), {
    x: x + width - 130,
    y: y + height - 13,
    size: 6.5,
    font: fonts.bold,
    color: rgb(0.9, 0.95, 1),
  });

  const admDate = student?.date_of_admission || student?.admission_date;
  const father = student?.father_name ? `S/O ${student.father_name}` : '—';
  const blood = student?.blood_group || '—';
  const bform = student?.b_form || student?.cnic || '—';
  const emPhone = resolveEmergency(student);
  const route = student?.transport_route || 'Self Transport';
  const address = student?.address?.current_address || student?.current_address || '—';

  const col1 = [
    { label: 'Father Name:', val: father.slice(0, 22) },
    { label: 'Date of Birth:', val: fmtDate(student?.dob) },
    { label: 'Blood Group:', val: blood },
    { label: 'B-Form / CNIC:', val: bform.slice(0, 18) },
  ];

  const col2 = [
    { label: 'Emergency Phone:', val: emPhone.slice(0, 16) },
    { label: 'Transport Route:', val: route.slice(0, 20) },
    { label: 'Valid Period:', val: `${fmtDate(admDate)} - ${addYears(admDate, 2)}` },
    { label: 'Address:', val: address.slice(0, 24) },
  ];

  col1.forEach((r, idx) => {
    const ry = y + height - 34 - idx * 13;
    page.drawText(r.label, { x: x + 10, y: ry, size: 5.5, font: fonts.bold, color: rgb(0.4, 0.45, 0.52) });
    page.drawText(String(r.val), { x: x + 58, y: ry, size: 5.5, font: fonts.regular, color: rgb(0.12, 0.16, 0.22) });
  });

  col2.forEach((r, idx) => {
    const ry = y + height - 34 - idx * 13;
    page.drawText(r.label, { x: x + 120, y: ry, size: 5.5, font: fonts.bold, color: rgb(0.4, 0.45, 0.52) });
    page.drawText(String(r.val), { x: x + 172, y: ry, size: 5.5, font: fonts.regular, color: rgb(0.12, 0.16, 0.22) });
  });

  const footY = y + 12;
  page.drawLine({
    start: { x: x + 10, y: footY + 16 },
    end: { x: x + width - 10, y: footY + 16 },
    thickness: 0.5,
    color: rgb(0.88, 0.9, 0.93),
  });

  page.drawText(`Campus Helpline: ${inst.phone || '021-111-222-333'} | Official Property`, {
    x: x + 10,
    y: footY + 4,
    size: 4.8,
    font: fonts.regular,
    color: rgb(0.4, 0.45, 0.5),
  });

  if (qrImage) {
    page.drawImage(qrImage, {
      x: x + width - 52,
      y: footY - 4,
      width: 18,
      height: 18,
    });
  }

  page.drawText('Authorized Principal', {
    x: x + width - 120,
    y: footY + 4,
    size: 5,
    font: fonts.bold,
    color: accent,
  });
};

export const drawStudentCardBack = (page, coords, student, fonts, qrImage, opts = {}) => {
  const orientation = opts.orientation || 'vertical';
  if (orientation === 'horizontal') {
    drawHorizontalStudentBack(page, coords, student, fonts, qrImage, opts);
  } else {
    drawVerticalStudentBack(page, coords, student, fonts, qrImage, opts);
  }
};
