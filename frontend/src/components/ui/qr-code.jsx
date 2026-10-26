import * as React from 'react';
import QRCodeLib from 'qrcode';
import { cn } from '@/lib/utils';

function isInFinderPattern(row, col, size) {
  return (
    (row < 7 && col < 7) ||
    (row < 7 && col >= size - 7) ||
    (row >= size - 7 && col < 7)
  );
}

export function QRCode({
  value,
  size = 268,
  fgColor = 'currentColor',
  bgColor = 'transparent',
  errorCorrectionLevel = 'M',
  className,
  ...props
}) {
  const qrData = React.useMemo(() => {
    try {
      if (!value) return null;
      return QRCodeLib.create(value, { errorCorrectionLevel });
    } catch {
      return null;
    }
  }, [value, errorCorrectionLevel]);

  if (!qrData) {
    return null;
  }

  const moduleCount = qrData.modules.size;
  const moduleSize = size / moduleCount;
  const totalSize = size;
  const circleRadius = moduleSize * 0.333;

  const finderPositions = [
    [0, 0],
    [0, moduleCount - 7],
    [moduleCount - 7, 0],
  ];

  const finderSize = 7 * moduleSize;
  const innerPadding = moduleSize;
  const innerWhiteSize = 5 * moduleSize;
  const innerBlackSize = 3 * moduleSize;

  const outerRx = Math.min(12, finderSize * 0.28);
  const innerRx = Math.min(8, innerWhiteSize * 0.28);
  const centerRx = Math.min(3, innerBlackSize * 0.28);
  const bgRx = Math.min(12, totalSize * 0.06);

  const circles = [];

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qrData.modules.get(row, col) && !isInFinderPattern(row, col, moduleCount)) {
        circles.push({
          cx: (col + 0.5) * moduleSize,
          cy: (row + 0.5) * moduleSize,
        });
      }
    }
  }

  return (
    <svg
      width={totalSize}
      height={totalSize}
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`QR code for ${value}`}
      className={cn('block shrink-0', className)}
      {...props}
    >
      {bgColor && bgColor !== 'transparent' && (
        <rect width={totalSize} height={totalSize} fill={bgColor} rx={bgRx} ry={bgRx} />
      )}
      {finderPositions.map(([r, c]) => {
        const x = c * moduleSize;
        const y = r * moduleSize;
        return (
          <g key={`${r}-${c}`}>
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
      {circles.map(({ cx, cy }, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={circleRadius}
          fill={fgColor}
        />
      ))}
    </svg>
  );
}

export default QRCode;
