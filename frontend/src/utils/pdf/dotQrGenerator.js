import QRCode from 'qrcode';

const qrCache = new Map();

function isInFinder(row, col, size) {
  return (
    (row < 7 && col < 7) ||
    (row < 7 && col >= size - 7) ||
    (row >= size - 7 && col < 7)
  );
}

export const generateDotQrPng = async (url, size = 180) => {
  if (!url) return null;
  const cacheKey = `${url}_${size}`;
  if (qrCache.has(cacheKey)) return qrCache.get(cacheKey);

  if (typeof document !== 'undefined') {
    try {
      const qrData = QRCode.create(url, { errorCorrectionLevel: 'M' });
      const moduleCount = qrData.modules.size;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const moduleSize = size / moduleCount;
      const circleRadius = moduleSize * 0.333;
      const finderSize = 7 * moduleSize;
      const innerPadding = moduleSize;
      const innerWhiteSize = 5 * moduleSize;
      const innerBlackSize = 3 * moduleSize;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      const finders = [
        [0, 0],
        [0, moduleCount - 7],
        [moduleCount - 7, 0]
      ];

      const drawRoundRect = (x, y, w, h, radius, fill) => {
        ctx.fillStyle = fill;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, w, h, radius);
        } else {
          ctx.rect(x, y, w, h);
        }
        ctx.fill();
      };

      finders.forEach(([r, c]) => {
        const x = c * moduleSize;
        const y = r * moduleSize;
        drawRoundRect(x, y, finderSize, finderSize, 6, '#0f172a');
        drawRoundRect(x + innerPadding, y + innerPadding, innerWhiteSize, innerWhiteSize, 4, '#ffffff');
        drawRoundRect(x + innerPadding * 2, y + innerPadding * 2, innerBlackSize, innerBlackSize, 2, '#0f172a');
      });

      ctx.fillStyle = '#0f172a';
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if (qrData.modules.get(r, c) && !isInFinder(r, c, moduleCount)) {
            ctx.beginPath();
            ctx.arc((c + 0.5) * moduleSize, (r + 0.5) * moduleSize, circleRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      const dataUrl = canvas.toDataURL('image/png');
      qrCache.set(cacheKey, dataUrl);
      return dataUrl;
    } catch {}
  }

  try {
    const dataUrl = await QRCode.toDataURL(url, { margin: 1, width: 140, errorCorrectionLevel: 'M' });
    qrCache.set(cacheKey, dataUrl);
    return dataUrl;
  } catch {
    return null;
  }
};
