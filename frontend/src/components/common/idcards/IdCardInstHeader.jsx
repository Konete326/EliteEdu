import { Shield } from 'lucide-react';

const CrestFallback = ({ size = 28, color = 'white' }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full flex items-center justify-center shrink-0 border border-current/30 bg-white/10"
  >
    <Shield style={{ width: size * 0.65, height: size * 0.65, color }} />
  </div>
);

const IdCardInstHeader = ({
  logoUrl,
  institutionName = '',
  campusName = '',
  areaName = '',
  semisCode = '',
  slogan = '',
  urduMotto = '',
  textColor = 'white',
  compact = false,
  bgColor
}) => {
  const cleanName = (institutionName || 'ELITE EDUCATION SYSTEM').trim();
  const nameLength = cleanName.length;

  const nameSize = compact
    ? (nameLength > 28 ? 'text-[6.8px] leading-[1.08]' : nameLength > 20 ? 'text-[7.5px] leading-[1.12]' : 'text-[8.5px] leading-tight')
    : (nameLength > 32 ? 'text-[8px] leading-tight' : 'text-[9.5px] leading-tight');

  const subSize = compact ? 'text-[6px] leading-none' : 'text-[7px] leading-tight';
  const logoSize = compact ? 26 : 32;

  const resolvedCampus = campusName || areaName;

  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1 w-full max-w-full overflow-hidden"
      style={bgColor ? { backgroundColor: bgColor } : {}}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="School Crest"
          style={{ width: logoSize, height: logoSize, objectFit: 'contain', flexShrink: 0 }}
          className="rounded-full bg-white/10 p-0.5"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <CrestFallback size={logoSize} color={textColor} />
      )}
      <div className="flex flex-col min-w-0 flex-1 text-left max-h-[46px] overflow-hidden justify-center">
        <span
          className={`font-black uppercase tracking-wide line-clamp-2 break-words ${nameSize}`}
          style={{ color: textColor }}
          title={cleanName}
        >
          {cleanName}
        </span>

        {resolvedCampus && (
          <span
            className={`font-semibold tracking-wide truncate mt-0.5 ${subSize}`}
            style={{ color: textColor, opacity: 0.9 }}
          >
            {[resolvedCampus, semisCode ? `SEMIS: ${semisCode}` : ''].filter(Boolean).join(' • ')}
          </span>
        )}

        {slogan && !compact && (
          <span
            className="italic truncate opacity-80 text-[6.5px] mt-0.5"
            style={{ color: textColor }}
          >
            &ldquo;{slogan}&rdquo;
          </span>
        )}

        {urduMotto && !compact && (
          <span
            className="text-[7px] leading-none mt-0.5"
            style={{ color: textColor, opacity: 0.85, fontFamily: 'serif', direction: 'rtl' }}
          >
            {urduMotto}
          </span>
        )}
      </div>
    </div>
  );
};

export default IdCardInstHeader;