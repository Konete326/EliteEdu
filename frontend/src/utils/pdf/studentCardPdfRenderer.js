import { rgb } from 'pdf-lib';

export const drawStudentCard = (page, coords, student, fonts, qrImage) => {
  const { x, y, width, height } = coords;
  const { bold, regular } = fonts;
  const campus = student?.campus_id || {};
  const school = student?.school_id || {};
  let userSchool = {};
  try {
    const raw = localStorage.getItem('user');
    if (raw) userSchool = JSON.parse(raw) || {};
  } catch (e) {}

  const schoolName = (school.name || userSchool?.school_name || campus.name || 'INSTITUTION').toUpperCase();
  const slogan = (school.slogan || userSchool?.school_slogan || campus.motto || 'Strive for Excellence').toUpperCase();

  page.drawRectangle({
    x, y, width, height,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.8
  });

  page.drawRectangle({
    x: x + 1, y: y + height - 24, width: width - 2, height: 23,
    color: rgb(0.08, 0.25, 0.5)
  });
  page.drawText(schoolName.slice(0, 36), {
    x: x + 12, y: y + height - 12, size: 7.5, font: bold, color: rgb(1, 1, 1)
  });
  page.drawText(slogan.slice(0, 48), {
    x: x + 12, y: y + height - 20, size: 5.5, font: regular, color: rgb(0.85, 0.9, 1)
  });

  const photoX = x + 8;
  const photoY = y + 40;
  page.drawRectangle({
    x: photoX, y: photoY, width: 44, height: 54,
    color: rgb(0.95, 0.96, 0.98),
    borderColor: rgb(0.7, 0.75, 0.8),
    borderWidth: 0.7
  });
  const initials = student?.name ? student.name.slice(0, 2).toUpperCase() : 'ST';
  page.drawText(initials, {
    x: photoX + 14, y: photoY + 23, size: 12, font: bold, color: rgb(0.08, 0.25, 0.5)
  });

  const textX = x + 58;
  let textY = y + 82;
  page.drawText(`Name: ${(student?.name || 'STUDENT').toUpperCase()}`, {
    x: textX, y: textY, size: 7.5, font: bold, color: rgb(0.1, 0.1, 0.1)
  });
  textY -= 10;
  page.drawText(`Father: ${student?.father_name || '—'}`, {
    x: textX, y: textY, size: 6.5, font: regular, color: rgb(0.25, 0.25, 0.25)
  });
  textY -= 10;
  const gradeName = student?.current_grade?.name || student?.grade_name || 'Grade 10';
  page.drawText(`Class: ${gradeName} (${student?.current_section || 'A'})`, {
    x: textX, y: textY, size: 6.5, font: bold, color: rgb(0.08, 0.25, 0.5)
  });
  textY -= 10;
  page.drawText(`GR #: ${student?.gr_number || '1001'}`, {
    x: textX, y: textY, size: 6.5, font: bold, color: rgb(0.1, 0.1, 0.1)
  });
  textY -= 10;
  page.drawText(`Emergency: ${student?.emergency_contact_number || student?.contact_number || '—'}`, {
    x: textX, y: textY, size: 6, font: regular, color: rgb(0.3, 0.3, 0.3)
  });

  if (qrImage) {
    page.drawImage(qrImage, { x: x + 210, y: y + 36, width: 42, height: 42 });
    page.drawText('Scan ID', { x: x + 218, y: y + 28, size: 5, font: bold, color: rgb(0.4, 0.4, 0.4) });
  }

  page.drawRectangle({
    x: x + 1, y: y + 1, width: width - 2, height: 11,
    color: rgb(0.85, 0.68, 0.15)
  });
  page.drawText('OFFICIAL STUDENT IDENTITY CARD', {
    x: x + (width / 2) - 48, y: y + 4, size: 5.5, font: bold, color: rgb(0.1, 0.1, 0.1)
  });
  page.drawText('EliteEdu', {
    x: x + width - 26, y: y + 4, size: 4.5, font: regular, color: rgb(0.25, 0.25, 0.25)
  });
};
