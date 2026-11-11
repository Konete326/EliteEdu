import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';
import { stageRamps } from './chapterPlayerMath';
import { drawScene } from './chapterPlayerReel';

const ChapterPlayer = ({
  chapters = [],
  autoPlay = true,
  loop = true,
  duration = 4.5,
  isDark = true,
  activeColor = '#0d9488',
  brand = 'EliteEdu',
  className = '',
  onFinish
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);

  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const startRef = useRef(null);

  const theme = stageRamps(isDark, activeColor);
  const activeChapter = chapters[activeIdx] || { title: 'New Feature', description: 'Explore modern school features.' };

  const handleNext = useCallback(() => {
    setActiveIdx((prev) => {
      if (prev + 1 < chapters.length) return prev + 1;
      if (loop) return 0;
      setIsPlaying(false);
      onFinish?.();
      return prev;
    });
    setProgress(0);
    startRef.current = null;
  }, [chapters.length, loop, onFinish]);

  const handlePrev = useCallback(() => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : chapters.length - 1));
    setProgress(0);
    startRef.current = null;
  }, [chapters.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 540);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 320);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const render = (time) => {
      if (!startRef.current) startRef.current = time;
      const elapsed = isPlaying ? (time - startRef.current) / 1000 : progress * duration;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);

      ctx.save();
      ctx.scale(dpr, dpr);
      drawScene(ctx, width, height, activeChapter, p, theme, brand);
      ctx.restore();

      if (p >= 1 && isPlaying) {
        handleNext();
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
  }, [activeChapter, isPlaying, duration, handleNext, theme, brand, progress]);

  return (
    <div className={`relative flex flex-col rounded-3xl overflow-hidden border border-line dark:border-white/10 shadow-2xl ${className}`} style={{ backgroundColor: theme.bg[0] }}>
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[220px]">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      <div className="p-3.5 sm:p-5 flex flex-col gap-3 border-t border-line dark:border-white/10 bg-surface/80 dark:bg-[#0c0c0e]/80 backdrop-blur-md">
        <div className="flex items-center gap-1.5 w-full">
          {chapters.map((ch, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveIdx(idx);
                setProgress(0);
                startRef.current = null;
              }}
              className="flex-1 h-1.5 rounded-full overflow-hidden bg-line dark:bg-white/10 transition-all cursor-pointer relative"
              title={ch.title}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  backgroundColor: activeColor,
                  width: idx === activeIdx ? `${progress * 100}%` : idx < activeIdx ? '100%' : '0%'
                }}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-xl flex items-center justify-center border border-line dark:border-white/10 hover:border-primary text-ink dark:text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <div className="text-xs font-semibold text-ink-sub dark:text-ink-sub-dark">
              {activeIdx + 1} / {chapters.length}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-xl border border-line dark:border-white/10 hover:border-primary text-ink-muted hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-xl border border-line dark:border-white/10 hover:border-primary text-ink-muted hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ChapterPlayer);

