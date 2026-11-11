export const fmt = (sec = 0) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const fitScale = (w, h, maxW = 860, maxH = 500) => {
  const aspect = w / (h || 1);
  let finalW = w;
  let finalH = h;
  if (finalW > maxW) {
    finalW = maxW;
    finalH = finalW / aspect;
  }
  if (finalH > maxH) {
    finalH = maxH;
    finalW = finalH * aspect;
  }
  return { width: Math.round(finalW), height: Math.round(finalH) };
};

export const stageRamps = (isDark = true, activeColor = '#0d9488') => {
  if (isDark) {
    return {
      bg: ['#09090b', '#111113', '#18181b', '#202024'],
      glow: activeColor || '#0d9488',
      text: '#fafafa',
      muted: '#a1a1aa',
      border: 'rgba(255, 255, 255, 0.12)',
      cardBg: 'rgba(24, 24, 27, 0.85)'
    };
  }
  return {
    bg: ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0'],
    glow: activeColor || '#0d9488',
    text: '#09090b',
    muted: '#64748b',
    border: 'rgba(0, 0, 0, 0.08)',
    cardBg: 'rgba(255, 255, 255, 0.92)'
  };
};

export const framePath = (ctx, x, y, w, h, r = 16) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
};

export const drawEdge = (ctx, x, y, w, h, color = '#0d9488') => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  framePath(ctx, x, y, w, h, 16);
  ctx.stroke();
  ctx.restore();
};

