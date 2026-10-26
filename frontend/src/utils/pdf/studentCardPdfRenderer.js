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
  if (photoImage) {
    page.drawRectangle({
      x,
      y,
      width,
      height,
      color: rgb(1, 1, 1),
      borderColor: ringColor || rgb(0.6, 0.65, 0.7),
      borderWidth: ringWidth,
    });

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
    page.drawRectangle({
      x,
      y,
      width,
      height,
      color: rgb(0.94, 0.96, 0.98),
      borderColor: ringColor || rgb(0.6, 0.65, 0.7),
      borderWidth: ringWidth,
    });

    page.drawCircle({
      x: x + width / 2,
      y: y + height * 0.58,
      size: Math.min(width, height) * 0.22,
      color: rgb(0.78, 0.82, 0.88),
    });

    page.drawEllipse({
      x: x + width / 2,
      y: y + height * 0.16,
      xScale: width * 0.38,
      yScale: height * 0.22,
      color: rgb(0.78, 0.82, 0.88),
    });
  }
};

const drawVerticalStudentCard = (page, coords, student, fonts, opts) => {
  const { x, y, width, height } = coords;
  const { style, accentColor, institution, qrImage, photoImage } = opts;
  const accent = parseColor(accentColor);
  const gold = rgb(0.85, 0.55, 0.05);
  const inst = getInstInfo(student, institution);
  const isGoldTemplate = style === 'template_2_gold_blue';
  const isApwa = style === 'template_4_apwa_classic';
  const isWave = style === 'template_3_wave_ribbon';
  const isCurve = !isGoldTemplate && !isApwa && !isWave;

  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: rgb(1, 1, 1),
    borderColor: isGoldTemplate ? gold : rgb(0.85, 0.88, 0.92),
    borderWidth: isGoldTemplate ? 2 : 0.8,
  });

  if (isCurve) {
    page.drawSvgPath(`M 0 0 L ${width} 0 L ${width} 38 Q ${width / 2} 52 0 38 Z`, {
      x,
      y: y + height,
      color: accent,
    });
  } else if (isGoldTemplate) {
    page.drawRectangle({
      x: x + 1,
      y: y + height - 50,
      width: width - 2,
      height: 49,
      color: rgb(0.06, 0.09, 0.16),
    });
  } else if (isWave) {
    page.drawRectangle({
      x: x + 1,
      y: y + height - 48,
      width: width - 2,
      height: 47,
      color: rgb(0.06, 0.09, 0.16),
    });
    page.drawRectangle({
      x: x + 1,
      y: y + height - 48,
      width: width - 2,
      height: 4,
      color: rgb(0.3, 0.65, 0.95),
    });
  } else if (isApwa) {
    page.drawRectangle({
      x: x + 1,
      y: y + height - 44,
      width: width - 2,
      height: 43,
      color: rgb(0.98, 0.98, 0.98),
      borderColor: accent,
      borderWidth: 1,
    });
  }

  const instNameText = inst.name.slice(0, 24);
  const instNameW = fonts.bold.widthOfTextAtSize(instNameText, 7.5);
  page.drawText(instNameText, {
    x: x + (width - instNameW) / 2,
    y: y + height - 15,
    size: 7.5,
    font: fonts.bold,
    color: isApwa ? rgb(0.1, 0.15, 0.25) : rgb(1, 1, 1),
  });

  const subLine = (inst.area ? `${inst.area} ` : '') + (inst.semis ? `| SEMIS: ${inst.semis}` : inst.slogan.slice(0, 22));
  const subLineW = fonts.regular.widthOfTextAtSize(subLine.slice(0, 30), 5);
  page.drawText(subLine.slice(0, 30), {
    x: x + (width - subLineW) / 2,
    y: y + height - 24,
    size: 5,
    font: fonts.regular,
    color: isApwa ? rgb(0.4, 0.45, 0.55) : rgb(0.9, 0.93, 0.98),
  });

  const photoW = 46;
  const photoH = 50;
  const photoX = x + (width - photoW) / 2;
  const photoY = y + height - 28 - photoH;

  drawPhoto(page, {
    x: photoX,
    y: photoY,
    width: photoW,
    height: photoH,
    photoImage,
    name: student?.name,
    ringColor: isGoldTemplate ? gold : (isApwa ? accent : rgb(1, 1, 1)),
    ringWidth: 2.5,
    fonts,
  });

  const studentName = (student?.name || 'STUDENT NAME').toUpperCase().slice(0, 22);
  const nameSize = 8.5;
  const nameW = fonts.bold.widthOfTextAtSize(studentName, nameSize);
  page.drawText(studentName, {
    x: x + (width - nameW) / 2,
    y: photoY - 11,
    size: nameSize,
    font: fonts.bold,
    color: isGoldTemplate ? rgb(0.12, 0.15, 0.2) : accent,
  });

  const badgeW = 62;
  const badgeH = 8.5;
  const badgeX = x + (width - badgeW) / 2;
  const badgeY = photoY - 22;
  page.drawRectangle({
    x: badgeX,
    y: badgeY,
    width: badgeW,
    height: badgeH,
    color: isGoldTemplate ? gold : accent,
  });
  const badgeTxt = 'STUDENT IDENTITY';
  const badgeTxtW = fonts.bold.widthOfTextAtSize(badgeTxt, 4.8);
  page.drawText(badgeTxt, {
    x: badgeX + (badgeW - badgeTxtW) / 2,
    y: badgeY + 2,
    size: 4.8,
    font: fonts.bold,
    color: isGoldTemplate ? rgb(0.1, 0.1, 0.1) : rgb(1, 1, 1),
  });

  const gradeName = student?.current_grade?.name || student?.grade_name || 'Class';
  const secName = student?.current_section ? ` (${student.current_section})` : '';
  const classText = `${gradeName.replace(/^class\s*/i, '')}${secName}`;
  const fatherVal = student?.father_name || '—';
  const bloodVal = student?.blood_group || '—';
  const rollVal = student?.roll_number || '—';
  const bformVal = student?.b_form || student?.cnic || '—';
  const phoneVal = student?.contact_number || student?.emergency_contact_no || student?.parent_phone || '—';

  const gridRows = [
    { c1Label: 'GR NO:', c1Val: String(student?.gr_number || '—'), c2Label: 'CLASS:', c2Val: classText.slice(0, 13) },
    { c1Label: 'FATHER:', c1Val: fatherVal.slice(0, 13), c2Label: 'ROLL NO:', c2Val: String(rollVal).slice(0, 10) },
    { c1Label: 'DOB:', c1Val: fmtDate(student?.dob), c2Label: 'BLOOD:', c2Val: String(bloodVal).slice(0, 8) },
    { c1Label: 'B-FORM:', c1Val: String(bformVal).slice(0, 12), c2Label: 'EMERGENCY:', c2Val: String(phoneVal).slice(0, 11) },
  ];

  const gridStartY = badgeY - 14;
  gridRows.forEach((row, idx) => {
    const ry = gridStartY - idx * 11;
    page.drawText(row.c1Label, {
      x: x + 8,
      y: ry,
      size: 4.6,
      font: fonts.bold,
      color: rgb(0.45, 0.5, 0.55),
    });
    page.drawText(row.c1Val, {
      x: x + 38,
      y: ry,
      size: 4.6,
      font: fonts.regular,
      color: rgb(0.12, 0.16, 0.22),
    });
    page.drawText(row.c2Label, {
      x: x + 88,
      y: ry,
      size: 4.6,
      font: fonts.bold,
      color: rgb(0.45, 0.5, 0.55),
    });
    page.drawText(row.c2Val, {
      x: x + 128,
      y: ry,
      size: 4.6,
      font: fonts.regular,
      color: rgb(0.12, 0.16, 0.22),
    });
    page.drawLine({
      start: { x: x + 8, y: ry - 2 },
      end: { x: x + width - 8, y: ry - 2 },
      thickness: 0.25,
      color: rgb(0.92, 0.94, 0.96),
    });
  });

  const barcodeY = gridStartY - 54;
  drawBarcode(page, x + 18, barcodeY, width - 36, 11, accent);
  const codeVal = student?.gr_number || '123456';
  const codeW = fonts.regular.widthOfTextAtSize(String(codeVal), 4.8);
  page.drawText(String(codeVal), {
    x: x + (width - codeW) / 2,
    y: barcodeY - 6,
    size: 4.8,
    font: fonts.regular,
    color: rgb(0.4, 0.45, 0.5),
  });

  const footerY = y + 7;
  page.drawLine({
    start: { x: x + 10, y: footerY + 13 },
    end: { x: x + 62, y: footerY + 13 },
    thickness: 0.5,
    color: rgb(0.65, 0.7, 0.75),
  });
  page.drawText('Principal Signature', {
    x: x + 10,
    y: footerY + 5,
    size: 4.6,
    font: fonts.bold,
    color: accent,
  });

  if (qrImage) {
    page.drawImage(qrImage, {
      x: x + width - 29,
      y: footerY,
      width: 21,
      height: 21,
    });
  }
};

const drawHorizontalStudentCard = (page, coords, student, fonts, opts) => {
  const { x, y, width, height } = coords;
  const { style, accentColor, institution, qrImage, photoImage } = opts;
  const accent = parseColor(accentColor);
  const gold = rgb(0.85, 0.55, 0.05);
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

  const topH = 26;
  page.drawRectangle({
    x: x + 1,
    y: y + height - topH,
    width: width - 2,
    height: topH - 1,
    color: isGoldTemplate ? rgb(0.06, 0.09, 0.16) : accent,
  });

  if (isWave) {
    page.drawRectangle({
      x: x + 1,
      y: y + height - topH,
      width: width - 2,
      height: 3.5,
      color: rgb(0.3, 0.65, 0.95),
    });
  }

  page.drawText(inst.name.slice(0, 28), {
    x: x + 10,
    y: y + height - 12,
    size: 7.5,
    font: fonts.bold,
    color: isApwa ? rgb(0.1, 0.15, 0.25) : rgb(1, 1, 1),
  });

  const subLine = (inst.area ? `${inst.area} ` : '') + (inst.semis ? `| SEMIS: ${inst.semis}` : inst.slogan.slice(0, 24));
  page.drawText(subLine.slice(0, 32), {
    x: x + 10,
    y: y + height - 21,
    size: 4.8,
    font: fonts.regular,
    color: isApwa ? rgb(0.4, 0.45, 0.55) : rgb(0.9, 0.93, 0.98),
  });

  const badgeW = 60;
  const badgeH = 11;
  const badgeX = x + width - badgeW - 10;
  const badgeY = y + height - topH + (topH - badgeH) / 2;
  page.drawRectangle({
    x: badgeX,
    y: badgeY,
    width: badgeW,
    height: badgeH,
    color: isGoldTemplate ? gold : (isApwa ? accent : rgb(1, 1, 1)),
  });
  const badgeTxt = 'STUDENT IDENTITY';
  const badgeTxtW = fonts.bold.widthOfTextAtSize(badgeTxt, 4.6);
  page.drawText(badgeTxt, {
    x: badgeX + (badgeW - badgeTxtW) / 2,
    y: badgeY + 3,
    size: 4.6,
    font: fonts.bold,
    color: isGoldTemplate ? rgb(0.1, 0.1, 0.1) : (isApwa ? rgb(1, 1, 1) : accent),
  });

  const photoW = 50;
  const photoH = 54;
  const photoX = x + 10;
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
    const bH = 8.5;
    page.drawRectangle({
      x: photoX + (photoW - bW) / 2,
      y: photoY - 10,
      width: bW,
      height: bH,
      color: rgb(0.98, 0.92, 0.92),
      borderColor: rgb(0.85, 0.3, 0.3),
      borderWidth: 0.5,
    });
    page.drawText(bloodVal, {
      x: photoX + (photoW - bW) / 2 + 5,
      y: photoY - 8.5,
      size: 5,
      font: fonts.bold,
      color: rgb(0.75, 0.15, 0.15),
    });
  }

  const contentX = photoX + photoW + 12;
  const studentName = (student?.name || 'STUDENT NAME').toUpperCase().slice(0, 24);
  page.drawText(studentName, {
    x: contentX,
    y: y + height - topH - 13,
    size: 9,
    font: fonts.bold,
    color: isGoldTemplate ? rgb(0.12, 0.15, 0.2) : accent,
  });

  const gradeName = student?.current_grade?.name || student?.grade_name || 'Class';
  const secName = student?.current_section ? ` (${student.current_section})` : '';
  const roll = student?.roll_number ? ` • Roll: ${student.roll_number}` : '';
  const classInfo = `${gradeName}${secName}${roll}`.slice(0, 28);
  page.drawText(classInfo, {
    x: contentX,
    y: y + height - topH - 22,
    size: 5.8,
    font: fonts.bold,
    color: rgb(0.35, 0.4, 0.46),
  });

  const fatherVal = student?.father_name || '—';
  const phoneVal = student?.contact_number || student?.emergency_contact_no || student?.parent_phone || '—';

  const gridRows = [
    { c1Label: 'GR NO:', c1Val: String(student?.gr_number || '—'), c2Label: 'ROLL NO:', c2Val: String(student?.roll_number || '—').slice(0, 8) },
    { c1Label: 'FATHER:', c1Val: fatherVal.slice(0, 14), c2Label: 'BLOOD:', c2Val: String(bloodVal || '—') },
    { c1Label: 'DOB:', c1Val: fmtDate(student?.dob), c2Label: 'EMERGENCY:', c2Val: String(phoneVal).slice(0, 12) },
  ];

  const rowStartY = y + height - topH - 34;
  gridRows.forEach((row, idx) => {
    const ry = rowStartY - idx * 10.5;
    page.drawText(row.c1Label, {
      x: contentX,
      y: ry,
      size: 5,
      font: fonts.bold,
      color: rgb(0.45, 0.5, 0.55),
    });
    page.drawText(row.c1Val, {
      x: contentX + 34,
      y: ry,
      size: 5,
      font: fonts.regular,
      color: rgb(0.12, 0.16, 0.22),
    });
    page.drawText(row.c2Label, {
      x: contentX + 96,
      y: ry,
      size: 5,
      font: fonts.bold,
      color: rgb(0.45, 0.5, 0.55),
    });
    page.drawText(row.c2Val, {
      x: contentX + 138,
      y: ry,
      size: 5,
      font: fonts.regular,
      color: rgb(0.12, 0.16, 0.22),
    });
    page.drawLine({
      start: { x: contentX, y: ry - 2 },
      end: { x: x + width - 10, y: ry - 2 },
      thickness: 0.25,
      color: rgb(0.92, 0.94, 0.96),
    });
  });

  const barcodeY = y + 10;
  drawBarcode(page, contentX, barcodeY + 4, 100, 10, accent);
  const codeVal = student?.gr_number || '123456';
  page.drawText(String(codeVal), {
    x: contentX + 35,
    y: barcodeY - 4,
    size: 4.8,
    font: fonts.regular,
    color: rgb(0.4, 0.45, 0.5),
  });

  const footerY = y + 7;
  page.drawLine({
    start: { x: x + 10, y: footerY + 13 },
    end: { x: x + 56, y: footerY + 13 },
    thickness: 0.5,
    color: rgb(0.65, 0.7, 0.75),
  });
  page.drawText('Principal Signature', {
    x: x + 10,
    y: footerY + 5,
    size: 4.6,
    font: fonts.bold,
    color: accent,
  });

  if (qrImage) {
    page.drawImage(qrImage, {
      x: x + width - 30,
      y: footerY,
      width: 22,
      height: 22,
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