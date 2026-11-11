import { useEffect, useRef, memo } from 'react';
import { parseColor, layoutText } from './meltMarkEngine';

const MeltMark = ({
  text = 'eliteedu',
  color = '#ffffff',
  background = '#09090b',
  size = 0.22,
  speed = 3.2,
  interactive = false,
  loop = false,
  onComplete,
  className = '',
  style = {}
}) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const startRef = useRef(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 320);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 320);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const rgbColor = parseColor(color);
    const rgbBg = parseColor(background);
    const colorStr = `rgb(${Math.round(rgbColor[0] * 255)}, ${Math.round(rgbColor[1] * 255)}, ${Math.round(rgbColor[2] * 255)})`;
    const bgStr = `rgb(${Math.round(rgbBg[0] * 255)}, ${Math.round(rgbBg[1] * 255)}, ${Math.round(rgbBg[2] * 255)})`;

    const layout = layoutText(text);
    const duration = 1.1 / (speed || 1);

    const render = (time) => {
      if (!startRef.current) startRef.current = time;
      const elapsed = (time - startRef.current) / 1000;
      const rawProgress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - rawProgress, 3);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.fillStyle = bgStr;
      ctx.fillRect(0, 0, width, height);

      const fontSize = Math.min(width * 0.14, height * 0.18, 64);
      ctx.font = `900 ${fontSize}px Figtree, system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const centerX = width / 2;
      const centerY = height / 2;
      const meltOffset = (1 - ease) * (fontSize * 0.65);
      const alpha = Math.min(1, ease * 1.35);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = colorStr;

      const chars = String(text).toUpperCase().split('');
      const charSpacing = fontSize * 0.62;
      const startX = centerX - ((chars.length - 1) * charSpacing) / 2;

      chars.forEach((ch, idx) => {
        const stagger = Math.max(0, Math.min(1, (ease - idx * 0.04) / 0.8));
        const yOffset = (1 - stagger) * (fontSize * 0.75);
        ctx.fillText(ch, startX + idx * charSpacing, centerY + yOffset);
      });

      const barWidth = Math.min(width * 0.38, 220) * ease;
      ctx.fillStyle = colorStr;
      ctx.beginPath();
      ctx.roundRect(centerX - barWidth / 2, centerY + fontSize * 0.8, barWidth, 3, 2);
      ctx.fill();

      ctx.restore();

      if (rawProgress >= 1) {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
        if (loop) {
          startRef.current = time;
          completedRef.current = false;
          animRef.current = requestAnimationFrame(render);
        }
      } else {
        animRef.current = requestAnimationFrame(render);
      }
    };

    animRef.current = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [text, color, background, speed, loop, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className={`block select-none pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%', ...style }}
    />
  );
};

export default memo(MeltMark);

