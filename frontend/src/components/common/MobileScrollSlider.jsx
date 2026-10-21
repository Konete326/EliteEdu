import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MobileScrollSlider = ({
  children,
  className = '',
  containerClassName = '',
  scrollDistance = 180
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    const obs = new ResizeObserver(updateScrollState);
    obs.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      obs.disconnect();
    };
  }, []);

  const handleSlide = (direction) => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -scrollDistance : scrollDistance;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className={`relative w-full max-w-full min-w-0 group ${containerClassName}`}>
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleSlide('left')}
          className="sm:hidden absolute left-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-md flex items-center justify-center text-ink dark:text-ink-dark cursor-pointer transition-opacity"
          aria-label="Slide Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      <div
        ref={scrollRef}
        className={`overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory w-full ${className}`}
      >
        {children}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleSlide('right')}
          className="sm:hidden absolute right-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-md flex items-center justify-center text-ink dark:text-ink-dark cursor-pointer transition-opacity"
          aria-label="Slide Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default MobileScrollSlider;
