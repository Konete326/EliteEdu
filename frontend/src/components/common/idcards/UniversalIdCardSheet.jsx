import UniversalIdCard from './UniversalIdCard';

const UniversalIdCardSheet = ({
  holders = [],
  holderType = 'student',
  template = 'template_1_curve_blue',
  orientation = 'vertical',
  accentColor = '#003B73',
  sideMode = 'front',
  selectedIds = [],
  onToggleSelect,
  institution = {},
  pageIndex = 0,
  totalSheets = 1,
}) => {
  const isHoriz = orientation === 'horizontal';

  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-6 shadow-sm print:border-none print:shadow-none print:p-0 print:m-0 print:break-after-page">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-line dark:border-line-dark print:hidden text-xs text-ink-muted">
        <span className="font-semibold">
          Sheet {pageIndex + 1} of {totalSheets}
        </span>
        <span>{holders.length} {holderType === 'student' ? 'Students' : 'Faculty'} on this page</span>
      </div>

      <div
        className={
          isHoriz
            ? 'grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center print:grid-cols-2 print:gap-3 print:w-[297mm]'
            : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center print:grid-cols-4 print:gap-2.5 print:w-[200mm]'
        }
      >
        {holders.map((holder) => (
          <UniversalIdCard
            key={holder._id}
            holder={holder}
            holderType={holderType}
            template={template}
            orientation={orientation}
            accentColor={accentColor}
            sideMode={sideMode}
            institution={institution}
            isSelected={selectedIds.includes(holder._id)}
            onToggleSelect={() => onToggleSelect(holder._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default UniversalIdCardSheet;
