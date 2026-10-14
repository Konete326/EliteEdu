export const EliteSpinner = ({ size = 56 }) => (
  <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
    <svg height="0" width="0" viewBox="0 0 64 64" className="absolute">
      <defs>
        <linearGradient id="elite-grad-purple-blue" x1="0" y1="62" x2="0" y2="2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#973BED" />
          <stop offset="1" stopColor="#007CFF" />
        </linearGradient>
        <linearGradient id="elite-grad-rainbow" x1="0" y1="64" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFC800" />
          <stop offset="1" stopColor="#FF00FF" />
          <animateTransform
            repeatCount="indefinite"
            keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
            keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
            dur="8s"
            values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
            type="rotate"
            attributeName="gradientTransform"
          />
        </linearGradient>
        <linearGradient id="elite-grad-cyan-green" x1="0" y1="62" x2="0" y2="2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00E0ED" />
          <stop offset="1" stopColor="#00DA72" />
        </linearGradient>
      </defs>
    </svg>

    <svg
      viewBox="0 0 64 64"
      fill="none"
      className="w-full h-full"
      style={{ overflow: 'visible' }}
    >
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke="url(#elite-grad-purple-blue)"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        className="uiverse-dash opacity-60"
        pathLength="360"
      />
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="6"
        stroke="url(#elite-grad-rainbow)"
        d="M 32 32 m 0 -22 a 22 22 0 1 1 0 44 a 22 22 0 1 1 0 -44"
        className="uiverse-spin"
        pathLength="360"
      />
      <circle
        cx="32"
        cy="32"
        r="14"
        stroke="url(#elite-grad-cyan-green)"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        className="uiverse-dash opacity-80"
        pathLength="360"
      />
    </svg>
  </div>
);

const PageLoader = ({ text = 'Loading data...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[380px] w-full py-12 px-4 space-y-4">
    <EliteSpinner size={64} />
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-[#973BED] via-[#007CFF] to-[#00DA72] bg-clip-text text-transparent select-none animate-pulse">
        EliteEdu
      </span>
      {text && (
        <p className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark">
          {text}
        </p>
      )}
    </div>
  </div>
);

export default PageLoader;
