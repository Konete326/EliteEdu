const CrestFallback = ({ size = 32, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" stroke={color} strokeWidth="2" />
    <text x="16" y="20" textAnchor="middle" fill={color} fontSize="12" fontWeight="bold">E</text>
  </svg>
);

const IdCardInstHeader = ({
  logoUrl,
  institutionName = '',
  areaName = '',
  semisCode = '',
  urduMotto = '',
  textColor = 'white',
  compact = false,
  bgColor,
}) => {
  const nameSize = compact ? 'text-[7px]' : 'text-[8.5px]';
  const subSize = compact ? 'text-[5.5px]' : 'text-[6.5px]';
  const logoSize = compact ? 24 : 32;

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 w-full"
      style={bgColor ? { backgroundColor: bgColor } : {}}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="logo"
          style={{ width: logoSize, height: logoSize, objectFit: 'contain', flexShrink: 0 }}
        />
      ) : (
        <CrestFallback size={logoSize} color={textColor} />
      )}
      <div className="flex flex-col min-w-0">
        <span
          className={`font-extrabold uppercase tracking-wide leading-tight ${nameSize}`}
          style={{ color: textColor }}
        >
          {institutionName || 'INSTITUTION'}
        </span>
        {(areaName || semisCode) && (
          <span className={`${subSize} leading-tight`} style={{ color: textColor, opacity: 0.85 }}>
            {[areaName, semisCode ? `SEMIS: ${semisCode}` : ''].filter(Boolean).join(' | ')}
          </span>
        )}
        {urduMotto && (
          <span
            className={`${subSize} leading-tight`}
            style={{ color: textColor, opacity: 0.75, fontFamily: 'serif', direction: 'rtl' }}
          >
            {urduMotto}
          </span>
        )}
      </div>
    </div>
  );
};

export default IdCardInstHeader;
