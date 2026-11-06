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
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
        aspectRatio: '1 / 1'
      }}
    >
      {!showFallback ? (
        <img
          src={photoUrl}
          loading="lazy"
          decoding="async"
          className={`w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain'} bg-white`}
          alt={name}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center select-none bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200/50">
          <span className="font-black text-slate-500 tracking-wider uppercase text-sm select-none">
            {initials}
          </span>
          <span className="text-[6px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            PHOTO
          </span>
        </div>
      )}
    </div>
  );
};

export default IdCardPhotoAvatar;