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

const getInstInfo = (teacher, institution = {}) => {
  const campus = teacher?.campus_id || {};
  const school = teacher?.school_id || {};
  let userSchool = {};
  try {
    const raw = localStorage.getItem('user');
    if (raw) userSchool = JSON.parse(raw) || {};
  } catch (e) {}

  const name = (institution.institutionName || school?.name || userSchool?.school_name || campus?.name || 'ELITE EDUCATIONAL SYSTEM').toUpperCase();
  const slogan = (institution.urduMotto || school?.slogan || userSchool?.school_slogan || campus?.motto || 'Strive for Excellence').toUpperCase();
  const area = institution.areaName || campus?.address || '';
  const semis = institution.semisCode || teacher?.semis_code || campus?.semis_code || '';
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
    page.drawImage(photoImage, { x, y, width, height });
    if (ringColor) {
      page.drawRectangle({
        x, y, width, height,
        borderColor: ringColor,
        borderWidth: ringWidth,
      });
    }
  } else {
    page.drawRectangle({
      x, y, width, height,
      color: rgb(0.8, 0.84, 0.88),
      borderColor: ringColor || rgb(0.6, 0.65, 0.7),
      borderWidth: ringWidth,
    });
    const initials = (name || 'TC')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('') || 'TC';
    page.drawText(initials, {
      x: x + (width / 2) - (initials.length * 4.5),
      y: y + (height / 2) - 4,
      size: 11,
      font: fonts.bold,
      color: rgb(0.25, 0.3, 0.38),
    });
  }
};

const drawSignature = (page, x, y, width, fonts, sigColor) => {
  page.drawLine({
    start: { x, y: y + 8 },
    end: { x: x + width, y: y + 8 },
    thickness: 0.6,
    color: rgb(0.7, 0.7, 0.7),
  });
  page.drawText('Signature', {
    x: x + (width / 2) - 12,
    y: y,
    size: 5,
    font: fonts.bold,
    color: sigColor || rgb(0.3, 0.3, 0.3),
  });
};

const drawLegacyGovtSindh = (page, coords, teacher, fonts) => {
  const { x, y, width, height } = coords;
  const { bold, regular } = fonts;
  page.drawRectangle({
    x, y, width, height,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.8,
  });
  const headerColor = rgb(0.06, 0.35, 0.18);
  page.drawRectangle({
    x: x + 1, y: y + height - 25, width: width - 2, height: 24,
    color: headerColor,
  });
  const inst = getInstInfo(teacher);
  page.drawText(inst.name.slice(0, 36), {
    x: x + 12, y: y + height - 11, size: 7.5, font: bold, color: rgb(1, 1, 1),
  });
  page.drawText(inst.slogan.slice(0, 48), {
    x: x + 12, y: y + height - 19, size: 5.5, font: regular, color: rgb(0.9, 0.9, 0.9),
  });
  page.drawRectangle({
    x: x + 1, y: y + height - 34, width: width - 2, height: 9,
    color: rgb(0.85, 0.68, 0.15),
  });
  page.drawText('SERVICE IDENTITY CARD', {
    x: x + (width / 2) - 42, y: y + height - 32, size: 6, font: bold, color: rgb(0.1, 0.1, 0.1),
  });
  const photoX = x + 8;
  const photoY = y + 42;
  page.drawRectangle({
    x: photoX, y: photoY, width: 44, height: 52,
    color: rgb(0.95, 0.96, 0.98),
    borderColor: rgb(0.7, 0.75, 0.8),
    borderWidth: 0.7,
  });
  const initials = teacher?.name ? teacher.name.slice(0, 2).toUpperCase() : 'TC';
  page.drawText(initials, {
    x: photoX + 14, y: photoY + 22, size: 12, font: bold, color: headerColor,
  });
  const textX = x + 58;
  let textY = y + 84;
  page.drawText(`Name: ${(teacher?.name || 'FACULTY MEMBER').toUpperCase()}`, {
    x: textX, y: textY, size: 7.5, font: bold, color: rgb(0.1, 0.1, 0.1),
  });
  textY -= 10;
  page.drawText(`S/o: ${teacher?.father_name || teacher?.spouse_name || '—'}`, {
    x: textX, y: textY, size: 6.5, font: regular, color: rgb(0.25, 0.25, 0.25),
  });
  textY -= 10;
  const bpsNum = teacher?.bps_grade ? String(teacher.bps_grade).replace(/^BPS[-_\s]*/i, '').trim() : '';
  const desig = `${teacher?.designation || 'Staff'} ${bpsNum ? `(BPS-${bpsNum})` : ''}`;
  page.drawText(`Designation: ${desig}`, {
    x: textX, y: textY, size: 6.5, font: bold, color: rgb(0.15, 0.15, 0.15),
  });
  textY -= 10;
  page.drawText(`Personal ID: ${teacher?.personal_id || teacher?.employee_code || '—'}`, {
    x: textX, y: textY, size: 6.5, font: bold, color: headerColor,
  });
  textY -= 10;
  page.drawText(`CNIC: ${teacher?.cnic || '—'}`, {
    x: textX, y: textY, size: 6.5, font: regular, color: rgb(0.25, 0.25, 0.25),
  });
  drawBarcode(page, x + 8, y + 12, 85, 16, rgb(0.1, 0.1, 0.1));
  drawSignature(page, x + 190, y + 11, 55, fonts, headerColor);
};

const drawVerticalCard = (page, coords, teacher, fonts, opts) => {
  const { x, y, width, height } = coords;
  const { style, accentColor, institution, qrImage, photoImage } = opts;
  const accent = parseColor(accentColor);
  const gold = rgb(0.96, 0.65, 0.14);
  const inst = getInstInfo(teacher, institution);
  const isGoldTemplate = style === 'template_2_gold_blue';
  const isApwa = style === 'template_4_apwa_classic';
  const isWave = style === 'template_3_wave_ribbon';

  page.drawRectangle({
    x, y, width, height,
    color: isApwa ? rgb(0.97, 0.98, 0.99) : rgb(1, 1, 1),
    borderColor: isGoldTemplate ? gold : rgb(0.85, 0.88, 0.92),
    borderWidth: isGoldTemplate ? 2.5 : 0.8,
  });

  const headerH = isApwa ? 50 : 48;
  page.drawRectangle({
    x: x + (isGoldTemplate ? 2.5 : 1),
    y: y + height - headerH,
    width: width - (isGoldTemplate ? 5 : 2),
    height: headerH - (isGoldTemplate ? 2.5 : 1),
    color: isApwa ? rgb(0.97, 0.98, 0.99) : accent,
  });

  if (isWave) {
    page.drawRectangle({
      x: x + 1,
      y: y + height - headerH,
      width: width - 2,
      height: 6,
      color: rgb(0.3, 0.65, 0.95),
    });
  }

  const headerTextCol = isApwa ? accent : rgb(1, 1, 1);
  const subTextCol = isApwa ? rgb(0.4, 0.45, 0.55) : rgb(0.9, 0.93, 0.98);

  page.drawText(inst.name.slice(0, 26), {
    x: x + 10,
    y: y + height - 16,
    size: 7,
    font: fonts.bold,
    color: headerTextCol,
  });

  const subLine = (inst.area ? `${inst.area} ` : '') + (inst.semis ? `| SEMIS: ${inst.semis}` : inst.slogan.slice(0, 24));
  page.drawText(subLine.slice(0, 34), {
    x: x + 10,
    y: y + height - 26,
    size: 5,
    font: fonts.regular,
    color: subTextCol,
  });

  const photoW = 42;
  const photoH = 42;
  const photoX = isGoldTemplate ? x + 12 : x + (width - photoW) / 2;
  const photoY = isGoldTemplate ? y + height - headerH - photoH - 6 : y + height - headerH - (photoH / 2);

  drawPhoto(page, {
    x: photoX,
    y: photoY,
    width: photoW,
    height: photoH,
    photoImage,
    name: teacher?.name,
    ringColor: isGoldTemplate ? gold : accent,
    ringWidth: 2,
    fonts,
  });

  if (isGoldTemplate) {
    const badgeW = 76;
    const badgeH = 12;
    page.drawRectangle({
      x: x + width - badgeW - 12,
      y: photoY + 28,
      width: badgeW,
      height: badgeH,
      color: gold,
    });
    const desigText = (teacher?.designation || 'FACULTY').toUpperCase().slice(0, 16);
    page.drawText(desigText, {
      x: x + width - badgeW - 8,
      y: photoY + 31.5,
      size: 5.5,
      font: fonts.bold,
      color: rgb(0.1, 0.1, 0.1),
    });

    if (qrImage) {
      page.drawImage(qrImage, {
        x: x + width - 42,
        y: photoY - 2,
        width: 30,
        height: 30,
      });
      page.drawRectangle({
        x: x + width - 42,
        y: photoY - 2,
        width: 30,
        height: 30,
        borderColor: gold,
        borderWidth: 1,
      });
    }
  } else {
    const badgeW = 86;
    const badgeH = 12;
    const badgeX = x + (width - badgeW) / 2;
    const badgeY = photoY - 15;
    page.drawRectangle({
      x: badgeX,
      y: badgeY,
      width: badgeW,
      height: badgeH,
      color: accent,
    });
    const desigText = (teacher?.designation || 'STAFF').toUpperCase().slice(0, 18);
    page.drawText(desigText, {
      x: badgeX + 6,
      y: badgeY + 3.5,
      size: 5.5,
      font: fonts.bold,
      color: rgb(1, 1, 1),
    });
  }

  const nameY = isGoldTemplate ? photoY - 14 : photoY - 28;
  const teacherName = (teacher?.name || 'FACULTY MEMBER').toUpperCase().slice(0, 24);
  page.drawText(teacherName, {
    x: x + 12,
    y: nameY,
    size: 8,
    font: fonts.bold,
    color: accent,
  });

  const rowStartY = nameY - 14;
  const rows = [
    { label: 'ID', val: teacher?.employee_code || teacher?.personal_id || '—' },
    { label: 'Role', val: (teacher?.designation || 'Staff').slice(0, 20) },
    { label: 'DOJ', val: fmtDate(teacher?.date_of_joining || teacher?.appointment_date) },
    { label: 'CNIC', val: teacher?.cnic || '—' },
  ];

  rows.forEach((r, idx) => {
    const ry = rowStartY - idx * 13;
    page.drawText(r.label, {
      x: x + 12,
      y: ry,
      size: 5.5,
      font: fonts.bold,
      color: rgb(0.45, 0.5, 0.55),
    });
    page.drawText(String(r.val), {
      x: x + 44,
      y: ry,
      size: 5.5,
      font: fonts.regular,
      color: rgb(0.15, 0.2, 0.25),
    });
    page.drawLine({
      start: { x: x + 12, y: ry - 2 },
      end: { x: x + width - 12, y: ry - 2 },
      thickness: 0.4,
      color: rgb(0.9, 0.92, 0.95),
    });
  });

  const barcodeY = rowStartY - 56;
  drawBarcode(page, x + 16, barcodeY, width - 32, 14, accent);
  const codeVal = teacher?.employee_code || teacher?.personal_id || teacher?.cnic || '12345678';
  page.drawText(String(codeVal).slice(0, 20), {
    x: x + (width / 2) - 18,
    y: barcodeY - 7,
    size: 5,
    font: fonts.regular,
    color: rgb(0.4, 0.45, 0.5),
  });

  if (!isGoldTemplate && qrImage) {
    page.drawImage(qrImage, {
      x: x + width - 38,
      y: y + 16,
      width: 26,
      height: 26,
    });
  }

  drawSignature(page, x + 12, y + 16, isGoldTemplate ? 65 : 55, fonts, accent);

  if (isWave) {
    page.drawRectangle({
      x: x + 1,
      y: y + 1,
      width: width - 2,
      height: 4,
      color: accent,
    });
  } else if (!isGoldTemplate && !isApwa) {
    page.drawRectangle({
      x: x + 1,
      y: y + 1,
      width: width - 2,
      height: 10,
      color: accent,
    });
    page.drawText('FACULTY SERVICE CARD', {
      x: x + (width / 2) - 30,
      y: y + 3,
      size: 4.8,
      font: fonts.bold,
      color: rgb(1, 1, 1),
    });
  }
};

const drawHorizontalCard = (page, coords, teacher, fonts, opts) => {
  const { x, y, width, height } = coords;
  const { style, accentColor, institution, qrImage, photoImage } = opts;
  const accent = parseColor(accentColor);
  const gold = rgb(0.96, 0.65, 0.14);
  const inst = getInstInfo(teacher, institution);
  const isGoldTemplate = style === 'template_2_gold_blue';
  const isApwa = style === 'template_4_apwa_classic';
  const isWave = style === 'template_3_wave_ribbon';

  page.drawRectangle({
    x, y, width, height,
    color: isApwa ? rgb(0.97, 0.98, 0.99) : rgb(1, 1, 1),
    borderColor: isGoldTemplate ? gold : rgb(0.85, 0.88, 0.92),
    borderWidth: isGoldTemplate ? 2.5 : 0.8,
  });

  const sideW = 78;
  page.drawRectangle({
    x: x + (isGoldTemplate ? 2.5 : 1),
    y: y + (isGoldTemplate ? 2.5 : 1),
    width: sideW - (isGoldTemplate ? 2.5 : 1),
    height: height - (isGoldTemplate ? 5 : 2),
    color: isApwa ? rgb(0.93, 0.95, 0.97) : accent,
  });

  const photoW = 44;
  const photoH = 44;
  const photoX = x + (sideW - photoW) / 2;
  const photoY = y + height - 60;

  drawPhoto(page, {
    x: photoX,
    y: photoY,
    width: photoW,
    height: photoH,
    photoImage,
    name: teacher?.name,
    ringColor: isGoldTemplate ? gold : (isApwa ? accent : rgb(1, 1, 1)),
    ringWidth: 2,
    fonts,
  });

  const badgeW = 66;
  const badgeH = 12;
  const badgeX = x + (sideW - badgeW) / 2;
  const badgeY = photoY - 18;
  page.drawRectangle({
    x: badgeX,
    y: badgeY,
    width: badgeW,
    height: badgeH,
    color: isGoldTemplate ? gold : (isApwa ? accent : rgb(1, 1, 1)),
  });
  const desigText = (teacher?.designation || 'STAFF').toUpperCase().slice(0, 16);
  page.drawText(desigText, {
    x: badgeX + 4,
    y: badgeY + 3.5,
    size: 5.2,
    font: fonts.bold,
    color: isGoldTemplate ? rgb(0.1, 0.1, 0.1) : (isApwa ? rgb(1, 1, 1) : accent),
  });

  const rightX = x + sideW + 10;
  const topBarH = 20;
  if (!isApwa) {
    page.drawRectangle({
      x: rightX - 5,
      y: y + height - topBarH - 2,
      width: width - sideW - 8,
      height: topBarH,
      color: isGoldTemplate ? accent : rgb(0.96, 0.97, 0.99),
    });
  }

  page.drawText(inst.name.slice(0, 32), {
    x: rightX,
    y: y + height - 14,
    size: 7,
    font: fonts.bold,
    color: isGoldTemplate ? rgb(1, 1, 1) : accent,
  });

  const nameY = y + height - topBarH - 16;
  const teacherName = (teacher?.name || 'FACULTY MEMBER').toUpperCase().slice(0, 26);
  page.drawText(teacherName, {
    x: rightX,
    y: nameY,
    size: 8,
    font: fonts.bold,
    color: accent,
  });

  const rowStartY = nameY - 14;
  const rows = [
    { label: 'ID', val: teacher?.employee_code || teacher?.personal_id || '—' },
    { label: 'Role', val: (teacher?.designation || 'Staff').slice(0, 24) },
    { label: 'DOJ', val: fmtDate(teacher?.date_of_joining || teacher?.appointment_date) },
    { label: 'CNIC', val: teacher?.cnic || '—' },
  ];

  rows.forEach((r, idx) => {
    const ry = rowStartY - idx * 11;
    page.drawText(r.label, {
      x: rightX,
      y: ry,
      size: 5.5,
      font: fonts.bold,
      color: rgb(0.45, 0.5, 0.55),
    });
    page.drawText(String(r.val), {
      x: rightX + 34,
      y: ry,
      size: 5.5,
      font: fonts.regular,
      color: rgb(0.15, 0.2, 0.25),
    });
  });

  drawBarcode(page, rightX, y + 16, 75, 12, accent);

  if (qrImage) {
    page.drawImage(qrImage, {
      x: rightX + 85,
      y: y + 10,
      width: 28,
      height: 28,
    });
  }

  drawSignature(page, rightX + 118, y + 14, 46, fonts, accent);

  if (isWave) {
    page.drawRectangle({
      x: x + 1,
      y: y + 1,
      width: width - 2,
      height: 3,
      color: accent,
    });
  }
};

export const drawTeacherCardFront = (page, coords, teacher, fonts, options = {}) => {
  const style = typeof options === 'string' ? options : (options?.style || 'template_1_curve_blue');
  if (style === 'GovtSindh') {
    drawLegacyGovtSindh(page, coords, teacher, fonts);
    return;
  }

  const opts = typeof options === 'string' ? { style } : options;
  const orientation = opts.orientation || 'vertical';

  if (orientation === 'vertical') {
    drawVerticalCard(page, coords, teacher, fonts, opts);
  } else {
    drawHorizontalCard(page, coords, teacher, fonts, opts);
  }
};
