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

const getInstInfo = (student, institution = {}) => {
  const campus = student?.campus_id || {};
  const school = student?.school_id || {};
  let userSchool = {};
  try {
    const raw = localStorage.getItem('user');
    if (raw) userSchool = JSON.parse(raw) || {};
  } catch {}

  const name = (institution.institutionName || school?.name || userSchool?.school_name || campus?.name || 'INSTITUTION').toUpperCase();
  const slogan = (institution.urduMotto || school?.slogan || userSchool?.school_slogan || campus?.motto || 'Strive for Excellence').toUpperCase();
  const area = institution.areaName || campus?.address || '';
  const semis = institution.semisCode || student?.semis_code || campus?.semis_code || '';
  return { name, slogan, area, semis };
};

const drawBarcode = (page, x, y, width, height, barColor) => {
  const barCount = 30;
  const unit = width / (barCount * 1.5);
  for (let i = 0; i < barCount; i++) {
    const isThick = i % 3 === 0 || i % 7 === 0;
    const w = isThick ? unit * 1.6 : unit * 0.8;
    page.drawRectangle({
      x: x + i * (unit * 1.5),
      y,
      width: Math.min(w, unit * 1.6),
      height,
      color: barColor,
    });
  }
};

const drawPhoto = (page, { x, y, width, height, photoImage, name, ringColor, ringWidth = 2, fonts }) => {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: rgb(1, 1, 1),
    borderColor: ringColor || rgb(0.6, 0.65, 0.7),
    borderWidth: ringWidth,
  });

  if (photoImage) {
    const imgW = photoImage.width;
    const imgH = photoImage.height;
    const aspect = imgW / imgH;
    const pad = 2;
    const innerW = width - pad * 2;
    const innerH = height - pad * 2;
    let drawW = innerW;
    let drawH = innerH;
    let drawX = x + pad;
    let drawY = y + pad;

    if (aspect > innerW / innerH) {
      drawH = innerW / aspect;
      drawY = y + pad + (innerH - drawH) / 2;
    } else {
      drawW = innerH * aspect;
      drawX = x + pad + (innerW - drawW) / 2;
    }

    page.drawImage(photoImage, {
      x: drawX,
      y: drawY,
      width: drawW,
      height: drawH,
    });
  } else {
    const initials = (name || 'ST')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('') || 'ST';
    const fontSize = 13;
    const textWidth = fonts.bold.widthOfTextAtSize(initials, fontSize);
    page.drawText(initials, {
      x: x + (width - textWidth) / 2,
      y: y + (height / 2) - (fontSize / 3),
      size: fontSize,
      font: fonts.bold,
      color: ringColor || rgb(0.12, 0.22, 0.42),
    });
  }
};

const drawVerticalStudentCard = (page, coords, student, fonts, opts) => {
  const { x, y, width, height } = coords;
  const { style, accentColor, institution, qrImage, photoImage } = opts;
  const accent = parseColor(accentColor);
  const gold = rgb(0.96, 0.65, 0.14);
  const inst = getInstInfo(student, institution);
  const isGoldTemplate = style === 'template_2_gold_blue';
  const isApwa = style === 'template_4_apwa_classic';
  const isWave = style === 'template_3_wave_ribbon';

  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: rgb(1, 1, 1),
    borderColor: isGoldTemplate ? gold : rgb(0.85, 0.88, 0.92),
    borderWidth: isGoldTemplate ? 2 : 0.8,
  });

  const headerH = 54;
  page.drawRectangle({
    x: x + 1,
    y: y + height - headerH,
    width: width - 2,
    height: headerH - 1,
    color: isApwa ? rgb(0.12, 0.22, 0.32) : accent,
  });

  if (isWave) {
    page.drawRectangle({
      x: x + 1,
      y: y + height - headerH,
      width: width - 2,
      height: 5,
      color: rgb(0.3, 0.65, 0.95),
    });
  }

  const instNameText = inst.name.slice(0, 24);
  const instNameW = fonts.bold.widthOfTextAtSize(instNameText, 7.5);
  page.drawText(instNameText, {
    x: x + (width - instNameW) / 2,
    y: y + height - 16,
    size: 7.5,
    font: fonts.bold,
    color: rgb(1, 1, 1),
  });

  const subLine = (inst.area ? `${inst.area} ` : '') + (inst.semis ? `| SEMIS: ${inst.semis}` : inst.slogan.slice(0, 22));
  const subLineW = fonts.regular.widthOfTextAtSize(subLine.slice(0, 30), 5.2);
  page.drawText(subLine.slice(0, 30), {
    x: x + (width - subLineW) / 2,
    y: y + height - 26,
    size: 5.2,
    font: fonts.regular,
    color: rgb(0.9, 0.93, 0.98),
  });

  const photoW = 50;
  const photoH = 54;
  const photoX = x + (width - photoW) / 2;
  const photoY = y + height - headerH - photoH / 2;

  drawPhoto(page, {
    x: photoX,
    y: photoY,
    width: photoW,
    height: photoH,
    photoImage,
    name: student?.name,
    ringColor: isGoldTemplate ? gold : rgb(1, 1, 1),
    ringWidth: 2.5,
    fonts,
  });

  const studentName = (student?.name || 'STUDENT NAME').toUpperCase().slice(0, 22);
  const nameSize = 8.5;
  const nameW = fonts.bold.widthOfTextAtSize(studentName, nameSize);
  page.drawText(studentName, {
    x: x + (width - nameW) / 2,
    y: photoY - 14,
    size: nameSize,
    font: fonts.bold,
    color: isGoldTemplate ? rgb(0.12, 0.15, 0.2) : accent,
  });

  const badgeW = 54;
  const badgeH = 10;
  const badgeX = x + (width - badgeW) / 2;
  const badgeY = photoY - 26;
  page.drawRectangle({
    x: badgeX,
    y: badgeY,
    width: badgeW,
    height: badgeH,
    color: isGoldTemplate ? gold : accent,
  });
  const badgeTxt = 'STUDENT';
  const badgeTxtW = fonts.bold.widthOfTextAtSize(badgeTxt, 5.5);
  page.drawText(badgeTxt, {
    x: badgeX + (badgeW - badgeTxtW) / 2,
    y: badgeY + 2.5,
    size: 5.5,
    font: fonts.bold,
    color: isGoldTemplate ? rgb(0.1, 0.1, 0.1) : rgb(1, 1, 1),
  });

  const gradeName = student?.current_grade?.name || student?.grade_name || 'Class';
  const secName = student?.current_section ? ` (${student.current_section})` : '';
  const classText = `${gradeName.replace(/^class\s*/i, '')}${secName}`;
  const classW = fonts.bold.widthOfTextAtSize(classText, 6.5);
  page.drawText(classText, {
    x: x + (width - classW) / 2,
    y: badgeY - 10,
    size: 6.5,
    font: fonts.bold,
    color: rgb(0.3, 0.35, 0.42),
  });

  const fatherVal = student?.father_name ? `S/O ${student.father_name}` : '—';
  const bloodVal = student?.blood_group || '—';
  const rows = [
    { label: 'GR #', val: student?.gr_number || '—' },
    { label: 'Father', val: fatherVal.slice(0, 18) },
    { label: 'DOB', val: fmtDate(student?.dob) },
    { label: 'Blood', val: bloodVal },
    { label: 'Phone', val: (student?.contact_number || student?.emergency_contact_no || student?.parent_phone || '—').slice(0, 16) },
  ];

  const rowStartY = badgeY - 22;
  rows.forEach((r, idx) => {
    const ry = rowStartY - idx * 11;
    page.drawText(r.label, {
      x: x + 14,
      y: ry,
      size: 5.2,
      font: fonts.bold,
      color: rgb(0.45, 0.5, 0.55),
    });
    page.drawText(String(r.val), {
      x: x + 44,
      y: ry,
      size: 5.2,
      font: fonts.regular,
      color: rgb(0.15, 0.2, 0.25),
    });
    page.drawLine({
      start: { x: x + 14, y: ry - 2 },
      end: { x: x + width - 14, y: ry - 2 },
      thickness: 0.3,
      color: rgb(0.9, 0.92, 0.95),
    });
  });

  const barcodeY = rowStartY - 54;
  drawBarcode(page, x + 16, barcodeY, width - 32, 11, accent);
  const codeVal = student?.gr_number || '123456';
  const codeW = fonts.regular.widthOfTextAtSize(String(codeVal), 4.8);
  page.drawText(String(codeVal), {
    x: x + (width - codeW) / 2,
    y: barcodeY - 6,
    size: 4.8,
    font: fonts.regular,
    color: rgb(0.4, 0.45, 0.5),
  });

  const footerY = y + 8;
  page.drawLine({
    start: { x: x + 12, y: footerY + 12 },
    end: { x: x + 64, y: footerY + 12 },
    thickness: 0.5,
    color: rgb(0.65, 0.7, 0.75),
  });
  page.drawText('Principal Sign', {
    x: x + 14,
    y: footerY + 4,
    size: 4.8,
    font: fonts.bold,
    color: accent,
  });

  if (qrImage) {
    page.drawImage(qrImage, {
      x: x + width - 36,
      y: footerY,
      width: 24,
      height: 24,
    });
  }
};

const drawHorizontalStudentCard = (page, coords, student, fonts, opts) => {
  const { x, y, width, height } = coords;
  const { style, accentColor, institution, qrImage, photoImage } = opts;
  const accent = parseColor(accentColor);
  const gold = rgb(0.96, 0.65, 0.14);
  const inst = getInstInfo(student, institution);
  const isGoldTemplate = style === 'template_2_gold_blue';
  const isWave = style === 'template_3_wave_ribbon';

  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: rgb(1, 1, 1),
    borderColor: isGoldTemplate ? gold : rgb(0.85, 0.88, 0.92),
    borderWidth: isGoldTemplate ? 2 : 0.8,
  });

  const topH = 34;
  page.drawRectangle({
    x: x + 1,
    y: y + height - topH,
    width: width - 2,
    height: topH - 1,
    color: accent,
  });

  if (isWave) {
    page.drawRectangle({
      x: x + 1,
      y: y + height - topH,
      width: width - 2,
      height: 4,
      color: rgb(0.3, 0.65, 0.95),
    });
  }

  page.drawText(inst.name.slice(0, 32), {
    x: x + 12,
    y: y + height - 15,
    size: 8,
    font: fonts.bold,
    color: rgb(1, 1, 1),
  });

  const subLine = (inst.area ? `${inst.area} ` : '') + (inst.semis ? `| SEMIS: ${inst.semis}` : inst.slogan.slice(0, 28));
  page.drawText(subLine.slice(0, 38), {
    x: x + 12,
    y: y + height - 25,
    size: 5.5,
    font: fonts.regular,
    color: rgb(0.9, 0.93, 0.98),
  });

  const photoW = 54;
  const photoH = 60;
  const photoX = x + 12;
  const photoY = y + 42;

  drawPhoto(page, {
    x: photoX,
    y: photoY,
    width: photoW,
    height: photoH,
    photoImage,
    name: student?.name,
    ringColor: isGoldTemplate ? gold : accent,
    ringWidth: 2,
    fonts,
  });

  const bloodVal = student?.blood_group;
  if (bloodVal) {
    const bW = 28;
    const bH = 9;
    page.drawRectangle({
      x: photoX + (photoW - bW) / 2,
      y: photoY - 11,
      width: bW,
      height: bH,
      color: rgb(0.95, 0.9, 0.9),
      borderColor: rgb(0.85, 0.3, 0.3),
      borderWidth: 0.5,
    });
    page.drawText(bloodVal, {
      x: photoX + (photoW - bW) / 2 + 5,
      y: photoY - 9,
      size: 5.2,
      font: fonts.bold,
      color: rgb(0.75, 0.15, 0.15),
    });
  }

  const contentX = photoX + photoW + 12;
  const studentName = (student?.name || 'STUDENT NAME').toUpperCase().slice(0, 24);
  page.drawText(studentName, {
    x: contentX,
    y: y + height - topH - 14,
    size: 9,
    font: fonts.bold,
    color: accent,
  });

  const gradeName = student?.current_grade?.name || student?.grade_name || 'Class';
  const secName = student?.current_section ? ` (${student.current_section})` : '';
  const roll = student?.roll_number ? ` • Roll: ${student.roll_number}` : '';
  const classInfo = `${gradeName}${secName}${roll}`.slice(0, 26);
  page.drawText(classInfo, {
    x: contentX,
    y: y + height - topH - 24,
    size: 6,
    font: fonts.bold,
    color: rgb(0.35, 0.4, 0.46),
  });

  const fatherVal = student?.father_name ? `S/O ${student.father_name}` : '—';
  const rows = [
    { label: 'GR #', val: student?.gr_number || '—' },
    { label: 'Father', val: fatherVal.slice(0, 20) },
    { label: 'DOB', val: fmtDate(student?.dob) },
    { label: 'Phone', val: (student?.contact_number || student?.emergency_contact_no || student?.parent_phone || '—').slice(0, 16) },
  ];

  const rowY = y + height - topH - 36;
  rows.forEach((r, idx) => {
    const ry = rowY - idx * 11;
    page.drawText(r.label, {
      x: contentX,
      y: ry,
      size: 5.5,
      font: fonts.bold,
      color: rgb(0.45, 0.5, 0.55),
    });
    page.drawText(String(r.val), {
      x: contentX + 38,
      y: ry,
      size: 5.5,
      font: fonts.regular,
      color: rgb(0.15, 0.2, 0.25),
    });
  });

  const barcodeY = y + 12;
  drawBarcode(page, contentX, barcodeY + 4, 90, 10, accent);
  const codeVal = student?.gr_number || '123456';
  page.drawText(String(codeVal), {
    x: contentX + 30,
    y: barcodeY - 3,
    size: 5,
    font: fonts.regular,
    color: rgb(0.4, 0.45, 0.5),
  });

  if (qrImage) {
    page.drawImage(qrImage, {
      x: x + width - 34,
      y: y + 8,
      width: 24,
      height: 24,
    });
  }
};

export const drawStudentCard = (page, coords, student, fonts, qrImage, options = {}) => {
  const opts = typeof options === 'string' ? { style: options } : (options || {});
  const orientation = opts.orientation || 'vertical';

  if (orientation === 'vertical') {
    drawVerticalStudentCard(page, coords, student, fonts, { ...opts, qrImage });
  } else {
    drawHorizontalStudentCard(page, coords, student, fonts, { ...opts, qrImage });
  }
};