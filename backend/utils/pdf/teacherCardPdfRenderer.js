const { rgb } = require('pdf-lib');

const drawTeacherCardFront = (page, coords, teacher, fonts, style = 'GovtSindh') => {
  const { x, y, width, height } = coords;
  const { bold, regular } = fonts;

  page.drawRectangle({
    x, y, width, height,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.8
  });

  const campus = teacher?.campus_id || {};
  const school = teacher?.school_id || {};
  const schoolName = (school?.name || campus?.name || 'ELITE EDUCATIONAL SYSTEM').toUpperCase();
  const slogan = (school?.slogan || campus?.motto || 'Strive for Excellence').toUpperCase();

  const headerColor = style === 'Institutional' ? rgb(0.08, 0.12, 0.2) : rgb(0.06, 0.35, 0.18);
  page.drawRectangle({ x: x + 1, y: y + height - 25, width: width - 2, height: 24, color: headerColor });
  page.drawText(schoolName.slice(0, 36), { x: x + 25, y: y + height - 11, size: 7.5, font: bold, color: rgb(1, 1, 1) });
  page.drawText(slogan.slice(0, 48), { x: x + 25, y: y + height - 19, size: 5.5, font: regular, color: rgb(0.9, 0.9, 0.9) });

  page.drawRectangle({ x: x + 1, y: y + height - 34, width: width - 2, height: 9, color: rgb(0.85, 0.68, 0.15) });
  page.drawText('SERVICE IDENTITY CARD', { x: x + (width / 2) - 42, y: y + height - 32, size: 6, font: bold, color: rgb(0.1, 0.1, 0.1) });

  const photoX = x + 8;
  const photoY = y + 42;
  page.drawRectangle({ x: photoX, y: photoY, width: 44, height: 52, color: rgb(0.95, 0.96, 0.98), borderColor: rgb(0.7, 0.75, 0.8), borderWidth: 0.7 });
  const initials = teacher?.name ? teacher.name.slice(0, 2).toUpperCase() : 'TC';
  page.drawText(initials, { x: photoX + 14, y: photoY + 22, size: 12, font: bold, color: headerColor });

  const textX = x + 58;
  let textY = y + 84;
  page.drawText(`Name: ${(teacher?.name || 'FACULTY MEMBER').toUpperCase()}`, { x: textX, y: textY, size: 7.5, font: bold, color: rgb(0.1, 0.1, 0.1) });
  textY -= 10;
  page.drawText(`S/o: ${teacher?.father_name || teacher?.spouse_name || '—'}`, { x: textX, y: textY, size: 6.5, font: regular, color: rgb(0.25, 0.25, 0.25) });
  textY -= 10;
  const desig = `${teacher?.designation || 'Staff'} ${teacher?.bps_grade ? `(BPS-${teacher.bps_grade})` : ''}`;
  page.drawText(`Designation: ${desig}`, { x: textX, y: textY, size: 6.5, font: bold, color: rgb(0.15, 0.15, 0.15) });
  textY -= 10;
  page.drawText(`Personal ID: ${teacher?.personal_id || teacher?.employee_code || '—'}`, { x: textX, y: textY, size: 6.5, font: bold, color: headerColor });
  textY -= 10;
  page.drawText(`CNIC: ${teacher?.cnic || '—'}`, { x: textX, y: textY, size: 6.5, font: regular, color: rgb(0.25, 0.25, 0.25) });

  for (let i = 0; i < 24; i++) {
    const barW = (i % 3 === 0 || i % 7 === 0) ? 2 : 1;
    page.drawRectangle({ x: x + 8 + i * 3.5, y: y + 12, width: barW, height: 16, color: rgb(0.1, 0.1, 0.1) });
  }

  page.drawLine({ start: { x: x + 110, y: y + 20 }, end: { x: x + 175, y: y + 20 }, thickness: 0.5, color: rgb(0.6, 0.6, 0.6) });
  page.drawText("Holder's Signature", { x: x + 115, y: y + 11, size: 5, font: regular, color: rgb(0.4, 0.4, 0.4) });
  page.drawLine({ start: { x: x + 190, y: y + 20 }, end: { x: x + 250, y: y + 20 }, thickness: 0.5, color: rgb(0.6, 0.6, 0.6) });
  page.drawText('Issuing Authority', { x: x + 197, y: y + 11, size: 5, font: bold, color: headerColor });
  page.drawText('EliteEdu', { x: x + width - 26, y: y + 3, size: 4.5, font: regular, color: rgb(0.5, 0.5, 0.5) });
};

const drawTeacherCardBack = (page, coords, teacher, fonts, qrImage, style = 'GovtSindh') => {
  const { x, y, width, height } = coords;
  const { bold, regular, mono } = fonts;
  const campus = teacher?.campus_id || {};

  page.drawRectangle({ x, y, width, height, color: rgb(1, 1, 1), borderColor: rgb(0.8, 0.8, 0.8), borderWidth: 0.8 });
  page.drawText('C.N.I.C:', { x: x + 8, y: y + height - 16, size: 5.5, font: bold, color: rgb(0.2, 0.2, 0.2) });
  const cnicStr = (teacher?.cnic || '42201-1234567-1').padEnd(15, ' ');
  for (let i = 0; i < 15; i++) {
    const bX = x + 38 + i * 8.5;
    page.drawRectangle({ x: bX, y: y + height - 20, width: 8, height: 9, borderColor: rgb(0.65, 0.65, 0.65), borderWidth: 0.5, color: rgb(0.98, 0.98, 0.99) });
    const c = cnicStr[i] || '';
    if (c) page.drawText(c, { x: bX + 2, y: y + height - 18, size: 5.5, font: mono, color: rgb(0.1, 0.1, 0.1) });
  }

  page.drawText('Pers #:', { x: x + 8, y: y + height - 31, size: 5.5, font: bold, color: rgb(0.2, 0.2, 0.2) });
  const persStr = (teacher?.personal_id || teacher?.employee_code || '11034103').padEnd(8, ' ');
  for (let i = 0; i < 8; i++) {
    const bX = x + 38 + i * 8.5;
    page.drawRectangle({ x: bX, y: y + height - 34, width: 8, height: 9, borderColor: rgb(0.65, 0.65, 0.65), borderWidth: 0.5, color: rgb(0.98, 0.98, 0.99) });
    const c = persStr[i] || '';
    if (c) page.drawText(c, { x: bX + 2, y: y + height - 32, size: 5.5, font: mono, color: rgb(0.1, 0.1, 0.1) });
  }

  const dobStr = teacher?.dob ? new Date(teacher.dob).toLocaleDateString('en-GB') : '15-08-1988';
  page.drawText(`D.O.B: ${dobStr}`, { x: x + 120, y: y + height - 31, size: 5.5, font: bold, color: rgb(0.2, 0.2, 0.2) });

  let curY = y + height - 44;
  const drawRow = (lbl, val, col = rgb(0.1, 0.1, 0.1)) => {
    page.drawText(lbl, { x: x + 8, y: curY, size: 5, font: bold, color: rgb(0.4, 0.4, 0.4) });
    page.drawText(String(val).slice(0, 42), { x: x + 62, y: curY, size: 5.5, font: regular, color: col });
    page.drawLine({ start: { x: x + 60, y: curY - 1 }, end: { x: x + 200, y: curY - 1 }, thickness: 0.4, color: rgb(0.85, 0.85, 0.85) });
    curY -= 10;
  };

  const apptDate = teacher?.appointment_date || teacher?.joining_date;
  drawRow('Date of Appt:', apptDate ? new Date(apptDate).toLocaleDateString('en-GB') : '01-04-2015');
  drawRow('Place of Posting:', campus.name || 'G.B.S.S Apwa, J-1 Area, Korangi Karachi');
  drawRow('SEMIS / Vendor:', `${teacher?.semis_code || '408110114'}  •  Vendor: ${teacher?.vendor_no || '1045231'}`);
  drawRow('Address:', teacher?.current_address || campus.address || 'Karachi, Sindh');
  drawRow('Phone / Blood:', `${teacher?.contact_number || '03422667599'}  •  Blood: ${teacher?.blood_group || 'O+'}`, rgb(0.8, 0.1, 0.1));
  drawRow('E-mail / SED:', `${teacher?.email || 'staff@school.local'}  •  SED: ${teacher?.sed_no || 'SED-9921'}`);

  if (qrImage) {
    page.drawImage(qrImage, { x: x + 205, y: y + 30, width: 44, height: 44 });
    page.drawText('Scan to Verify', { x: x + 207, y: y + 21, size: 4.8, font: bold, color: rgb(0.4, 0.4, 0.4) });
  }

  const bColor = style === 'Institutional' ? rgb(0.08, 0.12, 0.2) : rgb(0.06, 0.35, 0.18);
  page.drawRectangle({ x: x + 1, y: y + 1, width: width - 2, height: 11, color: bColor });
  page.drawText('IF FOUND PLEASE DROP IN THE LETTER BOX', { x: x + (width / 2) - 58, y: y + 4, size: 5.5, font: bold, color: rgb(1, 1, 1) });
  page.drawText('EliteEdu', { x: x + width - 26, y: y + 4, size: 4.5, font: regular, color: rgb(0.8, 0.8, 0.8) });
};

module.exports = { drawTeacherCardFront, drawTeacherCardBack };
