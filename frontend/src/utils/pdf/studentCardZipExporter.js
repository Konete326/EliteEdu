import JSZip from 'jszip';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { generateStudentCardsPdfBytes } from './studentCardPdfExporter';
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

const sanitize = (str) => String(str || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_');

export const exportStudentCardsZip = async (students, options = {}) => {
  const {
    sideMode = 'both',
    style = 'template_1_curve_blue',
    orientation = 'vertical',
    accentColor = '#003B73',
    institution = {},
    onProgress
  } = options;

  if (!students || students.length === 0) return false;

  const total = students.length;
  if (onProgress) {
    onProgress({ current: 0, total, percent: 3, stage: 'photos' });
  }

  const zip = new JSZip();
  const individualFolder = zip.folder('Individual_Cards_PDF');

  const cardWidth = orientation === 'vertical' ? 172 : 260;
  const cardHeight = orientation === 'vertical' ? 275 : 165;

  const photoBuffers = await Promise.all(
    students.map(async (s) => {
      if (!s?.photo_url) return null;
      return await fetchImageBytes(s.photo_url);
    })
  );

  if (onProgress) {
    onProgress({ current: 0, total, percent: 8, stage: 'cards' });
  }

  for (let i = 0; i < total; i++) {
    const student = students[i];
    const doc = await PDFDocument.create();
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const regular = await doc.embedFont(StandardFonts.Helvetica);
    const mono = await doc.embedFont(StandardFonts.CourierBold);
    const fonts = { bold, regular, mono };

    const verifyUrl = generateStudentVerifyUrl(student._id || student.gr_number);
    const qrDataUrl = await generateQrPng(verifyUrl);
    const qrImage = qrDataUrl ? await doc.embedPng(qrDataUrl) : null;

    let photoImage = null;
    const bytes = photoBuffers[i];
    if (bytes) {
      try {
        photoImage = await doc.embedJpg(bytes);
      } catch {
        try {
          photoImage = await doc.embedPng(bytes);
        } catch {}
      }
    }

    if (sideMode === 'both' || sideMode === 'front') {
      const frontPage = doc.addPage([cardWidth, cardHeight]);
      drawStudentCard(frontPage, { x: 0, y: 0, width: cardWidth, height: cardHeight }, student, fonts, qrImage, {
        style,
        orientation,
        accentColor,
        institution,
        photoImage
      });
    }

    if (sideMode === 'both' || sideMode === 'back') {
      const backPage = doc.addPage([cardWidth, cardHeight]);
      drawStudentCardBack(backPage, { x: 0, y: 0, width: cardWidth, height: cardHeight }, student, fonts, qrImage, {
        style,
        orientation,
        accentColor,
        institution
      });
    }

    const cardBytes = await doc.save();
    const code = sanitize(student.gr_number || `STU_${i + 1}`);
    const name = sanitize(student.name || 'Student');
    individualFolder.file(`${code}_${name}_ID_Card.pdf`, cardBytes);

    if (onProgress) {
      const current = i + 1;
      const percent = Math.min(92, Math.round(8 + (current / total) * 82));
      onProgress({ current, total, percent, stage: 'cards' });
    }
  }

  const batchPdfBytes = await generateStudentCardsPdfBytes(students, options);
  if (batchPdfBytes) {
    zip.file('All_Cards_A4_Batch_Print_Sheet.pdf', batchPdfBytes);
  }

  if (onProgress) {
    onProgress({ current: total, total, percent: 93, stage: 'compressing' });
  }

  const instName = institution.institutionName || 'Elite Educational System';
  const campusName = institution.campusName || 'Main Campus';
  const dateStr = new Date().toLocaleString();

  const manifest = [
    '========================================',
    '       STUDENT ID CARDS PRINT MANIFEST   ',
    '========================================',
    `Institution : ${instName}`,
    `Campus      : ${campusName}`,
    `Date Export : ${dateStr}`,
    `Card Format : ${orientation.toUpperCase()}`,
    `Print Mode  : ${sideMode.toUpperCase()}`,
    `Total Cards : ${students.length}`,
    '========================================',
    '',
    'CARD ROSTER:',
    ...students.map((s, idx) => {
      const roll = s.roll_number || '—';
      const gr = s.gr_number || '—';
      const cls = s.current_grade?.name || 'Class';
      const sec = s.current_section || '—';
      return `${String(idx + 1).padStart(3, ' ')}. [GR: ${gr.padEnd(8, ' ')}] ${s.name.padEnd(25, ' ')} | ${cls} (${sec}) | Roll: ${roll}`;
    }),
    '',
    'VENDOR INSTRUCTIONS:',
    '1. Standard PVC Card Dimensions: 54mm x 85.6mm (CR-80).',
    '2. Double-sided printing: Back matches front orientation.',
    '3. Individual PDFs are in the "Individual_Cards_PDF" directory.',
    '4. "All_Cards_A4_Batch_Print_Sheet.pdf" contains 6 cards per A4 page for batch laminating.',
    '========================================'
  ].join('\n');

  zip.file('VENDOR_PRINT_MANIFEST.txt', manifest);

  const zipBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress && metadata.percent) {
      const p = Math.min(99, Math.round(93 + (metadata.percent / 100) * 6));
      onProgress({ current: total, total, percent: p, stage: 'compressing' });
    }
  });

  if (onProgress) {
    onProgress({ current: total, total, percent: 100, stage: 'done' });
  }

  const customName = options.filename;
  const filename = customName || `Student_ID_Cards_Vendor_Package_${Date.now()}.zip`;
  const downloadUrl = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
  return true;
};