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
  const cnicStr = (teacher?.cnic || '42201-1234567-1').padEnd(15, ' ');
  for (let i = 0; i < 15; i++) {
    const boxX = x + 38 + i * 8.5;
    page.drawRectangle({
      x: boxX, y: y + height - 20, width: 8, height: 9,
      borderColor: rgb(0.65, 0.65, 0.65), borderWidth: 0.5, color: rgb(0.98, 0.98, 0.99)
    });
    const char = cnicStr[i] || '';
    if (char) {
      page.drawText(char, { x: boxX + 2, y: y + height - 18, size: 5.5, font: mono, color: rgb(0.1, 0.1, 0.1) });
    }
  }

  page.drawText('Pers #:', { x: x + 8, y: y + height - 31, size: 5.5, font: bold, color: rgb(0.2, 0.2, 0.2) });
  const persStr = (teacher?.personal_id || teacher?.employee_code || '11034103').padEnd(8, ' ');
  for (let i = 0; i < 8; i++) {
    const boxX = x + 38 + i * 8.5;
    page.drawRectangle({
      x: boxX, y: y + height - 34, width: 8, height: 9,
      borderColor: rgb(0.65, 0.65, 0.65), borderWidth: 0.5, color: rgb(0.98, 0.98, 0.99)
    });
    const char = persStr[i] || '';
    if (char) {
      page.drawText(char, { x: boxX + 2, y: y + height - 32, size: 5.5, font: mono, color: rgb(0.1, 0.1, 0.1) });
    }
  }

  const dobStr = teacher?.dob ? new Date(teacher.dob).toLocaleDateString('en-GB') : '15-08-1988';
  page.drawText(`D.O.B: ${dobStr}`, { x: x + 120, y: y + height - 31, size: 5.5, font: bold, color: rgb(0.2, 0.2, 0.2) });

  const apptDate = teacher?.appointment_date || teacher?.joining_date;
  const apptStr = apptDate ? new Date(apptDate).toLocaleDateString('en-GB') : '01-04-2015';
  let curY = y + height - 44;

  const drawRow = (label, val, highlightColor = rgb(0.1, 0.1, 0.1)) => {
    page.drawText(label, { x: x + 8, y: curY, size: 5, font: bold, color: rgb(0.4, 0.4, 0.4) });
    page.drawText(String(val).slice(0, 42), { x: x + 62, y: curY, size: 5.5, font: regular, color: highlightColor });
    page.drawLine({ start: { x: x + 60, y: curY - 1 }, end: { x: x + 200, y: curY - 1 }, thickness: 0.4, color: rgb(0.85, 0.85, 0.85) });
    curY -= 10;
  };

  drawRow('Date of Appt:', apptStr);
  drawRow('Place of Posting:', campus.name || 'G.B.S.S Apwa, J-1 Area, Korangi Karachi');
  drawRow('SEMIS / Vendor:', `${teacher?.semis_code || '408110114'}  •  Vendor: ${teacher?.vendor_no || '1045231'}`);
  drawRow('Address:', teacher?.current_address || campus.address || 'Karachi, Sindh');
  drawRow('Phone / Blood:', `${teacher?.contact_number || '03422667599'}  •  Blood: ${teacher?.blood_group || 'O+'}`, rgb(0.8, 0.1, 0.1));
  drawRow('E-mail / SED:', `${teacher?.email || 'staff@school.local'}  •  SED: ${teacher?.sed_no || 'SED-9921'}`);

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
  page.drawText('EliteEdu', {
    x: x + width - 26, y: y + 4, size: 4.5, font: regular, color: rgb(0.8, 0.8, 0.8)
  });
};
