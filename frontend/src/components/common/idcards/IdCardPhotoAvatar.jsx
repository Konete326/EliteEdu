import { useState, useEffect } from 'react';

const IdCardPhotoAvatar = ({
  photoUrl,
  name = '',
  size = 72,
  ringColor = '#1e40af',
  ringWidth = 2,
  shape = 'rounded',
  fit = 'contain'
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [photoUrl]);

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('') || 'ED';

  const isSquare = shape === 'rounded';
  const radius = isSquare ? '12px' : '50%';
  const showFallback = !photoUrl || hasError;

  const isLight = !ringColor || ringColor.toLowerCase() === '#ffffff' || ringColor.toLowerCase() === '#fff';
  const avatarAccent = isLight ? '#003B73' : ringColor;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        border: `${ringWidth}px solid ${ringColor}`,
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: showFallback ? '#F1F5F9' : '#ffffff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
      }}
    >
      {!showFallback ? (
        <img
          src={photoUrl}
          className={`w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain'} bg-white`}
          alt={name}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center select-none bg-slate-100 overflow-hidden">
          <svg
            className="w-3/5 h-3/5 text-slate-300 translate-y-0.5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span
            style={{
              fontSize: size * 0.22,
              fontWeight: 900,
              color: '#ffffff',
              backgroundColor: avatarAccent,
              padding: '1px 6px',
              borderRadius: '6px',
              position: 'absolute',
              bottom: '4px',
              letterSpacing: '0.04em',
              zIndex: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}
          >
            {initials}
          </span>
        </div>
      )}
    </div>
  );
};

export default IdCardPhotoAvatar;