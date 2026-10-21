import React, { useState, useRef, Children } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MobileStepSlider = ({
  children,
  className = '',
  desktopClassName = 'sm:flex sm:items-center sm:gap-2',
  showDots = true,
  initialIndex = 0,
  controlledIndex,
  onIndexChange
}) => {
  const items = Children.toArray(children).filter(Boolean);
  const [internalIndex, setInternalIndex] = useState(initialIndex);
  const currentIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const handlePrev = () => {
    const nextIdx = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    if (onIndexChange) onIndexChange(nextIdx);
    else setInternalIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    if (onIndexChange) onIndexChange(nextIdx);
    else setInternalIndex(nextIdx);
  };

  const handleTouchStart = (e) => {
    if (e.targetTouches?.[0]) {
      touchStartXRef.current = e.targetTouches[0].clientX;
      touchEndXRef.current = e.targetTouches[0].clientX;
    }
  };

  const handleTouchMove = (e) => {
    if (e.targetTouches?.[0]) {
      touchEndXRef.current = e.targetTouches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    touchStartXRef.current = 0;
    touchEndXRef.current = 0;
  };

  if (items.length === 0) return null;

  return (
    <div className={`w-full ${className}`}>
      <div
        className="sm:hidden w-full flex flex-col items-center gap-2 select-none touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs flex items-center justify-center text-ink dark:text-ink-dark cursor-pointer shrink-0 active:scale-95 transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 flex justify-center items-center min-w-0">
            {items[currentIndex]}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs flex items-center justify-center text-ink dark:text-ink-dark cursor-pointer shrink-0 active:scale-95 transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {showDots && items.length > 1 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (onIndexChange) onIndexChange(idx);
                  else setInternalIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex ? 'w-5 bg-primary' : 'w-1.5 bg-line dark:bg-line-dark'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className={`hidden ${desktopClassName.includes('flex') ? 'sm:flex' : 'sm:grid'} ${desktopClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default MobileStepSlider;