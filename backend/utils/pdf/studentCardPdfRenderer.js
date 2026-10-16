const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const QRCode = require('qrcode');
const { A4_WIDTH, A4_HEIGHT, getCardCoordinates, chunkArray } = require('./cardPdfLayout');
const { createSignedOfflinePayload } = require('../cryptoPayload');

const generateStudentQrPng = async (student, baseUrl = 'https://elitedev-edu.vercel.app') => {
  try {
    const payload = {
      id: String(student._id),
      n: student.name,
      f: student.father_name || '',
      g: student.gr_number || '',
      cl: student.current_grade?.name || 'Grade 10',
      sec: student.current_section || 'A',
      bg: student.blood_group || 'O+',
      em: student.emergency_contact_number || student.contact_number || '',
      ca: student.campus_id?.name || 'Main Campus',
      st: student.status || 'Active'
    };
    const signedOffline = createSignedOfflinePayload(payload);
    const verifyUrl = `${baseUrl}/verify/student/${student._id}?offline=${signedOffline}`;
    return await QRCode.toDataURL(verifyUrl, { margin: 1, width: 140, errorCorrectionLevel: 'M' });
  } catch (err) {
    return null;
  }
};

const drawStudentCardNode = (page, coords, student, fonts, qrImage, options = {}) => {
  const { x, y, width, height } = coords;
  const { bold, regular } = fonts;
  const campus = student?.campus_id || {};
  const schoolName = (options?.school?.name || campus?.name || 'ELITE EDU HIGHER SECONDARY SCHOOL').toUpperCase();
  const slogan = (options?.school?.slogan || campus?.motto || 'Strive for Excellence').toUpperCase();

  page.drawRectangle({ x, y, width, height, color: rgb(1, 1, 1), borderColor: rgb(0.8, 0.8, 0.8), borderWidth: 0.8 });
  page.drawRectangle({ x: x + 1, y: y + height - 24, width: width - 2, height: 23, color: rgb(0.08, 0.25, 0.5) });
  page.drawText(schoolName.slice(0, 38), { x: x + 12, y: y + height - 12, size: 7.5, font: bold, color: rgb(1, 1, 1) });
  page.drawText(slogan.slice(0, 48), { x: x + 12, y: y + height - 20, size: 5.5, font: regular, color: rgb(0.85, 0.9, 1) });

  const pX = x + 8;
  const pY = y + 40;
  page.drawRectangle({ x: pX, y: pY, width: 44, height: 54, color: rgb(0.95, 0.96, 0.98), borderColor: rgb(0.7, 0.75, 0.8), borderWidth: 0.7 });
  const inits = student?.name ? student.name.slice(0, 2).toUpperCase() : 'ST';
  page.drawText(inits, { x: pX + 14, y: pY + 23, size: 12, font: bold, color: rgb(0.08, 0.25, 0.5) });

  const tX = x + 58;
  let tY = y + 82;
  page.drawText(`Name: ${(student?.name || 'STUDENT').toUpperCase()}`, { x: tX, y: tY, size: 7.5, font: bold, color: rgb(0.1, 0.1, 0.1) });
  tY -= 10;
  page.drawText(`Father: ${student?.father_name || '—'}`, { x: tX, y: tY, size: 6.5, font: regular, color: rgb(0.25, 0.25, 0.25) });
  tY -= 10;
  const grName = student?.current_grade?.name || 'Grade 10';
  page.drawText(`Class: ${grName.replace(/^class\s*/i, '')} (${student?.current_section || 'A'})`, { x: tX, y: tY, size: 6.5, font: bold, color: rgb(0.08, 0.25, 0.5) });
  tY -= 10;
  page.drawText(`GR #: ${student?.gr_number || '1001'}`, { x: tX, y: tY, size: 6.5, font: bold, color: rgb(0.1, 0.1, 0.1) });
  tY -= 10;
  page.drawText(`Emergency: ${student?.emergency_contact_number || student?.contact_number || '—'}`, { x: tX, y: tY, size: 6, font: regular, color: rgb(0.3, 0.3, 0.3) });

  if (qrImage) {
    page.drawImage(qrImage, { x: x + 210, y: y + 36, width: 42, height: 42 });
    page.drawText('Scan ID', { x: x + 218, y: y + 28, size: 5, font: bold, color: rgb(0.4, 0.4, 0.4) });
  }

  page.drawRectangle({ x: x + 1, y: y + 1, width: width - 2, height: 11, color: rgb(0.85, 0.68, 0.15) });
  page.drawText('OFFICIAL STUDENT IDENTITY CARD', { x: x + (width / 2) - 48, y: y + 4, size: 5.5, font: bold, color: rgb(0.1, 0.1, 0.1) });
};

const generateStudentCardsPdf = async (students, options = {}) => {
  const { baseUrl } = options;
  const pdfDoc = await PDFDocument.create();
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fonts = { bold, regular };

  const chunks = chunkArray(students, 8);
  for (const chunk of chunks) {
    const qrImages = await Promise.all(
      chunk.map(async (s) => {
        const dataUrl = await generateStudentQrPng(s, baseUrl);
        if (dataUrl) return await pdfDoc.embedPng(dataUrl);
        return null;
      })
    );
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    chunk.forEach((st, idx) => {
      const coords = getCardCoordinates(idx);
      drawStudentCardNode(page, coords, st, fonts, qrImages[idx], options);
    });
  }

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
};

module.exports = { generateStudentCardsPdf };
