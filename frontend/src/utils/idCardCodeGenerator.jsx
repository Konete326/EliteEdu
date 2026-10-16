import QRCode from 'qrcode';
import { packStaffOfflinePayload, packStudentOfflinePayload } from './idCardOfflinePayload';

export const generateStudentVerifyUrl = (student) => {
  const studentId = typeof student === 'object' ? student?._id : student;
  const baseUrl = typeof window !== 'undefined' && window.location?.origin
    ? `${window.location.origin}/verify/student/${studentId}`
    : `https://eliteedu.pk/verify/student/${studentId}`;

  if (typeof student === 'object') {
    const offline = packStudentOfflinePayload(student);
    if (offline) return `${baseUrl}?offline=${offline}`;
  }
  return baseUrl;
};

export const generateStaffVerifyUrl = (staff) => {
  const staffId = typeof staff === 'object' ? staff?._id : staff;
  const baseUrl = typeof window !== 'undefined' && window.location?.origin
    ? `${window.location.origin}/verify/staff/${staffId}`
    : `https://eliteedu.pk/verify/staff/${staffId}`;

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
  const clean = String(value).toUpperCase().replace(/[^0-9A-Z-]/g, '') || '0';
  const encoded = `*${clean}*`;
  let bitString = '';
  for (const ch of encoded) {
    bitString += (CODE39_PATTERNS[ch] || CODE39_PATTERNS['0']) + '0';
  }
  const totalBits = bitString.length;
  const barWidth = width / totalBits;

  return (
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
};

export const renderSvgQrCode = (url, size = 52) => {
  try {
    const qr = QRCode.create(url || 'https://eliteedu.pk', { errorCorrectionLevel: 'M' });
    const moduleCount = qr.modules.size;
    let path = '';
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (qr.modules.get(r, c)) {
          path += `M${c},${r}h1v1h-1z `;
        }
      }
    }
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${moduleCount} ${moduleCount}`}
        className="shrink-0 text-ink dark:text-ink-dark print:text-black"
      >
        <rect width={moduleCount} height={moduleCount} fill="#ffffff" />
        <path d={path} fill="currentColor" />
      </svg>
    );
  } catch (err) {
    return (
      <div className="w-12 h-12 bg-surface-secondary flex items-center justify-center text-[8px] font-mono">
        QR ERR
      </div>
    );
  }
};
