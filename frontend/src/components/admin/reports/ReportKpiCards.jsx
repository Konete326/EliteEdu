const ReportKpiCards = ({ items = [] }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-surface border border-line shadow-2xs hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                {item.title}
              </span>
              {Icon && (
                <div className={`p-2 rounded-xl ${item.bg || 'bg-primary/10'} text-primary`}>
                  <Icon size={16} className={item.color || 'text-primary'} />
                </div>
              )}
            </div>
            <p className="text-xl sm:text-2xl font-black text-ink mt-2">
              {item.value ?? 0}
            </p>
            {item.subtext && (
              <p className="text-[10px] text-ink-muted mt-0.5">{item.subtext}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReportKpiCards;
