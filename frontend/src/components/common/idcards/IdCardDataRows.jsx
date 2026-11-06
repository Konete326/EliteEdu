const formatValue = (val) => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') {
    if (val.phone || val.name) return val.phone || val.name;
    const parts = Object.values(val).filter((v) => typeof v === 'string' || typeof v === 'number');
    return parts.join(', ') || '';
  }
  return String(val);
};

const IdCardDataRows = ({
  rows = [],
  layout = 'single',
  textColorClass = 'text-slate-800',
  labelColorClass = 'text-slate-500',
  fontSize = 'text-[7.5px]',
  maxRows = 12
}) => {
  const visible = rows
    .filter((r) => r.value !== undefined && r.value !== null && r.value !== '')
    .map((r) => ({ ...r, value: formatValue(r.value) }))
    .filter((r) => r.value !== '')
    .slice(0, maxRows);

  if (layout === 'grid') {
    return (
      <div className={`grid grid-cols-2 gap-x-2.5 gap-y-1.5 w-full ${fontSize}`}>
        {visible.map((row, i) => (
          <div key={i} className="flex items-center justify-between border-b border-slate-100/90 pb-0.5 gap-1 overflow-hidden">
            <span className={`font-bold uppercase tracking-wider ${labelColorClass} shrink-0 text-[6.5px]`}>
              {row.label}:
            </span>
            <span className={`font-semibold ${textColorClass} truncate text-right text-[7.2px]`} title={row.value}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 w-full ${fontSize}`}>
      {visible.map((row, i) => (
        <div key={i} className="flex items-center justify-between border-b border-slate-100/90 pb-0.5 gap-1.5 w-full overflow-hidden">
          <span className={`font-bold uppercase tracking-wider ${labelColorClass} shrink-0 text-[7px]`}>
            {row.label}:
          </span>
          <span className={`font-semibold ${textColorClass} text-right truncate text-[7.5px] ml-1`} title={row.value}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default IdCardDataRows;
