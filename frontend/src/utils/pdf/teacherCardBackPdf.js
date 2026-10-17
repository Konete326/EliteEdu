import { rgb } from 'pdf-lib';

export const drawTeacherCardBack = (page, coords, teacher, fonts, qrImage, style = 'GovtSindh') => {
  const { x, y, width, height } = coords;
  const { bold, regular, mono } = fonts;
  const campus = teacher?.campus_id || {};

  page.drawRectangle({
    x, y, width, height,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.8
  });

  page.drawText('C.N.I.C:', { x: x + 8, y: y + height - 16, size: 5.5, font: bold, color: rgb(0.2, 0.2, 0.2) });
  const cnicStr = teacher?.cnic ? String(teacher.cnic).padEnd(15, ' ') : '';
  for (let i = 0; i < 15; i++) {
    const boxX = x + 38 + i * 8.5;
    page.drawRectangle({
      x: boxX, y: y + height - 20, width: 8, height: 9,
      borderColor: rgb(0.65, 0.65, 0.65), borderWidth: 0.5, color: rgb(0.98, 0.98, 0.99)
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
      borderColor: rgb(0.65, 0.65, 0.65), borderWidth: 0.5, color: rgb(0.98, 0.98, 0.99)
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

  const bannerColor = style === 'Institutional' ? rgb(0.08, 0.12, 0.2) : rgb(0.06, 0.35, 0.18);
  page.drawRectangle({
    x: x + 1, y: y + 1, width: width - 2, height: 11,
    color: bannerColor
  });
  page.drawText('IF FOUND PLEASE DROP IN THE LETTER BOX', {
    x: x + (width / 2) - 58, y: y + 4, size: 5.5, font: bold, color: rgb(1, 1, 1)
  });
};
