const IdCardPhotoAvatar = ({
  photoUrl,
  name = '',
  size = 72,
  ringColor = '#1e40af',
  ringWidth = 2,
  shape = 'rounded'
}) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  const isSquare = shape === 'rounded';
  const radius = isSquare ? '14px' : '50%';

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        border: `${ringWidth}px solid ${ringColor}`,
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e2e8f0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
      }}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          className="w-full h-full object-cover"
          alt={name}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <span
          style={{
            fontSize: size * 0.35,
            fontWeight: 800,
            color: '#334155',
            userSelect: 'none'
          }}
        >
          {initials || 'ED'}
        </span>
      )}
    </div>
  );
};

export default IdCardPhotoAvatar;