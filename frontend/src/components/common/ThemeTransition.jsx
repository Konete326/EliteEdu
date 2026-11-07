const ThemeTransition = ({ isAnimating }) => {
  if (!isAnimating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-1 bg-transparent overflow-hidden">
      <div className="w-full h-full bg-primary animate-pulse transition-all duration-300" />
    </div>
  );
};

export default ThemeTransition;
