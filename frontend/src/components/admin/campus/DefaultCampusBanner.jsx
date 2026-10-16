import { School } from 'lucide-react';

const DefaultCampusBanner = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/30 via-primary/10 to-surface-secondary dark:from-primary/20 dark:via-primary/5 dark:to-[#141414] overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full opacity-20 dark:opacity-15 text-primary pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 160"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="campusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d="M 0 160 L 0 110 L 80 80 L 160 110 L 160 160 Z" fill="url(#campusGrad)" />
        <path d="M 140 160 L 140 90 L 200 65 L 260 90 L 260 160 Z" fill="url(#campusGrad)" />
        <path d="M 240 160 L 240 100 L 320 70 L 400 100 L 400 160 Z" fill="url(#campusGrad)" />
        <line x1="200" y1="30" x2="200" y2="65" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="200" cy="25" r="4" fill="currentColor" />
        <circle cx="80" cy="50" r="1.5" fill="currentColor" />
        <circle cx="320" cy="45" r="1.5" fill="currentColor" />
      </svg>
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-primary/10 dark:bg-primary/20 blur-xl pointer-events-none" />
    </div>
  );
};

export default DefaultCampusBanner;
