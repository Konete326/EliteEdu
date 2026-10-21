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
  const nameSize = compact ? 'text-[8px]' : 'text-[9.5px]';
  const subSize = compact ? 'text-[6px]' : 'text-[7px]';
  const logoSize = compact ? 26 : 34;

  const resolvedCampus = campusName || areaName;

  return (
    <div
      className="flex items-center gap-2 px-2 py-1 w-full"
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
      <div className="flex flex-col min-w-0 flex-1 leading-tight text-left">
        <span
          className={`font-black uppercase tracking-wide truncate ${nameSize}`}
          style={{ color: textColor }}
        >
          {institutionName || 'ELITE EDUCATION SYSTEM'}
        </span>

        {resolvedCampus && (
          <span
            className={`font-semibold tracking-wide truncate ${subSize}`}
            style={{ color: textColor, opacity: 0.9 }}
          >
            {[resolvedCampus, semisCode ? `SEMIS: ${semisCode}` : ''].filter(Boolean).join(' • ')}
          </span>
        )}

        {slogan && (
          <span
            className={`italic truncate opacity-80 ${compact ? 'text-[5.5px]' : 'text-[6.5px]'}`}
            style={{ color: textColor }}
          >
            &ldquo;{slogan}&rdquo;
          </span>
        )}

        {urduMotto && (
          <span
            className={`${compact ? 'text-[6px]' : 'text-[7px]'} leading-none mt-0.5`}
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