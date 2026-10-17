import { rgb } from 'pdf-lib';

export const drawTeacherCardFront = (page, coords, teacher, fonts, style = 'GovtSindh') => {
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
  let userSchool = {};
  try {
    const raw = localStorage.getItem('user');
    if (raw) userSchool = JSON.parse(raw) || {};
  } catch (e) {}

  const schoolName = (school?.name || userSchool?.school_name || campus?.name || 'ELITE EDUCATIONAL SYSTEM').toUpperCase();
  const slogan = (school?.slogan || userSchool?.school_slogan || campus?.motto || 'Strive for Excellence').toUpperCase();

  const headerColor = style === 'Institutional' ? rgb(0.08, 0.12, 0.2) : rgb(0.06, 0.35, 0.18);
  page.drawRectangle({
    x: x + 1, y: y + height - 25, width: width - 2, height: 24,
    color: headerColor
  });

  page.drawText(schoolName.slice(0, 36), {
    x: x + 25, y: y + height - 11, size: 7.5, font: bold, color: rgb(1, 1, 1)
  });
  page.drawText(slogan.slice(0, 48), {
    x: x + 25, y: y + height - 19, size: 5.5, font: regular, color: rgb(0.9, 0.9, 0.9)
  });

  page.drawRectangle({
    x: x + 1, y: y + height - 34, width: width - 2, height: 9,
    color: rgb(0.85, 0.68, 0.15)
  });
  page.drawText('SERVICE IDENTITY CARD', {
    x: x + (width / 2) - 42, y: y + height - 32, size: 6, font: bold, color: rgb(0.1, 0.1, 0.1)
  });

  const photoX = x + 8;
  const photoY = y + 42;
  page.drawRectangle({
    x: photoX, y: photoY, width: 44, height: 52,
    color: rgb(0.95, 0.96, 0.98),
    borderColor: rgb(0.7, 0.75, 0.8),
    borderWidth: 0.7
  });
  const initials = teacher?.name ? teacher.name.slice(0, 2).toUpperCase() : 'TC';
  page.drawText(initials, {
    x: photoX + 14, y: photoY + 22, size: 12, font: bold, color: headerColor
  });

  const textX = x + 58;
  let textY = y + 84;
  page.drawText(`Name: ${(teacher?.name || 'FACULTY MEMBER').toUpperCase()}`, {
    x: textX, y: textY, size: 7.5, font: bold, color: rgb(0.1, 0.1, 0.1)
  });

  textY -= 10;
  page.drawText(`S/o: ${teacher?.father_name || teacher?.spouse_name || '—'}`, {
    x: textX, y: textY, size: 6.5, font: regular, color: rgb(0.25, 0.25, 0.25)
  });

  textY -= 10;
  const bpsNum = teacher?.bps_grade ? String(teacher.bps_grade).replace(/^BPS[-_\s]*/i, '').trim() : '';
  const desig = `${teacher?.designation || 'Staff'} ${bpsNum ? `(BPS-${bpsNum})` : ''}`;
  page.drawText(`Designation: ${desig}`, {
    x: textX, y: textY, size: 6.5, font: bold, color: rgb(0.15, 0.15, 0.15)
  });

  textY -= 10;
  page.drawText(`Personal ID: ${teacher?.personal_id || teacher?.employee_code || '—'}`, {
    x: textX, y: textY, size: 6.5, font: bold, color: headerColor
  });

  textY -= 10;
  page.drawText(`CNIC: ${teacher?.cnic || '—'}`, {
    x: textX, y: textY, size: 6.5, font: regular, color: rgb(0.25, 0.25, 0.25)
  });

  for (let i = 0; i < 24; i++) {
    const barW = (i % 3 === 0 || i % 7 === 0) ? 2 : 1;
    page.drawRectangle({
      x: x + 8 + i * 3.5, y: y + 12, width: barW, height: 16,
      color: rgb(0.1, 0.1, 0.1)
    });
  }

  page.drawLine({
    start: { x: x + 110, y: y + 20 },
    end: { x: x + 175, y: y + 20 },
    thickness: 0.5,
    color: rgb(0.6, 0.6, 0.6)
  });
  page.drawText("Holder's Signature", {
    x: x + 115, y: y + 11, size: 5, font: regular, color: rgb(0.4, 0.4, 0.4)
  });

  page.drawLine({
    start: { x: x + 190, y: y + 20 },
    end: { x: x + 250, y: y + 20 },
    thickness: 0.5,
    color: rgb(0.6, 0.6, 0.6)
  });
  page.drawText('Issuing Authority', {
    x: x + 197, y: y + 11, size: 5, font: bold, color: headerColor
  });
  page.drawText('EliteEdu', {
    x: x + width - 26, y: y + 3, size: 4.5, font: regular, color: rgb(0.5, 0.5, 0.5)
  });
};
