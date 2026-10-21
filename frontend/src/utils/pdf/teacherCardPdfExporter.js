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

export const generateTeacherCardsPdfBytes = async (teachers, options = {}) => {
  const {
    sideMode = 'both',
    style = 'template_1_curve_blue',
    orientation = 'vertical',
    accentColor = '#003B73',
    institution = {},
  } = options;

  if (!teachers || teachers.length === 0) return null;

  const pdfDoc = await PDFDocument.create();
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const mono = await pdfDoc.embedFont(StandardFonts.CourierBold);
  const fonts = { bold, regular, mono };

  const chunkSize = orientation === 'horizontal' ? 6 : 3;
  const chunks = chunkArray(teachers, chunkSize);

  for (const chunk of chunks) {
    const qrImages = await Promise.all(
      chunk.map(async (t) => {
        const verifyUrl = generateStaffVerifyUrl(t._id || t.employee_code);
        const dataUrl = await generateQrPng(verifyUrl);
        if (dataUrl) return await pdfDoc.embedPng(dataUrl);
        return null;
      })
    );

    const photoImages = await Promise.all(
      chunk.map(async (t) => {
        if (!t?.photo_url) return null;
        try {
          const res = await fetch(t.photo_url);
          if (!res.ok) return null;
          const buf = await res.arrayBuffer();
          const bytes = new Uint8Array(buf);
          try {
            return await pdfDoc.embedJpg(bytes);
          } catch (e1) {
            return await pdfDoc.embedPng(bytes);
          }
        } catch (e) {
          return null;
        }
      })
    );

    if (sideMode === 'both' || sideMode === 'front') {
      const frontPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      chunk.forEach((teacher, idx) => {
        const coords = getCardCoordinates(idx, orientation);
        drawTeacherCardFront(frontPage, coords, teacher, fonts, {
          style,
          orientation,
          accentColor,
          institution,
          qrImage: qrImages[idx],
          photoImage: photoImages[idx],
          sideMode,
        });
      });
    }

    if (sideMode === 'both' || sideMode === 'back') {
      const backPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      chunk.forEach((teacher, idx) => {
        const coords = sideMode === 'both'
          ? getMirroredBackCoordinates(idx, orientation)
          : getCardCoordinates(idx, orientation);
        drawTeacherCardBack(backPage, coords, teacher, fonts, qrImages[idx], {
          style,
          orientation,
          accentColor,
          institution,
        });
      });
    }
  }

  return await pdfDoc.save();
};

export const exportTeacherCardsPdf = async (teachers, options = {}) => {
  const pdfBytes = await generateTeacherCardsPdfBytes(teachers, options);
  if (!pdfBytes) return false;
  const orientation = options.orientation || 'vertical';
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `Faculty_ID_Cards_${orientation}_${Date.now()}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
  return true;
};
