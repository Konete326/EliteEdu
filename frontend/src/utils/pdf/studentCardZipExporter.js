import JSZip from 'jszip';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { generateStudentCardsPdfBytes } from './studentCardPdfExporter';
import { drawStudentCard } from './studentCardPdfRenderer';
import { drawTeacherCardBack } from './teacherCardBackPdf';
import { generateStudentVerifyUrl } from '../idCardCodeGenerator';

const generateQrPng = async (url) => {
  try {
    return await QRCode.toDataURL(url, { margin: 1, width: 140, errorCorrectionLevel: 'M' });
  } catch {
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
    institution = {}
  } = options;

  if (!students || students.length === 0) return false;

  const zip = new JSZip();
  const individualFolder = zip.folder('Individual_Cards_PDF');

  const cardWidth = orientation === 'vertical' ? 153 : 243;
  const cardHeight = orientation === 'vertical' ? 243 : 153;

  for (let i = 0; i < students.length; i++) {
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
    if (student?.photo_url) {
      try {
        const res = await fetch(student.photo_url);
        if (res.ok) {
          const buf = await res.arrayBuffer();
          const bytes = new Uint8Array(buf);
          try {
            photoImage = await doc.embedJpg(bytes);
          } catch {
            photoImage = await doc.embedPng(bytes);
          }
        }
      } catch {}
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
      drawTeacherCardBack(backPage, { x: 0, y: 0, width: cardWidth, height: cardHeight }, student, fonts, qrImage, {
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
  }

  const batchPdfBytes = await generateStudentCardsPdfBytes(students, options);
  if (batchPdfBytes) {
    zip.file('All_Cards_A4_Batch_Print_Sheet.pdf', batchPdfBytes);
  }

  const instName = institution.institutionName || 'Elite Educational System';
  const campusName = institution.campusName || 'Main Campus';
  const dateStr = new Date().toLocaleString();

  const manifest = [
    '====================================================================',
    ' ELITE EDUCATION SYSTEM — STUDENT ID CARD VENDOR PRINTING MANIFEST',
    '====================================================================',
    `Generated At      : ${dateStr}`,
    `Institution Name  : ${instName}`,
    `Campus / Branch   : ${campusName}`,
    `Total Cards       : ${students.length}`,
    `Card Format       : Standard CR80 PVC (85.60 mm x 53.98 mm)`,
    `Orientation       : ${orientation.toUpperCase()}`,
    `Printing Side     : ${sideMode.toUpperCase()}`,
    `Template Theme    : ${style}`,
    `Primary Accent Hex: ${accentColor}`,
    '--------------------------------------------------------------------',
    'PRINTING SPECIFICATIONS FOR VENDOR / PRESS:',
    '  - Resolution     : 300 DPI or higher',
    '  - PVC Thickness  : 30 mil (0.76 mm) Standard',
    '  - Finish Option  : Gloss Lamination or Matte Satin Overlay',
    '  - Corner Radius  : 3.18 mm (Standard CR80)',
    '  - Barcode / QR   : 100% vector scale, high contrast black',
    '--------------------------------------------------------------------',
    'STUDENT ROSTER INCLUDED IN THIS ARCHIVE:',
    ...students.map((s, idx) => {
      const num = String(idx + 1).padStart(3, ' ');
      const gr = (s.gr_number || '—').padEnd(12, ' ');
      const cls = (s.current_grade?.name || 'Class').padEnd(14, ' ');
      const father = s.father_name ? `(S/O ${s.father_name})` : '';
      return `[${num}] GR: ${gr} | Class: ${cls} | ${s.name} ${father}`;
    }),
    '====================================================================',
    'Package includes:',
    '  1. /Individual_Cards_PDF/ -> Separate ready-to-print CR80 files',
    '  2. All_Cards_A4_Batch_Print_Sheet.pdf -> Consolidated A4 sheet',
    '  3. Printing_Vendor_Manifest.txt -> Job technical specifications',
    '===================================================================='
  ].join('\r\n');

  zip.file('Printing_Vendor_Manifest.txt', manifest);

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const downloadUrl = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  const stamp = new Date().toISOString().slice(0, 10);
  a.download = `Student_ID_Cards_Vendor_Package_${sanitize(campusName)}_${stamp}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
  return true;
};
