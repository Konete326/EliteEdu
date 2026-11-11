import { framePath } from './chapterPlayerMath';

export const drawScene = (ctx, w, h, chapter, progress, theme, brand = 'EliteEdu') => {
  ctx.save();

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, theme.bg[0]);
  grad.addColorStop(0.5, theme.bg[1]);
  grad.addColorStop(1, theme.bg[2] || theme.bg[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;

  ctx.save();
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 1;
  const step = Math.max(30, Math.floor(w / 16));
  for (let x = 0; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.globalAlpha = 0.08;
    ctx.stroke();
  }
  for (let y = 0; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.globalAlpha = 0.08;
    ctx.stroke();
  }
  ctx.restore();

  const cardW = Math.min(w * 0.85, 480);
  const cardH = Math.min(h * 0.62, 260);
  const cardX = cx - cardW / 2;
  const cardY = cy - cardH / 2 - 10;

  ctx.save();
  ctx.fillStyle = theme.cardBg;
  framePath(ctx, cardX, cardY, cardW, cardH, 20);
  ctx.fill();
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.strokeStyle = theme.glow;
  ctx.lineWidth = 2;
  ctx.shadowColor = theme.glow;
  ctx.shadowBlur = 16;
  ctx.beginPath();
  const lineP = Math.min(1, progress * 1.2);
  ctx.moveTo(cardX + 20, cardY);
  ctx.lineTo(cardX + 20 + (cardW - 40) * lineP, cardY);
  ctx.stroke();
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = theme.glow;
  ctx.font = '800 11px Figtree, system-ui, sans-serif';
  ctx.fillText(brand.toUpperCase(), cx, cardY + 36);

  ctx.fillStyle = theme.text;
  const titleSize = Math.min(w * 0.045, 22);
  ctx.font = `800 ${titleSize}px Figtree, system-ui, sans-serif`;
  ctx.fillText(chapter?.title || 'System Enhancement', cx, cardY + 76);

  ctx.fillStyle = theme.muted;
  const descSize = Math.min(w * 0.028, 13);
  ctx.font = `500 ${descSize}px Figtree, system-ui, sans-serif`;
  const desc = chapter?.description || 'Latest institutional features and speed optimizations.';
  ctx.fillText(desc, cx, cardY + 116);

  const badgeW = 120;
  const badgeH = 28;
  const badgeX = cx - badgeW / 2;
  const badgeY = cardY + cardH - 52;
  ctx.fillStyle = theme.border;
  framePath(ctx, badgeX, badgeY, badgeW, badgeH, 14);
  ctx.fill();

  ctx.fillStyle = theme.glow;
  ctx.font = '700 11px Figtree, system-ui, sans-serif';
  ctx.fillText('FEATURE READY', cx, badgeY + badgeH / 2);

  ctx.restore();
};

