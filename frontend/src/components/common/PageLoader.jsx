export const EliteSpinner = ({ size = 48, className = '' }) => (
  <div
    className={`loader text-primary dark:text-primary-dark ${className}`}
    style={{ width: size, height: size }}
  >
    <svg viewBox="0 0 100 100" aria-label="Loading">
      <path
        className="loader-path"
        d="M50 12 L78 50 L50 88 L22 50 Z"
      />
      <path
        className="loader-inner"
        d="M50 28 L65 50 L50 72 L35 50 Z"
      />
    </svg>
  </div>
);

const PageLoader = ({ text = 'Loading data...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[380px] w-full py-12 px-4 space-y-4">
    <EliteSpinner size={52} />
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
