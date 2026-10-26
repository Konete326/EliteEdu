import * as React from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

export const AnimatedNumber = ({ value = 0, className = '' }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  const rawStr = String(value ?? 0).trim();
  const match = rawStr.match(/^([^0-9.-]*)([0-9,.]+)(.*)$/);

  const prefix = match ? match[1] : '';
  const numStr = match ? match[2].replace(/,/g, '') : '0';
  const suffix = match ? match[3] : '';

  const num = parseFloat(numStr);
  const isDecimal = numStr.includes('.') && numStr.split('.')[1]?.length > 0;
  const decimalPlaces = isDecimal ? Math.min(numStr.split('.')[1].length, 2) : 0;

  const spring = useSpring(0, {
    damping: 35,
    stiffness: 140,
    mass: 0.8
  });

  const display = useTransform(spring, (current) => {
    if (isDecimal) {
      return `${prefix}${current.toFixed(decimalPlaces)}${suffix}`;
    }
    return `${prefix}${Math.round(current).toLocaleString()}${suffix}`;
  });

  React.useEffect(() => {
    if (isInView && !isNaN(num)) {
      spring.set(num);
    }
  }, [isInView, num, spring]);

  if (isNaN(num)) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
    </span>
  );
};

export default AnimatedNumber;
