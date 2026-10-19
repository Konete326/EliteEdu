const IdCardDataRows = ({
  rows = [],
  textColorClass = 'text-slate-700',
  labelColorClass = 'text-slate-500',
  fontSize = 'text-[7.5px]',
}) => {
  const visible = rows.filter((r) => r.value).slice(0, 6);

  return (
    <div className={`flex flex-col gap-[2px] w-full ${fontSize}`}>
      {visible.map((row, i) => (
        <div key={i} className="flex items-center justify-between gap-1 w-full">
          <span className={`font-semibold uppercase tracking-wide ${labelColorClass} shrink-0`}>
            {row.label}
          </span>
          <span className={`${textColorClass} text-right truncate ml-1`}>{row.value}</span>
        </div>
      ))}
    </div>
  );
};

export default IdCardDataRows;
