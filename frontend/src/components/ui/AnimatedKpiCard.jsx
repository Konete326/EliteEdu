import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import AnimatedNumber from './AnimatedNumber';

export const AnimatedKpiCard = ({
  title,
  value,
  sub,
  icon: Icon,
  color = 'text-primary',
  bg = 'bg-primary/10',
  borderColor,
  className = '',
  onClick,
  action
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md group',
        'before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_50%_50%,currentColor_2%,transparent_2%)] before:opacity-[0.04] before:bg-[length:16px_16px]',
        onClick ? 'cursor-pointer' : '',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={cn('p-2.5 rounded-xl transition-transform duration-200 group-hover:scale-105', bg, color)}>
            {React.isValidElement(Icon) ? Icon : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-black text-ink dark:text-ink-dark tracking-tight">
          <AnimatedNumber value={value} />
        </div>
        {sub && (
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1 font-medium">
            {sub}
          </p>
        )}
      </div>

      {action && (
        <div className="mt-3 pt-3 border-t border-line dark:border-line-dark">
          {action}
        </div>
      )}
    </motion.div>
  );
};

export default AnimatedKpiCard;
