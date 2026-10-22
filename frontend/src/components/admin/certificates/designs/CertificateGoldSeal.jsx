import React from 'react';

export const SunburstSeal = ({ size = 68 }) => (
  <div className="relative inline-flex items-center justify-center shrink-0 drop-shadow-md select-none" style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="goldGradSunburst" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#eab308" />
          <stop offset="85%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#854d0e" />
        </radialGradient>
        <filter id="sealShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#78350f" floodOpacity="0.4" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#goldGradSunburst)" filter="url(#sealShadow)" stroke="#a16207" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="43" fill="none" stroke="#fef9c3" strokeWidth="1" strokeDasharray="1.5,1.5" />
      <circle cx="50" cy="50" r="39" fill="none" stroke="#78350f" strokeWidth="1" />
      <path id="sealArcPath" d="M 18,50 A 32,32 0 1,1 82,50 A 32,32 0 1,1 18,50" fill="none" />
      <text fill="#78350f" fontSize="5.5" fontWeight="900" letterSpacing="0.8">
        <textPath href="#sealArcPath" startOffset="5%">HONOR • ACHIEVEMENT • EXCELLENCE •</textPath>
      </text>
      <circle cx="50" cy="50" r="23" fill="#ca8a04" stroke="#fef08a" strokeWidth="1.2" />
      <polygon points="50,32 54,43 65,43 56,50 60,61 50,54 40,61 44,50 35,43 46,43" fill="#fef08a" stroke="#854d0e" strokeWidth="0.8" />
    </svg>
  </div>
);

export const LaurelMedal = ({ year = '2026', title = 'AWARD', size = 78 }) => (
  <div className="relative inline-flex items-center justify-center shrink-0 drop-shadow-lg select-none" style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="goldMedalGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="25%" stopColor="#fde047" />
          <stop offset="60%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill="url(#goldMedalGrad)" stroke="#78350f" strokeWidth="2" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#fef3c7" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="39" fill="none" stroke="#92400e" strokeWidth="0.8" strokeDasharray="1,1" />
      <g fill="#78350f" stroke="#78350f" strokeWidth="0.4">
        <path d="M 28,48 C 24,38 27,28 35,22 C 34,26 33,32 35,36 C 31,34 29,38 28,48 Z" />
        <path d="M 27,55 C 24,64 28,73 36,77 C 34,73 34,68 36,63 C 32,65 30,62 27,55 Z" />
        <path d="M 72,48 C 76,38 73,28 65,22 C 66,26 67,32 65,36 C 69,34 71,38 72,48 Z" />
        <path d="M 73,55 C 76,64 72,73 64,77 C 66,73 66,68 64,63 C 68,65 70,62 73,55 Z" />
      </g>
      <text x="50" y="47" textAnchor="middle" fill="#78350f" fontSize="16" fontWeight="900" fontFamily="sans-serif">{year}</text>
      <text x="50" y="60" textAnchor="middle" fill="#78350f" fontSize="8" fontWeight="800" letterSpacing="1.2" fontFamily="sans-serif">{title}</text>
    </svg>
  </div>
);

export const ChampionBadge = ({ size = 96, logoUrl = '' }) => (
  <div className="relative inline-flex flex-col items-center shrink-0 drop-shadow-md select-none" style={{ width: size, height: size * 1.15 }}>
    <svg viewBox="0 0 100 115" className="w-full h-full">
      <defs>
        <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <clipPath id="champBadgeCircleClip">
          <circle cx="50" cy="52" r="29" />
        </clipPath>
      </defs>
      <polygon points="32,70 32,112 43,103 48,112 48,70" fill="url(#goldRibbonGrad)" stroke="#78350f" strokeWidth="0.8" />
      <polygon points="52,70 52,112 57,103 68,112 68,70" fill="url(#goldRibbonGrad)" stroke="#78350f" strokeWidth="0.8" />
      <polygon points="50,6 59,25 79,15 75,36 94,37 81,52 94,67 74,68 78,89 59,79 50,97 41,79 22,89 26,68 6,67 19,52 6,37 25,36 21,15 41,25" fill="url(#goldRibbonGrad)" stroke="#78350f" strokeWidth="1" />
      <circle cx="50" cy="52" r="37" fill="#051937" stroke="#eab308" strokeWidth="2.5" />
      <circle cx="50" cy="52" r="31" fill="#ffffff" stroke="#051937" strokeWidth="1.2" />
      {logoUrl ? (
        <image
          href={logoUrl}
          x="22"
          y="24"
          width="56"
          height="56"
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#champBadgeCircleClip)"
        />
      ) : (
        <>
          <path id="champArc" d="M 24,52 A 26,26 0 1,1 76,52" fill="none" />
          <text fill="#051937" fontSize="4.8" fontWeight="900" letterSpacing="0.8">
            <textPath href="#champArc" startOffset="10%">YOU ARE THE BEST</textPath>
          </text>
          <polygon points="50,39 52,44 57,44 53,47 55,52 50,49 45,52 47,47 43,44 48,44" fill="#051937" />
          <polygon points="41,43 42,46 45,46 43,48 44,51 41,49 38,51 39,48 37,46 40,46" fill="#051937" />
          <polygon points="59,43 60,46 63,46 61,48 62,51 59,49 56,51 57,48 55,46 58,46" fill="#051937" />
          <text x="50" y="61" textAnchor="middle" fill="#051937" fontSize="5.5" fontWeight="900" letterSpacing="0.6">CHAMPION</text>
          <text x="50" y="67" textAnchor="middle" fill="#051937" fontSize="4.5" fontWeight="800" letterSpacing="0.4">PRIZE</text>
        </>
      )}
    </svg>
  </div>
);
