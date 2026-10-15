const STYLES = ['Default', 'Style 1', 'Style 2', 'Style 3', 'Style 4'];

const IdCardsStyleSwitcher = ({ selectedStyle, onSelectStyle }) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
      {STYLES.map((style) => (
        <button
          key={style}
          type="button"
          onClick={() => onSelectStyle(style)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedStyle === style
              ? 'bg-primary text-white shadow-xs'
              : 'bg-surface-secondary/60 dark:bg-[#16161d] text-ink dark:text-ink-dark hover:bg-surface-secondary'
          }`}
        >
          {style}
        </button>
      ))}
    </div>
  );
};

export default IdCardsStyleSwitcher;
