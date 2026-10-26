import * as React from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

const AnimatedStatsCard = React.forwardRef(
  (
    {
      title,
      primaryValue = 0,
      secondaryValue,
      secondaryLabel,
      icon,
      className,
      variant = 'primary',
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef(null);
    const isInView = useInView(cardRef, { once: true, margin: '-40px' });

    const numValue = typeof primaryValue === 'number'
      ? primaryValue
      : parseFloat(String(primaryValue).replace(/[^0-9.-]/g, '')) || 0;

    const isDecimal = typeof primaryValue === 'number' && !Number.isInteger(primaryValue);

    const spring = useSpring(0, {
      damping: 35,
      stiffness: 140,
      mass: 0.8
    });

    const displayValue = useTransform(spring, (current) => {
      if (isDecimal) {
        return current.toFixed(1);
      }
      return Math.round(current).toLocaleString();
    });

    React.useEffect(() => {
      if (isInView) {
        spring.set(numValue);
      }
    }, [isInView, numValue, spring]);

    const isPrimary = variant === 'primary';

    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        whileHover={{ y: -3 }}
        className={cn(
          'relative flex w-full flex-col overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-300',
          isPrimary
            ? 'bg-primary text-white shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20'
            : 'bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark border border-line dark:border-line-dark shadow-xs hover:border-primary/40 hover:shadow-md',
          'before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_50%_50%,currentColor_2%,transparent_2%)] before:opacity-[0.06] before:bg-[length:18px_18px]',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-3">
          <h2
            className={cn(
              'text-xs font-bold tracking-wider uppercase',
              isPrimary ? 'text-white/90' : 'text-ink-muted dark:text-ink-muted-dark'
            )}
          >
            {title}
          </h2>
          {icon && (
            <div
              className={cn(
                'rounded-xl p-2.5 transition-transform duration-200 hover:scale-105',
                isPrimary
                  ? 'bg-white/15 text-white'
                  : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark'
              )}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="z-10 flex flex-1 items-end justify-between gap-4 pt-6">
          <div className="flex items-baseline" aria-live="polite">
            <motion.h1
              className={cn(
                'text-3xl sm:text-5xl font-black tracking-tight',
                isPrimary ? 'text-white' : 'text-ink dark:text-ink-dark'
              )}
            >
              <motion.span>{displayValue}</motion.span>
            </motion.h1>
          </div>

          {(secondaryValue !== undefined || secondaryLabel) && (
            <>
              <div
                className={cn(
                  'mb-3 h-1 w-full flex-1 rounded-full',
                  isPrimary ? 'bg-white/20' : 'bg-line dark:bg-line-dark'
                )}
              />
              <div className="flex flex-col items-end text-right">
                {secondaryValue !== undefined && (
                  <span
                    className={cn(
                      'text-xl sm:text-3xl font-bold tracking-tight',
                      isPrimary ? 'text-white' : 'text-ink dark:text-ink-dark'
                    )}
                  >
                    {secondaryValue}
                  </span>
                )}
                {secondaryLabel && (
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isPrimary ? 'text-white/80' : 'text-ink-muted dark:text-ink-muted-dark'
                    )}
                  >
                    {secondaryLabel}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  }
);

AnimatedStatsCard.displayName = 'AnimatedStatsCard';

export { AnimatedStatsCard };
export default AnimatedStatsCard;
