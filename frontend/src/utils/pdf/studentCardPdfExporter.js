import { PDFDocument, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { A4_WIDTH, A4_HEIGHT, getCardCoordinates, getMirroredBackCoordinates, chunkArray } from './teacherCardPdfLayout';
import { drawStudentCard } from './studentCardPdfRenderer';
import { drawStudentCardBack } from './studentCardBackPdf';
import { generateStudentVerifyUrl } from '../idCardCodeGenerator';

const qrCache = new Map();
const imageCache = new Map();

const generateQrPng = async (url) => {
  if (!url) return null;
  if (qrCache.has(url)) return qrCache.get(url);
  try {
    const dataUrl = await QRCode.toDataURL(url, { margin: 1, width: 140, errorCorrectionLevel: 'M' });
    qrCache.set(url, dataUrl);
    return dataUrl;
  } catch {
    return null;
  }
};

const fetchImageBytes = async (url) => {
  if (!url || typeof url !== 'string') return null;
  const clean = url.trim();
  if (!clean || clean.startsWith('data:')) return null;
  if (imageCache.has(clean)) return imageCache.get(clean);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1800);
    const res = await fetch(clean, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) {
      imageCache.set(clean, null);
      return null;
    }
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    imageCache.set(clean, bytes);
    return bytes;
  } catch {
    imageCache.set(clean, null);
    return null;
  }
};

export const generateStudentCardsPdfBytes = async (students, options = {}) => {
  const {
    sideMode = 'front',
    style = 'template_1_curve_blue',
    orientation = 'vertical',
    accentColor = '#003B73',
    institution = {}
  } = options;

  if (!students || students.length === 0) return null;

  const pdfDoc = await PDFDocument.create();
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const mono = await pdfDoc.embedFont(StandardFonts.CourierBold);
  const fonts = { bold, regular, mono };

  const chunkSize = 6;
  const chunks = chunkArray(students, chunkSize);

  for (const chunk of chunks) {
    const qrImages = await Promise.all(
      chunk.map(async (s) => {
        const verifyUrl = generateStudentVerifyUrl(s._id || s.gr_number);
        const dataUrl = await generateQrPng(verifyUrl);
        if (dataUrl) return await pdfDoc.embedPng(dataUrl);
        return null;
      })
    );

    const photoImages = await Promise.all(
      chunk.map(async (s) => {
        if (!s?.photo_url) return null;
        const bytes = await fetchImageBytes(s.photo_url);
        if (!bytes) return null;
        try {
          return await pdfDoc.embedJpg(bytes);
        } catch {
          try {
            return await pdfDoc.embedPng(bytes);
          } catch {
            return null;
          }
        }
      })
    );

    if (sideMode === 'both' || sideMode === 'front') {
      const frontPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      chunk.forEach((student, idx) => {
        const coords = getCardCoordinates(idx, orientation);
        drawStudentCard(frontPage, coords, student, fonts, qrImages[idx], {
          style,
          orientation,
          accentColor,
          institution,
          photoImage: photoImages[idx]
        });
      });
    }

    if (sideMode === 'both' || sideMode === 'back') {
      const backPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      chunk.forEach((student, idx) => {
        const coords = sideMode === 'both'
          ? getMirroredBackCoordinates(idx, orientation)
          : getCardCoordinates(idx, orientation);
        drawStudentCardBack(backPage, coords, student, fonts, qrImages[idx], {
          style,
          orientation,
          accentColor,
          institution
        });
      });
    }
  }

  return await pdfDoc.save();
};

export const exportStudentCardsPdf = async (students, options = {}) => {
  const pdfBytes = await generateStudentCardsPdfBytes(students, options);
  if (!pdfBytes) return false;
  const orientation = options.orientation || 'vertical';
  const customName = options.filename;
  const filename = customName || `Student_ID_Cards_${orientation}_${Date.now()}.pdf`;
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
  return true;
};