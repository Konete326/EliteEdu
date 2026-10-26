import JSZip from 'jszip';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { generateTeacherCardsPdfBytes } from './teacherCardPdfExporter';
import { drawTeacherCardFront } from './teacherCardFrontPdf';
import { drawTeacherCardBack } from './teacherCardBackPdf';
import { generateStaffVerifyUrl } from '../idCardCodeGenerator';

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
  if (!resolved || resolved.startsWith('data:')) return null;
  if (imageCache.has(resolved)) return imageCache.get(resolved);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 800);
    const res = await fetch(resolved, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) {
      imageCache.set(resolved, null);
      return null;
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      imageCache.set(resolved, null);
      return null;
    }
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    if (!isImageBuffer(bytes)) {
      imageCache.set(resolved, null);
      return null;
    }
    imageCache.set(resolved, bytes);
    return bytes;
  } catch {
    imageCache.set(resolved, null);
    return null;
  }
};

const sanitize = (str) => String(str || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_');

export const exportTeacherCardsZip = async (teachers, options = {}) => {
  const {
    sideMode = 'both',
    style = 'template_1_curve_blue',
    orientation = 'vertical',
    accentColor = '#003B73',
    institution = {},
    onProgress
  } = options;

  if (!teachers || teachers.length === 0) return false;

  const total = teachers.length;
  if (onProgress) {
    onProgress({ current: 0, total, percent: 3, stage: 'photos' });
  }

  const zip = new JSZip();
  const individualFolder = zip.folder('Individual_Cards_PDF');

  const cardWidth = orientation === 'vertical' ? 153 : 243;
  const cardHeight = orientation === 'vertical' ? 243 : 153;

  const photoBuffers = new Array(total);
  const BATCH_CONCURRENCY = 8;
  for (let i = 0; i < total; i += BATCH_CONCURRENCY) {
    const slice = teachers.slice(i, i + BATCH_CONCURRENCY);
    const results = await Promise.all(
      slice.map((t) => (t?.photo_url ? fetchImageBytes(t.photo_url) : Promise.resolve(null)))
    );
    results.forEach((buf, idx) => {
      photoBuffers[i + idx] = buf;
    });
    if (onProgress) {
      const p = Math.min(8, Math.round((i / total) * 8));
      onProgress({ current: i, total, percent: p, stage: 'photos' });
    }
    await new Promise((r) => setTimeout(r, 0));
  }

  if (onProgress) {
    onProgress({ current: 0, total, percent: 8, stage: 'cards' });
  }

  for (let i = 0; i < total; i++) {
    try {
      const teacher = teachers[i];
      const doc = await PDFDocument.create();
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);
      const regular = await doc.embedFont(StandardFonts.Helvetica);
      const mono = await doc.embedFont(StandardFonts.CourierBold);
      const fonts = { bold, regular, mono };

      const verifyUrl = generateStaffVerifyUrl(teacher._id || teacher.employee_code);
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
        drawTeacherCardFront(frontPage, { x: 0, y: 0, width: cardWidth, height: cardHeight }, teacher, fonts, {
          style,
          orientation,
          accentColor,
          institution,
          qrImage,
          photoImage,
          sideMode
        });
      }

      if (sideMode === 'both' || sideMode === 'back') {
        const backPage = doc.addPage([cardWidth, cardHeight]);
        drawTeacherCardBack(backPage, { x: 0, y: 0, width: cardWidth, height: cardHeight }, teacher, fonts, qrImage, {
          style,
          orientation,
          accentColor,
          institution
        });
      }

      const cardBytes = await doc.save();
      const code = sanitize(teacher.employee_code || teacher.personal_id || `STAFF_${i + 1}`);
      const name = sanitize(teacher.name || 'Member');
      individualFolder.file(`${code}_${name}_ID_Card.pdf`, cardBytes);
    } catch (e) {
      console.error(e);
    }

    if (i % 6 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }

    if (onProgress) {
      const current = i + 1;
      const percent = Math.min(92, Math.round(8 + (current / total) * 82));
      onProgress({ current, total, percent, stage: 'cards' });
    }
  }

  try {
    const batchPdfBytes = await generateTeacherCardsPdfBytes(teachers, options);
    if (batchPdfBytes) {
      zip.file('All_Cards_A4_Batch_Print_Sheet.pdf', batchPdfBytes);
    }
  } catch (err) {
    console.error(err);
  }

  if (onProgress) {
    onProgress({ current: total, total, percent: 93, stage: 'compressing' });
  }

  const instName = institution.institutionName || 'Elite Educational System';
  const campusName = institution.campusName || 'Main Campus';
  const dateStr = new Date().toLocaleString();

  const manifestLines = [
    '================================================================================',
    '                   ELITE ERP - FACULTY PVC ID CARDS PRINT MANIFEST              ',
    '================================================================================',
    `Institution: ${instName}`,
    `Campus:      ${campusName}`,
    `Date & Time: ${dateStr}`,
    `Total Cards: ${teachers.length} Staff Member(s)`,
    `Card Format: Standard CR80 PVC (ISO/IEC 7810 ID-1)`,
    `Dimensions:  85.60 mm x 53.98 mm (3.370 in x 2.125 in)`,
    `Orientation: ${orientation === 'vertical' ? 'Vertical (Portrait)' : 'Horizontal (Landscape)'}`,
    `Print Mode:  ${sideMode === 'both' ? 'Double Sided (Front & Back)' : sideMode === 'front' ? 'Single Sided (Front Only)' : 'Back Only'}`,
    `Theme Color: ${accentColor}`,
    '--------------------------------------------------------------------------------',
    'STAFF MEMBERS DIRECTORY:',
    '--------------------------------------------------------------------------------',
    'SR#  | EMP CODE    | NAME                           | DESIGNATION          | BLOOD',
    '--------------------------------------------------------------------------------',
    ...teachers.map((t, idx) => {
      const sr = String(idx + 1).padStart(4, ' ');
      const emp = String(t.employee_code || t.personal_id || '—').padEnd(11, ' ');
      const name = String(t.name || '—').padEnd(30, ' ').slice(0, 30);
      const des = String(t.designation || 'Staff').padEnd(20, ' ').slice(0, 20);
      const bld = String(t.blood_group || '—').padEnd(5, ' ');
      return `${sr} | ${emp} | ${name} | ${des} | ${bld}`;
    }),
    '================================================================================'
  ];

  zip.file('VENDOR_FACULTY_MANIFEST.txt', manifestLines.join('\n'));

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
  const filename = customName || `Faculty_ID_Cards_Vendor_Package_${Date.now()}.zip`;
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
