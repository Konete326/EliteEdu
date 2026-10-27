import { useState, useEffect, useRef, useMemo } from 'react';

export function sideOf(i, active) {
  return i < active ? 1 : i > active ? -1 : 0;
}

export function foldTransform(i, active, tilt, roll) {
  const s = sideOf(i, active);
  return 'rotateY(' + s * tilt + 'deg) rotateZ(' + s * roll + 'deg)';
}

export function stripOffset(active, foldedWidth) {
  return -(foldedWidth * active);
}

export function stackOrder(i, active, n) {
  return n - Math.abs(active - i);
}

export function springAt(t, bounce, duration) {
  const zeta = 1 - Math.min(Math.max(bounce, 0), 0.9);
  const w = (2 * Math.PI) / Math.max(duration, 0.05);
  if (zeta >= 1) return 1 - Math.exp(-w * t) * (1 + w * t);
  const wd = w * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + ((zeta * w) / wd) * Math.sin(wd * t));
}

export function springEasing(bounce, duration, samples = 48) {
  const zeta = 1 - Math.min(Math.max(bounce, 0), 0.9);
  const w = (2 * Math.PI) / Math.max(duration, 0.05);
  const T = Math.log(1000) / (zeta * w);
  const pts = [];
  for (let k = 0; k <= samples; k++) {
    const v = k === samples ? 1 : springAt((k / samples) * T, bounce, duration);
    pts.push(+v.toFixed(4) + '');
  }
  return { easing: 'linear(' + pts.join(', ') + ')', ms: Math.round(T * 1000) };
}

export function clampIndex(i, n) {
  return n <= 0 ? 0 : Math.min(Math.max(Math.round(i), 0), n - 1);
}

const FOLD_EASE = 'cubic-bezier(1, -0.03, 0.413, 0.965)';

const CSS =
  '.vfc-root{position:relative;overflow:hidden;display:grid;place-items:center;width:100%;' +
  'color:var(--color-foreground,#262626);user-select:none;-webkit-user-select:none;touch-action:pan-y;' +
  'outline:none;-webkit-tap-highlight-color:transparent}' +
  '.vfc-root:focus-visible{box-shadow:inset 0 0 0 2px var(--color-primary,#171717)}' +
  '.vfc-stage{position:relative}' +
  '.vfc-strip{display:flex;width:max-content}' +
  '.vfc-slot{perspective:800px}' +
  '.vfc-holder{position:relative;flex-shrink:0;display:flex;flex-direction:column;align-items:center;will-change:transform}' +
  '.vfc-photo{flex-shrink:0;display:block;margin:0;padding:0;border:0;overflow:hidden;cursor:pointer;' +
  'background:color-mix(in oklab,currentColor 10%,transparent);-webkit-tap-highlight-color:transparent}' +
  '.vfc-photo:focus-visible{outline:2px solid currentColor;outline-offset:4px}' +
  '.vfc-photo>img{width:100%;height:100%;max-width:none;display:block;object-fit:cover;pointer-events:none}' +
  '.vfc-frame{position:absolute;inset:0;margin:auto;box-sizing:content-box;border:2px solid currentColor;' +
  'pointer-events:none;animation:vfc-pulse var(--vfc-d) ease-in-out}' +
  '@keyframes vfc-pulse{0%{transform:scale(1)}50%{transform:scale(1.07)}100%{transform:scale(1)}}' +
  '.vfc-title{position:absolute;left:50%;bottom:76px;transform:translateX(-50%);max-width:calc(100% - 32px);' +
  'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;line-height:18px;pointer-events:none;' +
  'color:color-mix(in oklab,currentColor 75%,transparent)}' +
  '.vfc-title>span{display:inline-block;animation:vfc-in .35s ease-out}' +
  '@keyframes vfc-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}' +
  '.vfc-controls{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);z-index:50;display:flex;' +
  'align-items:center;gap:16px;padding:0 8px;border-radius:999px;' +
  'background:color-mix(in oklab,currentColor 7%,transparent);' +
  'border:1px solid color-mix(in oklab,currentColor 12%,transparent);' +
  '-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);' +
  'box-shadow:0 1px 3px rgba(0,0,0,.08),0 1px 2px -1px rgba(0,0,0,.08)}' +
  '.vfc-btn{display:grid;place-items:center;margin:0;padding:8px;border:0;border-radius:999px;background:none;' +
  'color:inherit;cursor:pointer;transition:opacity .2s,transform .2s}' +
  '.vfc-btn:disabled{opacity:.3;cursor:default}' +
  '.vfc-btn:not(:disabled):active{transform:scale(.88)}' +
  '.vfc-btn:focus-visible,.vfc-dot:focus-visible{outline:2px solid currentColor;outline-offset:2px}' +
  '.vfc-dots{min-width:180px;display:flex;justify-content:center;align-items:center;gap:8px}' +
  '.vfc-dot{position:relative;width:8px;height:8px;margin:0;padding:0;border:0;border-radius:999px;' +
  'background:currentColor;opacity:.3;cursor:pointer;transition:width .3s,opacity .3s}' +
  '.vfc-dot::after{content:"";position:absolute;inset:-10px -4px}' +
  '.vfc-dot[aria-current]{width:28px;opacity:1}' +
  '.vfc-count{font-size:13px;font-variant-numeric:tabular-nums}' +
  '.vfc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
  '@media (prefers-reduced-motion:reduce){.vfc-strip,.vfc-holder{transition:none !important}' +
  '.vfc-frame,.vfc-title>span{animation:none}.vfc-dot,.vfc-btn{transition:none}}';

function Chevron({ dir }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ maxWidth: 'none' }}>
      <path d={dir < 0 ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

const pad = (n) => (n < 10 ? '0' + n : '' + n);

const blank = (i) => {
  const h = (i * 47 + 200) % 360;
  return 'linear-gradient(145deg, hsl(' + h + ' 30% 80%), hsl(' + ((h + 40) % 360) + ' 26% 58%))';
};

export default function ViewfinderFlipCarousel({
  items = [],
  height = '100svh',
  size = 200,
  foldedWidth = 70,
  openWidth = 300,
  tilt = 60,
  roll = 90,
  radius = 8,
  frame = true,
  duration = 0.8,
  bounce = 0.2,
  lockWhileMoving = true,
  titles = false,
  controls = true,
  color,
  background = 'color-mix(in oklab, var(--color-foreground, #000) 7%, var(--color-background, #fff))',
  fontFamily = '"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif',
  fontHref = null,
  index,
  defaultIndex = 3,
  onIndexChange,
  onSelect,
  ariaLabel = 'Photo carousel',
  className = ''
}) {
  const n = items.length;
  const [inner, setInner] = useState(clampIndex(index ?? defaultIndex, n));
  const active = index == null ? clampIndex(inner, n) : clampIndex(index, n);
  const spring = useMemo(() => springEasing(bounce, duration), [bounce, duration]);
  const movingUntil = useRef(0);
  const reduced = useRef(false);
  const swipe = useRef({ id: -1, x: 0, done: false });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => {
      reduced.current = mq.matches;
    };
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    if (!fontHref) return;
    const exists = Array.from(document.querySelectorAll('link[rel=stylesheet]')).some(
      (l) => l.href === fontHref
    );
    if (exists) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontHref;
    link.setAttribute('data-viewfinder-flip-font', '');
    document.head.appendChild(link);
  }, [fontHref]);

  const go = (i) => {
    const next = clampIndex(i, n);
    if (next === active) return;
    const now = performance.now();
    if (lockWhileMoving && now < movingUntil.current) return;
    movingUntil.current = reduced.current ? 0 : now + duration * 1000;
    setInner(next);
    onIndexChange?.(next);
  };

  const onKeyDown = (e) => {
    let to = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = active + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = active - 1;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = n - 1;
    else return;
    e.preventDefault();
    go(to);
  };

  const onPointerDown = (e) => {
    swipe.current = { id: e.pointerId, x: e.clientX, done: false };
  };

  const onPointerMove = (e) => {
    const s = swipe.current;
    if (s.id !== e.pointerId || s.done) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 40) {
      s.done = true;
      go(active + (dx < 0 ? 1 : -1));
    }
  };

  const onPointerEnd = () => {
    swipe.current.id = -1;
    window.setTimeout(() => {
      swipe.current.done = false;
    }, 0);
  };

  const fold = duration * 1000 + 'ms ' + FOLD_EASE;
  const current = items[active];

  return (
    <div
      className={'vfc-root ' + className}
      style={{ height, background, color, fontFamily }}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <style>{CSS}</style>

      <div className="vfc-stage" style={{ width: openWidth, height: size, ['--vfc-d']: duration * 1000 + 'ms' }}>
        <div
          className="vfc-strip"
          style={{
            transform: 'translateX(' + stripOffset(active, foldedWidth) + 'px)',
            transition: 'transform ' + spring.ms + 'ms ' + spring.easing
          }}
        >
          {items.map((item, i) => {
            const isActive = i === active;
            return (
              <div key={i} className="vfc-slot" style={{ zIndex: stackOrder(i, active, n) }}>
                <div
                  className="vfc-holder"
                  style={{
                    width: isActive ? openWidth : foldedWidth,
                    height: size,
                    transform: foldTransform(i, active, tilt, roll),
                    transition: 'width ' + fold + ', transform ' + fold
                  }}
                >
                  <button
                    type="button"
                    className="vfc-photo"
                    aria-label={i + 1 + ' of ' + n + ': ' + item.title}
                    aria-current={isActive ? 'true' : undefined}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => {
                      if (swipe.current.done) return;
                      if (isActive) onSelect?.(item, i);
                      else go(i);
                    }}
                    style={{ width: size, height: size, borderRadius: radius, background: item.src ? undefined : blank(i) }}
                  >
                    {item.src ? (
                      <img src={item.src} alt={item.alt ?? item.title} draggable={false} decoding="async" width={size} height={size} style={{ maxWidth: 'none' }} />
                    ) : null}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {frame ? (
          <div
            key={active}
            className="vfc-frame"
            aria-hidden="true"
            style={{ width: size + 16, height: size + 16, borderRadius: radius + 4 }}
          />
        ) : null}
      </div>

      {titles && current ? (
        <div className="vfc-title" aria-hidden="true">
          <span key={active}>{current.title}</span>
        </div>
      ) : null}

      {controls && n > 1 ? (
        <div className="vfc-controls" onPointerDown={(e) => e.stopPropagation()}>
          <button type="button" className="vfc-btn" aria-label="Previous slide" disabled={active <= 0} onClick={() => go(active - 1)}>
            <Chevron dir={-1} />
          </button>
          <div className="vfc-dots">
            {n > 14 ? (
              <span className="vfc-count">
                {pad(active + 1)} / {pad(n)}
              </span>
            ) : (
              items.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  className="vfc-dot"
                  aria-label={'Go to slide ' + (i + 1) + ': ' + item.title}
                  aria-current={i === active ? 'true' : undefined}
                  onClick={() => go(i)}
                />
              ))
            )}
          </div>
          <button type="button" className="vfc-btn" aria-label="Next slide" disabled={active >= n - 1} onClick={() => go(active + 1)}>
            <Chevron dir={1} />
          </button>
        </div>
      ) : null}

      <div className="vfc-sr" aria-live="polite" aria-atomic="true">
        {current ? 'Slide ' + (active + 1) + ' of ' + n + ': ' + current.title : ''}
      </div>
    </div>
  );
}
