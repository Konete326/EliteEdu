import JSZip from 'jszip';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { generateTeacherCardsPdfBytes } from './teacherCardPdfExporter';
import { drawTeacherCardFront } from './teacherCardFrontPdf';
import { drawTeacherCardBack } from './teacherCardBackPdf';
import { generateStaffVerifyUrl } from '../idCardCodeGenerator';

const generateQrPng = async (url) => {
  try {
    return await QRCode.toDataURL(url, { margin: 1, width: 140, errorCorrectionLevel: 'M' });
  } catch {
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
    institution = {}
  } = options;

  if (!teachers || teachers.length === 0) return false;

  const zip = new JSZip();
  const individualFolder = zip.folder('Individual_Cards_PDF');

  const cardWidth = orientation === 'vertical' ? 153 : 243;
  const cardHeight = orientation === 'vertical' ? 243 : 153;

  for (let i = 0; i < teachers.length; i++) {
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
    if (teacher?.photo_url) {
      try {
        const res = await fetch(teacher.photo_url);
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
  }

  const batchPdfBytes = await generateTeacherCardsPdfBytes(teachers, options);
  if (batchPdfBytes) {
    zip.file('All_Cards_A4_Batch_Print_Sheet.pdf', batchPdfBytes);
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
      const sr = String(idx + 1).padEnd(4);
      const code = String(t.employee_code || t.personal_id || '—').padEnd(11);
      const name = String(t.name || '—').slice(0, 30).padEnd(30);
      const desig = String(t.designation || 'Staff').slice(0, 20).padEnd(20);
      const blood = String(t.blood_group || '—').padEnd(5);
      return `${sr} | ${code} | ${name} | ${desig} | ${blood}`;
    }),
    '================================================================================',
    'NOTES FOR PRINTING VENDOR:',
    '1. High-resolution individual CR80 PDF files are inside the "Individual_Cards_PDF" folder.',
    '2. "All_Cards_A4_Batch_Print_Sheet.pdf" can be used for multi-card A4 tray/sheet printing.',
    '3. Barcodes and QR codes contain automated verification URLs encoded at 300+ DPI.',
    '================================================================================'
  ].join('\n');

  zip.file('Printing_Vendor_Manifest.txt', manifestLines);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  const campusSlug = sanitize(campusName);
  a.download = `${campusSlug}_Faculty_ID_Cards_Vendor_Package.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
  return true;
};