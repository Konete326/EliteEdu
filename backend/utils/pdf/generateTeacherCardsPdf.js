const { PDFDocument, StandardFonts } = require('pdf-lib');
const QRCode = require('qrcode');
const { A4_WIDTH, A4_HEIGHT, getCardCoordinates, getMirroredBackCoordinates, chunkArray } = require('./cardPdfLayout');
const { drawTeacherCardFront, drawTeacherCardBack } = require('./teacherCardPdfRenderer');
const { createSignedOfflinePayload } = require('../cryptoPayload');

const generateTeacherQrPng = async (teacher, baseUrl = 'https://elitedev-edu.vercel.app') => {
  try {
    const payload = {
      id: String(teacher._id),
      n: teacher.name,
      d: teacher.designation || 'Staff',
      b: teacher.bps_grade || '',
      p: teacher.personal_id || teacher.employee_code || '',
      s: teacher.semis_code || '',
      v: teacher.vendor_no || '',
      bg: teacher.blood_group || 'O+',
      ca: teacher.campus_id?.name || 'Main Campus',
      cn: teacher.cnic ? teacher.cnic.slice(-4) : '',
      st: teacher.status || 'Active'
    };
    const signedOffline = createSignedOfflinePayload(payload);
    const verifyUrl = `${baseUrl}/verify/staff/${teacher._id}?offline=${signedOffline}`;
    return await QRCode.toDataURL(verifyUrl, { margin: 1, width: 140, errorCorrectionLevel: 'M' });
  } catch (err) {
    return null;
  }
};

const generateTeacherCardsPdf = async (teachers, options = {}) => {
  const { sideMode = 'both', style = 'GovtSindh', baseUrl } = options;
  const pdfDoc = await PDFDocument.create();
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const mono = await pdfDoc.embedFont(StandardFonts.CourierBold);
  const fonts = { bold, regular, mono };

  const chunks = chunkArray(teachers, 8);
  for (const chunk of chunks) {
    const qrImages = await Promise.all(
      chunk.map(async (t) => {
        const dataUrl = await generateTeacherQrPng(t, baseUrl);
        if (dataUrl) return await pdfDoc.embedPng(dataUrl);
        return null;
      })
    );

    if (sideMode === 'both' || sideMode === 'front') {
      const frontPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      chunk.forEach((teacher, idx) => {
        const coords = getCardCoordinates(idx);
        drawTeacherCardFront(frontPage, coords, teacher, fonts, style);
      });
    }

    if (sideMode === 'both' || sideMode === 'back') {
      const backPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      chunk.forEach((teacher, idx) => {
        const coords = sideMode === 'both' ? getMirroredBackCoordinates(idx) : getCardCoordinates(idx);
        drawTeacherCardBack(backPage, coords, teacher, fonts, qrImages[idx], style);
      });
    }
  }

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
};

module.exports = { generateTeacherCardsPdf };
