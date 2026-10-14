const ThemeTransition = ({ isAnimating, isClosed }) => {
  if (!isAnimating) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      <div
        className={`fixed top-0 left-0 w-full h-[50vh] bg-[#1c2020] transition-transform duration-300 ease-out ${
          isClosed ? 'translate-y-0' : '-translate-y-full'
        }`}
      />
      <div
        className={`fixed bottom-0 left-0 w-full h-[50vh] bg-[#1c2020] transition-transform duration-300 ease-out ${
          isClosed ? 'translate-y-0' : 'translate-y-full'
        }`}
      />

      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity duration-200 ${
          isClosed ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-center gap-1 h-12">
          <div className="w-2 h-10 rounded-full bg-[#754fa0] theme-loader-bar" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-10 rounded-full bg-[#09b7bf] theme-loader-bar" style={{ animationDelay: '-0.7s' }} />
          <div className="w-2 h-10 rounded-full bg-[#90d36b] theme-loader-bar" style={{ animationDelay: '-0.6s' }} />
          <div className="w-2 h-10 rounded-full bg-[#f2d40d] theme-loader-bar" style={{ animationDelay: '-0.5s' }} />
          <div className="w-2 h-10 rounded-full bg-[#fcb12b] theme-loader-bar" style={{ animationDelay: '-0.4s' }} />
          <div className="w-2 h-10 rounded-full bg-[#ed1b72] theme-loader-bar" style={{ animationDelay: '-0.3s' }} />
        </div>
      </div>
    </div>
  );
};

export default ThemeTransition;
