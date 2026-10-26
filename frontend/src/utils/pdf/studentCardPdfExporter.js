import { PDFDocument, StandardFonts } from 'pdf-lib';
import { A4_WIDTH, A4_HEIGHT, getCardCoordinates, getMirroredBackCoordinates, chunkArray } from './teacherCardPdfLayout';
import { drawStudentCard } from './studentCardPdfRenderer';
import { drawStudentCardBack } from './studentCardBackPdf';
import { generateStudentVerifyUrl } from '../idCardCodeGenerator';
import { generateDotQrPng } from './dotQrGenerator';

const imageCache = new Map();

const resolveImageUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const clean = url.trim();
  if (!clean || clean.startsWith('data:')) return clean;
  if (/^https?:\/\//i.test(clean)) return clean;
  const rawApi = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';
  const backendOrigin = rawApi.replace(/\/api\/?$/, '');
  const base = backendOrigin || (typeof window !== 'undefined' ? window.location.origin : '');
  return clean.startsWith('/') ? `${base}${clean}` : `${base}/${clean}`;
};

const isImageBuffer = (bytes) => {
  if (!bytes || bytes.length < 8) return false;
  const isJpg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  return isJpg || isPng;
};

const fetchImageBytes = async (url) => {
  const resolved = resolveImageUrl(url);
  if (!resolved) return null;
  if (imageCache.has(resolved)) return imageCache.get(resolved);
  try {
    const res = await fetch(resolved);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    if (!isImageBuffer(bytes)) return null;
    imageCache.set(resolved, bytes);
    return bytes;
  } catch {
    return null;
  }
};

export const generateStudentCardsPdfBytes = async (students, options = {}) => {
  if (!students || students.length === 0) return null;

  const orientation = options.orientation || 'vertical';
  const sideMode = options.sideMode || 'front';
  const style = options.style || 'template_1_curve_blue';
  const accentColor = options.accentColor || '#003B73';
  const institution = options.institution || {};
  const chunkSize = 6;
  const chunks = chunkArray(students, chunkSize);

  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const courier = await pdfDoc.embedFont(StandardFonts.Courier);
  const fonts = { regular: helvetica, bold: helveticaBold, mono: courier };

  for (let cIdx = 0; cIdx < chunks.length; cIdx++) {
    const chunk = chunks[cIdx];

    const qrImages = await Promise.all(
      chunk.map(async (student) => {
        const verifyUrl = generateStudentVerifyUrl(student);
        const dataUrl = await generateDotQrPng(verifyUrl);
        if (!dataUrl) return null;
        try {
          const base64 = dataUrl.split(',')[1];
          const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
          return await pdfDoc.embedPng(bytes);
        } catch {
          return null;
        }
      })
    );

    const photoImages = await Promise.all(
      chunk.map(async (student) => {
        const photoUrl = student.photo_url;
        if (!photoUrl) return null;
        const bytes = await fetchImageBytes(photoUrl);
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

    if (cIdx % 3 === 0) {
      await new Promise((r) => setTimeout(r, 0));
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

export const printStudentCardsPdf = async (students, options = {}) => {
  const pdfBytes = await generateStudentCardsPdfBytes(students, options);
  if (!pdfBytes) return false;
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.src = blobUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch {
      window.open(blobUrl, '_blank');
    }
    setTimeout(() => {
      if (document.body.contains(iframe)) document.body.removeChild(iframe);
      URL.revokeObjectURL(blobUrl);
    }, 60000);
  };
  return true;
};
