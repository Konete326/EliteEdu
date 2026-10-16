import { PDFDocument, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { A4_WIDTH, A4_HEIGHT, getCardCoordinates, getMirroredBackCoordinates, chunkArray } from './teacherCardPdfLayout';
import { drawTeacherCardFront } from './teacherCardFrontPdf';
import { drawTeacherCardBack } from './teacherCardBackPdf';
import { generateStaffVerifyUrl } from '../idCardCodeGenerator';

const generateQrPng = async (url) => {
  try {
    return await QRCode.toDataURL(url, { margin: 1, width: 140, errorCorrectionLevel: 'M' });
  } catch (e) {
    return null;
  }
};

export const exportTeacherCardsPdf = async (teachers, options = {}) => {
  const { sideMode = 'both', style = 'GovtSindh' } = options;
  if (!teachers || teachers.length === 0) return false;

  const pdfDoc = await PDFDocument.create();
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const mono = await pdfDoc.embedFont(StandardFonts.CourierBold);
  const fonts = { bold, regular, mono };

  const chunks = chunkArray(teachers, 8);

  for (const chunk of chunks) {
    const qrImages = await Promise.all(
      chunk.map(async (t) => {
        const verifyUrl = generateStaffVerifyUrl(t._id);
        const dataUrl = await generateQrPng(verifyUrl);
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

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `Staff_Service_Cards_A4_${Date.now()}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
  return true;
};
