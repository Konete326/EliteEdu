import { PDFDocument, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { A4_WIDTH, A4_HEIGHT, getCardCoordinates, chunkArray } from './teacherCardPdfLayout';
import { drawStudentCard } from './studentCardPdfRenderer';
import { generateStudentVerifyUrl } from '../idCardCodeGenerator';

const generateQrPng = async (url) => {
  try {
    return await QRCode.toDataURL(url, { margin: 1, width: 140, errorCorrectionLevel: 'M' });
  } catch (e) {
    return null;
  }
};

export const exportStudentCardsPdf = async (students) => {
  if (!students || students.length === 0) return false;

  const pdfDoc = await PDFDocument.create();
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fonts = { bold, regular };

  const chunks = chunkArray(students, 8);
  for (const chunk of chunks) {
    const qrImages = await Promise.all(
      chunk.map(async (s) => {
        const verifyUrl = generateStudentVerifyUrl(s._id);
        const dataUrl = await generateQrPng(verifyUrl);
        if (dataUrl) return await pdfDoc.embedPng(dataUrl);
        return null;
      })
    );

    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    chunk.forEach((student, idx) => {
      const coords = getCardCoordinates(idx);
      drawStudentCard(page, coords, student, fonts, qrImages[idx]);
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `Student_ID_Cards_A4_${Date.now()}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
  return true;
};
