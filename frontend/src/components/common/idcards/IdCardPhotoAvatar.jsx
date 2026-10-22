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
        <div className="relative w-full h-full flex items-end justify-center select-none bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <svg
            className="w-4/5 h-4/5 text-slate-300 dark:text-slate-600 translate-y-1"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default IdCardPhotoAvatar;