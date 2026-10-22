import { useState, useEffect } from 'react';

const IdCardPhotoAvatar = ({
  photoUrl,
  name = '',
  size = 72,
  ringColor = '#1e40af',
  ringWidth = 2,
  shape = 'rounded'
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
  const radius = isSquare ? '14px' : '50%';
  const showFallback = !photoUrl || hasError;

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
        background: showFallback ? `linear-gradient(135deg, ${ringColor}18 0%, #f1f5f9 100%)` : '#e2e8f0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
      }}
    >
      {!showFallback ? (
        <img
          src={photoUrl}
          className="w-full h-full object-cover"
          alt={name}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
          <svg
            className="absolute inset-0 w-full h-full opacity-10 pointer-events-none p-2"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: ringColor }}
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span
            style={{
              fontSize: size * 0.36,
              fontWeight: 900,
              color: ringColor,
              letterSpacing: '0.04em',
              zIndex: 1,
              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
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
