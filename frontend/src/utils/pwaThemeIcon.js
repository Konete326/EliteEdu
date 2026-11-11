export const updateThemeFavicon = (isDark) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 192;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bg = isDark ? '#09090b' : '#ffffff';
    const border = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';

    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(4, 4, 184, 184, 40);
    ctx.fill();

    ctx.strokeStyle = border;
    ctx.lineWidth = 4;
    ctx.stroke();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const padding = 34;
      const size = 192 - padding * 2;
      ctx.drawImage(img, padding, padding, size, size);
      const url = canvas.toDataURL('image/png');

      const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (appleIcon) appleIcon.href = url;

      const favicons = document.querySelectorAll('link[rel="icon"]');
      favicons.forEach((f) => {
        f.href = url;
      });
    };
    img.src = '/logo.png';
  } catch (_) {}
};

