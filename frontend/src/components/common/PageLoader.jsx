export const EliteSpinner = ({ size = 42, className = '' }) => (
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

const PageLoader = ({ text }) => (
  <div className="flex flex-col items-center justify-center min-h-[220px] w-full py-8 px-4 space-y-3">
    <EliteSpinner size={46} />
    {text && (
      <p className="text-xs font-semibold text-ink-muted dark:text-ink-muted-dark tracking-wide">
        {text}
      </p>
    )}
  </div>
);

export default PageLoader;
