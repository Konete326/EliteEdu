import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';

const parseHexColor = (hex, fallback = { r: 0.71, g: 0.58, b: 0.29 }) => {
  if (!hex || typeof hex !== 'string') return rgb(fallback.r, fallback.g, fallback.b);
  const clean = hex.replace('#', '').trim();
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    return rgb(r, g, b);
  }
  return rgb(fallback.r, fallback.g, fallback.b);
};

const wrapText = (text, maxWidth, font, size) => {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, size);
    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
};

export const generateCertificatePdfBytes = async (data = {}) => {
  const {
    certificateNo = 'CERT-2026-0001',
    heading = 'CERTIFICATE OF MERIT',
    subHeading = 'THIS IS TO CERTIFY THAT',
    schoolName = 'ELITE EDUCATIONAL SYSTEM',
    slogan = 'Excellence in Education',
    campusName = '',
    recipientName = 'Recipient Name',
    fatherName = '',
    identifierCode = '',
    classOrDesignation = '',
    bodyText = '',
    issueDate = new Date().toISOString().split('T')[0],
    orientation = 'landscape',
    designStyle = 'academic_gold_hatch',
    accentColor = '#b59449',
    signatoryTitle1 = 'Teacher In-Charge',
    signatoryTitle2 = 'Principal / Head of Institution',
    showStamp = true,
    showQr = true,
    verifyUrl = ''
  } = data;

  const isPortrait = orientation === 'portrait';
  const width = isPortrait ? 595.28 : 841.89;
  const height = isPortrait ? 841.89 : 595.28;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([width, height]);

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontTimesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontTimesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const themeRgb = parseHexColor(accentColor, { r: 0.71, g: 0.58, b: 0.29 });
  const darkRgb = rgb(0.1, 0.12, 0.15);
  const mutedRgb = rgb(0.38, 0.42, 0.48);
  const borderBgRgb = rgb(0.99, 0.99, 0.99);

  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: borderBgRgb
  });

  const m1 = 18;
  page.drawRectangle({
    x: m1,
    y: m1,
    width: width - m1 * 2,
    height: height - m1 * 2,
    borderColor: themeRgb,
    borderWidth: 4,
    color: rgb(1, 1, 1)
  });

  const m2 = 24;
  page.drawRectangle({
    x: m2,
    y: m2,
    width: width - m2 * 2,
    height: height - m2 * 2,
    borderColor: themeRgb,
    borderWidth: 1
  });

  const cornerSize = 14;
  const corners = [
    { x: m2, y: m2 },
    { x: width - m2 - cornerSize, y: m2 },
    { x: m2, y: height - m2 - cornerSize },
    { x: width - m2 - cornerSize, y: height - m2 - cornerSize }
  ];
  corners.forEach((c) => {
    page.drawRectangle({
      x: c.x,
      y: c.y,
      width: cornerSize,
      height: cornerSize,
      color: themeRgb
    });
  });

  let topCursor = height - 60;

  const displaySchool = schoolName.toUpperCase();
  const schoolSize = isPortrait ? 18 : 22;
  const schoolW = fontBold.widthOfTextAtSize(displaySchool, schoolSize);
  page.drawText(displaySchool, {
    x: (width - schoolW) / 2,
    y: topCursor,
    size: schoolSize,
    font: fontBold,
    color: darkRgb
  });

  topCursor -= 16;
  const subLine = [campusName, slogan].filter(Boolean).join(' • ');
  if (subLine) {
    const subSize = 10;
    const subW = fontOblique.widthOfTextAtSize(subLine, subSize);
    page.drawText(subLine, {
      x: (width - subW) / 2,
      y: topCursor,
      size: subSize,
      font: fontOblique,
      color: themeRgb
    });
  }

  topCursor -= isPortrait ? 36 : 30;
  const certTitle = (heading || 'CERTIFICATE OF MERIT').toUpperCase();
  const titleSize = isPortrait ? 20 : 24;
  const titleW = fontTimesBold.widthOfTextAtSize(certTitle, titleSize);
  page.drawText(certTitle, {
    x: (width - titleW) / 2,
    y: topCursor,
    size: titleSize,
    font: fontTimesBold,
    color: themeRgb
  });

  topCursor -= 18;
  const subHead = (subHeading || 'THIS IS PROUDLY PRESENTED TO').toUpperCase();
  const subHeadSize = 9;
  const subHeadW = fontBold.widthOfTextAtSize(subHead, subHeadSize);
  page.drawText(subHead, {
    x: (width - subHeadW) / 2,
    y: topCursor,
    size: subHeadSize,
    font: fontBold,
    color: mutedRgb
  });

  topCursor -= isPortrait ? 40 : 34;
  const recipient = (recipientName || 'RECIPIENT NAME').toUpperCase();
  const recSize = isPortrait ? 24 : 28;
  const recW = fontTimesBold.widthOfTextAtSize(recipient, recSize);
  page.drawText(recipient, {
    x: (width - recW) / 2,
    y: topCursor,
    size: recSize,
    font: fontTimesBold,
    color: darkRgb
  });

  const lineW = Math.min(width - 160, Math.max(recW + 60, 240));
  page.drawLine({
    start: { x: (width - lineW) / 2, y: topCursor - 6 },
    end: { x: (width + lineW) / 2, y: topCursor - 6 },
    thickness: 1.5,
    color: themeRgb
  });

  topCursor -= 24;
  const idBits = [];
  if (fatherName) idBits.push(`S/D/W of: ${fatherName}`);
  if (identifierCode) idBits.push(`Code / GR: ${identifierCode}`);
  if (classOrDesignation) idBits.push(classOrDesignation);
  const idLine = idBits.join('   |   ');
  if (idLine) {
    const idSize = 10;
    const idW = fontRegular.widthOfTextAtSize(idLine, idSize);
    page.drawText(idLine, {
      x: (width - idW) / 2,
      y: topCursor,
      size: idSize,
      font: fontRegular,
      color: mutedRgb
    });
  }

  topCursor -= isPortrait ? 30 : 24;
  const maxBodyW = width - (isPortrait ? 100 : 160);
  const bodySize = isPortrait ? 11 : 12;
  const bodyLines = wrapText(bodyText, maxBodyW, fontRegular, bodySize);
  const lineSpacing = 16;
  bodyLines.forEach((line) => {
    const w = fontRegular.widthOfTextAtSize(line, bodySize);
    page.drawText(line, {
      x: (width - w) / 2,
      y: topCursor,
      size: bodySize,
      font: fontRegular,
      color: darkRgb
    });
    topCursor -= lineSpacing;
  });

  const bottomY = 70;

  const dateBlockX = 60;
  page.drawLine({
    start: { x: dateBlockX, y: bottomY + 14 },
    end: { x: dateBlockX + 130, y: bottomY + 14 },
    thickness: 1,
    color: mutedRgb
  });
  const dateTxt = `Date: ${issueDate}`;
  page.drawText(dateTxt, {
    x: dateBlockX,
    y: bottomY + 20,
    size: 10,
    font: fontBold,
    color: darkRgb
  });
  page.drawText(signatoryTitle1.toUpperCase(), {
    x: dateBlockX,
    y: bottomY,
    size: 8,
    font: fontBold,
    color: mutedRgb
  });

  if (showStamp) {
    const stampX = width / 2;
    page.drawCircle({
      x: stampX,
      y: bottomY + 15,
      size: 30,
      borderColor: themeRgb,
      borderWidth: 2,
      color: rgb(1, 1, 1)
    });
    const sealTxt = 'OFFICIAL SEAL';
    const sealW = fontBold.widthOfTextAtSize(sealTxt, 6.5);
    page.drawText(sealTxt, {
      x: stampX - sealW / 2,
      y: bottomY + 12,
      size: 6.5,
      font: fontBold,
      color: themeRgb
    });
  }

  const signBlockX = width - 190;
  page.drawLine({
    start: { x: signBlockX, y: bottomY + 14 },
    end: { x: signBlockX + 130, y: bottomY + 14 },
    thickness: 1,
    color: mutedRgb
  });
  const signTxt = signatoryTitle2.toUpperCase();
  page.drawText(signTxt, {
    x: signBlockX,
    y: bottomY,
    size: 8,
    font: fontBold,
    color: mutedRgb
  });

  if (showQr && verifyUrl) {
    try {
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        margin: 1,
        width: 140,
        errorCorrectionLevel: 'M'
      });
      if (qrDataUrl) {
        const qrBase64 = qrDataUrl.split(',')[1];
        const qrBytes = Uint8Array.from(atob(qrBase64), (c) => c.charCodeAt(0));
        const qrImg = await pdfDoc.embedPng(qrBytes);
        const qrDim = 46;
        const qrX = width / 2 - qrDim / 2;
        const qrY = bottomY - 34;
        page.drawImage(qrImg, {
          x: qrX,
          y: qrY,
          width: qrDim,
          height: qrDim
        });
        const qrCaption = 'VERIFIABLE CREDENTIAL';
        const capW = fontBold.widthOfTextAtSize(qrCaption, 6);
        page.drawText(qrCaption, {
          x: (width - capW) / 2,
          y: qrY - 7,
          size: 6,
          font: fontBold,
          color: mutedRgb
        });
      }
    } catch {}
  }

  const certNoTxt = `Serial: ${certificateNo}`;
  page.drawText(certNoTxt, {
    x: 40,
    y: 32,
    size: 8,
    font: fontBold,
    color: themeRgb
  });

  const footerBrand = 'Powered by EliteEdu Institutional System';
  const brandW = fontRegular.widthOfTextAtSize(footerBrand, 8);
  page.drawText(footerBrand, {
    x: width - 40 - brandW,
    y: 32,
    size: 8,
    font: fontRegular,
    color: mutedRgb
  });

  return await pdfDoc.save();
};

export const exportCertificatePdf = async (data = {}) => {
  const bytes = await generateCertificatePdfBytes(data);
  if (!bytes) return;
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const filename = `Certificate-${data.certificateNo || 'credential'}.pdf`;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
};