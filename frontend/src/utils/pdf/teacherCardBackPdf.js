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

const resolveEmergency = (em) => {
  if (!em) return '';
  if (typeof em === 'object') return em.phone || em.name || '';
  return String(em);
};

const getInstInfo = (teacher, institution = {}) => {
  const campus = teacher?.campus_id || {};
  const school = teacher?.school_id || {};
  let userSchool = {};
  try {
    const raw = localStorage.getItem('user');
    if (raw) userSchool = JSON.parse(raw) || {};
  } catch (e) {}

  const name = (institution.institutionName || school?.name || userSchool?.school_name || campus?.name || 'THE INSTITUTION').toUpperCase();
  const campusName = institution.campusName || campus?.name || 'Main Campus';
  const area = institution.areaName || campus?.address || campus?.area || '';
  const phone = institution.schoolPhone || campus?.contact_number || school?.contact_number || '';
  return { name, campusName, area, phone };
};

const drawVerticalBack = (page, coords, teacher, fonts, qrImage, opts) => {
  const { x, y, width, height } = coords;
  const { accentColor, institution } = opts;
  const accent = parseColor(accentColor);
  const inst = getInstInfo(teacher, institution);

  page.drawRectangle({
    x, y, width, height,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.85, 0.88, 0.92),
    borderWidth: 0.8,
  });

  page.drawText('FACULTY IDENTITY CARD', {
    x: x + 12,
    y: y + height - 16,
    size: 6.5,
    font: fonts.bold,
    color: rgb(0.2, 0.25, 0.3),
  });

  page.drawText(inst.name.slice(0, 28), {
    x: x + 12,
    y: y + height - 26,
    size: 6.5,
    font: fonts.bold,
    color: accent,
  });

  page.drawLine({
    start: { x: x + 12, y: y + height - 32 },
    end: { x: x + width - 12, y: y + height - 32 },
    thickness: 0.5,
    color: rgb(0.88, 0.9, 0.93),
  });

  const joinDate = teacher?.date_of_joining || teacher?.appointment_date;
  const emergencyPhone = resolveEmergency(teacher?.emergency_contact);
  const rows = [
    { label: 'ISSUED:', val: fmtDate(joinDate) },
    { label: 'EXPIRES:', val: addYears(joinDate, 3) },
    { label: 'CNIC:', val: teacher?.cnic || '—' },
    { label: 'BLOOD:', val: teacher?.blood_group || '—' },
    ...(emergencyPhone ? [{ label: 'EMERGENCY:', val: emergencyPhone.slice(0, 16) }] : [])
  ];

  rows.forEach((r, idx) => {
    const ry = y + height - 46 - idx * 14;
    page.drawText(r.label, {
      x: x + 12,
      y: ry,
      size: 5.5,
      font: fonts.bold,
      color: rgb(0.45, 0.5, 0.55),
    });
    page.drawText(r.val, {
      x: x + 50,
      y: ry,
      size: 5.5,
      font: fonts.regular,
      color: rgb(0.15, 0.2, 0.25),
    });
    page.drawLine({
      start: { x: x + 12, y: ry - 2 },
      end: { x: x + width - 12, y: ry - 2 },
      thickness: 0.4,
      color: rgb(0.92, 0.94, 0.96),
    });
  });

  const boxY = y + 78;
  const boxH = 48;
  page.drawRectangle({
    x: x + 10,
    y: boxY,
    width: width - 20,
    height: boxH,
    color: rgb(0.96, 0.97, 0.99),
    borderColor: rgb(0.88, 0.9, 0.93),
    borderWidth: 0.6,
  });

  page.drawText('If found please return to:', {
    x: x + 16,
    y: boxY + boxH - 12,
    size: 5,
    font: fonts.bold,
    color: rgb(0.4, 0.45, 0.5),
  });
  page.drawText(inst.name.slice(0, 30), {
    x: x + 16,
    y: boxY + boxH - 22,
    size: 6,
    font: fonts.bold,
    color: rgb(0.1, 0.15, 0.2),
  });
  if (inst.area) {
    page.drawText(inst.area.slice(0, 32), {
      x: x + 16,
      y: boxY + boxH - 32,
      size: 5,
      font: fonts.regular,
      color: rgb(0.35, 0.4, 0.45),
    });
  }

  page.drawLine({
    start: { x: x + (width - 65) / 2, y: y + 54 },
    end: { x: x + (width + 65) / 2, y: y + 54 },
    thickness: 0.6,
    color: rgb(0.7, 0.7, 0.7),
  });
  page.drawText('Signature', {
    x: x + (width / 2) - 12,
    y: y + 46,
    size: 5,
    font: fonts.bold,
    color: accent,
  });

  if (qrImage) {
    page.drawImage(qrImage, {
      x: x + (width - 34) / 2,
      y: y + 10,
      width: 32,
      height: 32,
    });
    page.drawText('Scan to Verify', {
      x: x + (width / 2) - 14,
      y: y + 3,
      size: 4.5,
      font: fonts.bold,
      color: rgb(0.45, 0.5, 0.55),
    });
  }
};

const drawHorizontalBack = (page, coords, teacher, fonts, qrImage, opts) => {
  const { x, y, width, height } = coords;
  const { accentColor, institution } = opts;
  const accent = parseColor(accentColor);
  const inst = getInstInfo(teacher, institution);

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
    color: rgb(0.96, 0.97, 0.99),
  });
  page.drawText(inst.name.slice(0, 32), {
    x: x + 10,
    y: y + height - 13,
    size: 7,
    font: fonts.bold,
    color: rgb(0.1, 0.15, 0.2),
  });
  page.drawRectangle({
    x: x + width - 62,
    y: y + height - 16,
    width: 52,
    height: 12,
    color: accent,
  });
  page.drawText('FACULTY CARD', {
    x: x + width - 58,
    y: y + height - 12.5,
    size: 5.2,
    font: fonts.bold,
    color: rgb(1, 1, 1),
  });

  const joinDate = teacher?.date_of_joining || teacher?.appointment_date;
  const emergencyPhone = resolveEmergency(teacher?.emergency_contact);
  const rows = [
    { label: 'ISSUED:', val: fmtDate(joinDate) },
    { label: 'EXPIRES:', val: addYears(joinDate, 3) },
    { label: 'CNIC:', val: teacher?.cnic || '—' },
    { label: 'BLOOD:', val: teacher?.blood_group || '—' },
    ...(emergencyPhone ? [{ label: 'EMERGENCY:', val: emergencyPhone.slice(0, 16) }] : [])
  ];

  rows.forEach((r, idx) => {
    const ry = y + height - 40 - idx * 14;
    page.drawText(r.label, {
      x: x + 10,
      y: ry,
      size: 5.5,
      font: fonts.bold,
      color: rgb(0.45, 0.5, 0.55),
    });
    page.drawText(r.val, {
      x: x + 44,
      y: ry,
      size: 5.5,
      font: fonts.regular,
      color: rgb(0.15, 0.2, 0.25),
    });
  });

  const boxW = 120;
  const boxH = 46;
  const boxX = x + width - boxW - 10;
  const boxY = y + height - 74;
  page.drawRectangle({
    x: boxX,
    y: boxY,
    width: boxW,
    height: boxH,
    color: rgb(0.96, 0.97, 0.99),
    borderColor: rgb(0.88, 0.9, 0.93),
    borderWidth: 0.6,
  });
  page.drawText('Return if lost to:', {
    x: boxX + 8,
    y: boxY + boxH - 12,
    size: 5,
    font: fonts.bold,
    color: rgb(0.45, 0.5, 0.55),
  });
  page.drawText(inst.name.slice(0, 26), {
    x: boxX + 8,
    y: boxY + boxH - 22,
    size: 6,
    font: fonts.bold,
    color: rgb(0.1, 0.15, 0.2),
  });
  if (inst.area) {
    page.drawText(inst.area.slice(0, 30), {
      x: boxX + 8,
      y: boxY + boxH - 32,
      size: 5,
      font: fonts.regular,
      color: rgb(0.35, 0.4, 0.45),
    });
  }

  page.drawLine({
    start: { x: x + 12, y: y + 26 },
    end: { x: x + 72, y: y + 26 },
    thickness: 0.6,
    color: rgb(0.7, 0.7, 0.7),
  });
  page.drawText('Signature', {
    x: x + 26,
    y: y + 17,
    size: 5,
    font: fonts.bold,
    color: accent,
  });

  if (qrImage) {
    page.drawImage(qrImage, {
      x: x + width - 48,
      y: y + 14,
      width: 32,
      height: 32,
    });
  }

  page.drawRectangle({
    x: x + 1,
    y: y + 1,
    width: width - 2,
    height: 9,
    color: accent,
  });
  page.drawText('IF FOUND PLEASE DROP IN THE NEAREST POST BOX', {
    x: x + (width / 2) - 66,
    y: y + 3,
    size: 4.8,
    font: fonts.bold,
    color: rgb(1, 1, 1),
  });
};

const drawLegacyGovtSindhBack = (page, coords, teacher, fonts, qrImage) => {
  const { x, y, width, height } = coords;
  const { bold, regular, mono } = fonts;
  const campus = teacher?.campus_id || {};

  page.drawRectangle({
    x, y, width, height,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.8,
  });

  page.drawText('C.N.I.C:', { x: x + 8, y: y + height - 16, size: 5.5, font: bold, color: rgb(0.2, 0.2, 0.2) });
  const cnicStr = teacher?.cnic ? String(teacher.cnic).padEnd(15, ' ') : '';
  for (let i = 0; i < 15; i++) {
    const boxX = x + 38 + i * 8.5;
    page.drawRectangle({
      x: boxX, y: y + height - 20, width: 8, height: 9,
      borderColor: rgb(0.65, 0.65, 0.65), borderWidth: 0.5, color: rgb(0.98, 0.98, 0.99),
    });
    const char = cnicStr[i] || '';
    if (char && char !== ' ') {
      page.drawText(char, { x: boxX + 2, y: y + height - 18, size: 5.5, font: mono, color: rgb(0.1, 0.1, 0.1) });
    }
  }

  page.drawText('Pers #:', { x: x + 8, y: y + height - 31, size: 5.5, font: bold, color: rgb(0.2, 0.2, 0.2) });
  const persStr = (teacher?.personal_id || teacher?.employee_code) ? String(teacher.personal_id || teacher.employee_code).slice(0, 8).padEnd(8, ' ') : '';
  for (let i = 0; i < 8; i++) {
    const boxX = x + 38 + i * 8.5;
    page.drawRectangle({
      x: boxX, y: y + height - 34, width: 8, height: 9,
      borderColor: rgb(0.65, 0.65, 0.65), borderWidth: 0.5, color: rgb(0.98, 0.98, 0.99),
    });
    const char = persStr[i] || '';
    if (char && char !== ' ') {
      page.drawText(char, { x: boxX + 2, y: y + height - 32, size: 5.5, font: mono, color: rgb(0.1, 0.1, 0.1) });
    }
  }

  const dobStr = teacher?.dob ? new Date(teacher.dob).toLocaleDateString('en-GB') : '—';
  page.drawText(`D.O.B: ${dobStr}`, { x: x + 120, y: y + height - 31, size: 5.5, font: bold, color: rgb(0.2, 0.2, 0.2) });

  const apptDate = teacher?.appointment_date || teacher?.joining_date;
  const apptStr = apptDate ? new Date(apptDate).toLocaleDateString('en-GB') : '—';
  let curY = y + height - 44;

  const drawRow = (label, val, highlightColor = rgb(0.1, 0.1, 0.1)) => {
    page.drawText(label, { x: x + 8, y: curY, size: 5, font: bold, color: rgb(0.4, 0.4, 0.4) });
    page.drawText(String(val).slice(0, 42), { x: x + 62, y: curY, size: 5.5, font: regular, color: highlightColor });
    page.drawLine({ start: { x: x + 60, y: curY - 1 }, end: { x: x + 200, y: curY - 1 }, thickness: 0.4, color: rgb(0.85, 0.85, 0.85) });
    curY -= 10;
  };

  const emailVal = teacher?.email && !teacher.email.includes('@school.local') ? teacher.email : '—';
  drawRow('Date of Appt:', apptStr);
  drawRow('Place of Posting:', campus.name || '—');
  drawRow('SEMIS / Vendor:', `${teacher?.semis_code || campus?.semis_code || '—'}  •  Vendor: ${teacher?.vendor_no || '—'}`);
  drawRow('Address:', teacher?.current_address || campus.address || '—');
  drawRow('Phone / Blood:', `${teacher?.contact_number || '—'}  •  Blood: ${teacher?.blood_group || '—'}`, teacher?.blood_group ? rgb(0.8, 0.1, 0.1) : rgb(0.1, 0.1, 0.1));
  drawRow('E-mail / SED:', `${emailVal}  •  SED: ${teacher?.sed_no || '—'}`);

  if (qrImage) {
    page.drawImage(qrImage, { x: x + 205, y: y + 30, width: 44, height: 44 });
    page.drawText('Scan to Verify', { x: x + 207, y: y + 21, size: 4.8, font: bold, color: rgb(0.4, 0.4, 0.4) });
  }

  page.drawRectangle({
    x: x + 1, y: y + 1, width: width - 2, height: 11,
    color: rgb(0.06, 0.35, 0.18),
  });
  page.drawText('IF FOUND PLEASE DROP IN THE LETTER BOX', {
    x: x + (width / 2) - 58, y: y + 4, size: 5.5, font: bold, color: rgb(1, 1, 1),
  });
};

export const drawTeacherCardBack = (page, coords, teacher, fonts, qrImage, options = {}) => {
  const style = typeof options === 'string' ? options : (options?.style || 'template_1_curve_blue');
  if (style === 'GovtSindh') {
    drawLegacyGovtSindhBack(page, coords, teacher, fonts, qrImage);
    return;
  }

  const opts = typeof options === 'string' ? { style } : options;
  const orientation = opts.orientation || 'vertical';

  if (orientation === 'vertical') {
    drawVerticalBack(page, coords, teacher, fonts, qrImage, opts);
  } else {
    drawHorizontalBack(page, coords, teacher, fonts, qrImage, opts);
  }
};
