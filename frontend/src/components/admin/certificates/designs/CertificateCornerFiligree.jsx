import React from 'react';

const FiligreeSvg = ({ className = '', style = {} }) => (
  <svg viewBox="0 0 120 120" className={className} style={style}>
    <g fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 6,6 L 6,70 C 6,85 18,92 28,82 C 38,72 26,58 14,64" />
      <path d="M 6,6 L 70,6 C 85,6 92,18 82,28 C 72,38 58,26 64,14" />
      <path d="M 16,16 L 16,50 C 16,60 26,64 32,58 C 38,52 30,42 22,46" />
      <path d="M 16,16 L 50,16 C 60,16 64,26 58,32 C 52,38 42,30 46,22" />
      <path d="M 28,28 C 45,28 65,45 65,70 C 65,85 52,95 40,88 C 28,81 35,65 50,68" />
      <path d="M 28,28 C 28,45 45,65 70,65 C 85,65 95,52 88,40 C 81,28 65,35 68,50" />
      <circle cx="28" cy="28" r="4" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
      <circle cx="55" cy="55" r="3" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
      <circle cx="10" cy="88" r="2.5" fill="#f59e0b" />
      <circle cx="88" cy="10" r="2.5" fill="#f59e0b" />
    </g>
  </svg>
);

export const CornerFiligrees = ({ size = 95 }) => (
  <>
    <div className="absolute top-2 left-2 pointer-events-none" style={{ width: size, height: size }}>
      <FiligreeSvg className="w-full h-full" />
    </div>
    <div className="absolute top-2 right-2 pointer-events-none" style={{ width: size, height: size, transform: 'scaleX(-1)' }}>
      <FiligreeSvg className="w-full h-full" />
    </div>
    <div className="absolute bottom-2 left-2 pointer-events-none" style={{ width: size, height: size, transform: 'scaleY(-1)' }}>
      <FiligreeSvg className="w-full h-full" />
    </div>
    <div className="absolute bottom-2 right-2 pointer-events-none" style={{ width: size, height: size, transform: 'scale(-1, -1)' }}>
      <FiligreeSvg className="w-full h-full" />
    </div>
  </>
);

export default CornerFiligrees;
