import QRCode from 'qrcode';
import { packStaffOfflinePayload, packStudentOfflinePayload } from './idCardOfflinePayload';

const DEPLOYED_BASE_URL = 'https://elitedev-edu.vercel.app';
const qrCache = new Map();
const barcodeCache = new Map();

export const generateStudentVerifyUrl = (student) => {
  const studentId = typeof student === 'object' ? student?._id : student;
  const baseUrl = `${DEPLOYED_BASE_URL}/verify/student/${studentId}`;

  if (typeof student === 'object') {
    const offline = packStudentOfflinePayload(student);
    if (offline) return `${baseUrl}?offline=${offline}`;
  }
  return baseUrl;
};

export const generateStaffVerifyUrl = (staff) => {
  const staffId = typeof staff === 'object' ? staff?._id : staff;
  const baseUrl = `${DEPLOYED_BASE_URL}/verify/staff/${staffId}`;

  if (typeof staff === 'object') {
    const offline = packStaffOfflinePayload(staff);
    if (offline) return `${baseUrl}?offline=${offline}`;
  }
  return baseUrl;
};

const CODE39_PATTERNS = {
  '0': '101001101101', '1': '110100101011', '2': '101100101011',
  '3': '110110010101', '4': '101001101011', '5': '110100110101',
  '6': '101100110101', '7': '101001011011', '8': '110100101101',
  '9': '101100101101', '-': '100101011011', '*': '100101101101'
};

export const renderSvgBarcode = (value = '10001', width = 90, height = 22) => {
  const cacheKey = `${value}_${width}_${height}`;
  if (barcodeCache.has(cacheKey)) {
    return barcodeCache.get(cacheKey);
  }

  const clean = String(value).toUpperCase().replace(/[^0-9A-Z-]/g, '') || '0';
  const encoded = `*${clean}*`;
  let bitString = '';
  for (const ch of encoded) {
    bitString += (CODE39_PATTERNS[ch] || CODE39_PATTERNS['0']) + '0';
  }
  const totalBits = bitString.length;
  const barWidth = width / totalBits;

  const result = (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0 overflow-visible">
      {bitString.split('').map((bit, idx) => {
        if (bit !== '1') return null;
        return (
          <rect
            key={idx}
            x={idx * barWidth}
            y={0}
            width={barWidth * 0.95}
            height={height}
            fill="currentColor"
          />
        );
      })}
    </svg>
  );

  barcodeCache.set(cacheKey, result);
  return result;
};

export const formatBpsGrade = (grade) => {
  if (!grade) return '';
  const num = String(grade).replace(/^BPS[-_\s]*/i, '').trim();
  return num ? `(BPS-${num})` : '';
};

function isInFinder(row, col, size) {
  return (
    (row < 7 && col < 7) ||
    (row < 7 && col >= size - 7) ||
    (row >= size - 7 && col < 7)
  );
}

export const renderSvgQrCode = (url, size = 52, options = {}) => {
  const targetUrl = url || DEPLOYED_BASE_URL;
  const fgColor = options.fgColor || 'currentColor';
  const bgColor = options.bgColor || '#ffffff';
  const cacheKey = `${targetUrl}_${size}_${fgColor}_${bgColor}`;
  if (qrCache.has(cacheKey)) {
    return qrCache.get(cacheKey);
  }

  try {
    const qr = QRCode.create(targetUrl, { errorCorrectionLevel: 'M' });
    const moduleCount = qr.modules.size;
    const moduleSize = size / moduleCount;
    const circleRadius = moduleSize * 0.333;

    const finderPositions = [
      [0, 0],
      [0, moduleCount - 7],
      [moduleCount - 7, 0]
    ];

    const finderSize = 7 * moduleSize;
    const innerPadding = moduleSize;
    const innerWhiteSize = 5 * moduleSize;
    const innerBlackSize = 3 * moduleSize;

    const outerRx = Math.min(12, finderSize * 0.28);
    const innerRx = Math.min(8, innerWhiteSize * 0.28);
    const centerRx = Math.min(3, innerBlackSize * 0.28);
    const bgRx = Math.min(12, size * 0.08);

    const circles = [];

    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (qr.modules.get(r, c) && !isInFinder(r, c, moduleCount)) {
          circles.push(
            <circle
              key={`${r}-${c}`}
              cx={(c + 0.5) * moduleSize}
              cy={(r + 0.5) * moduleSize}
              r={circleRadius}
              fill={fgColor}
            />
          );
        }
      }
    }

    const result = (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shrink-0 text-ink dark:text-ink-dark print:text-black overflow-hidden"
      >
        {bgColor && bgColor !== 'transparent' && (
          <rect width={size} height={size} fill={bgColor} rx={bgRx} ry={bgRx} />
        )}
        {finderPositions.map(([r, c]) => {
          const x = c * moduleSize;
          const y = r * moduleSize;
          return (
            <g key={`finder-${r}-${c}`}>
              <rect
                x={x}
                y={y}
                width={finderSize}
                height={finderSize}
                fill={fgColor}
                rx={outerRx}
                ry={outerRx}
              />
              <rect
                x={x + innerPadding}
                y={y + innerPadding}
                width={innerWhiteSize}
                height={innerWhiteSize}
                fill={bgColor && bgColor !== 'transparent' ? bgColor : '#ffffff'}
                rx={innerRx}
                ry={innerRx}
              />
              <rect
                x={x + innerPadding * 2}
                y={y + innerPadding * 2}
                width={innerBlackSize}
                height={innerBlackSize}
                fill={fgColor}
                rx={centerRx}
                ry={centerRx}
              />
            </g>
          );
        })}
        {circles}
      </svg>
    );

    qrCache.set(cacheKey, result);
    return result;
  } catch (err) {
    return (
      <div className="w-8 h-8 bg-surface-secondary flex items-center justify-center text-[7px] font-mono">
        QR
      </div>
    );
  }
};
