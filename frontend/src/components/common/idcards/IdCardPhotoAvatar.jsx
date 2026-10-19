const IdCardPhotoAvatar = ({
  photoUrl,
  name = '',
  size = 64,
  ringColor = '#1e40af',
  ringWidth = 3,
}) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `${ringWidth}px solid ${ringColor}`,
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#cbd5e1',
      }}
    >
      {photoUrl ? (
        <img src={photoUrl} className="w-full h-full object-cover" alt={name} />
      ) : (
        <span
          style={{
            fontSize: size * 0.3,
            fontWeight: 700,
            color: '#475569',
            userSelect: 'none',
          }}
        >
          {initials || '?'}
        </span>
      )}
    </div>
  );
};

export default IdCardPhotoAvatar;
