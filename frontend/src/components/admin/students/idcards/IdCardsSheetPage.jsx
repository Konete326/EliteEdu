import StudentIdCardItem from './StudentIdCardItem';

const IdCardsSheetPage = ({
  students = [],
  pageIndex,
  totalSheets,
  selectedStyle,
  selectedIds,
  onToggleSelect,
  config
}) => {
  return (
    <div className="space-y-2 print:space-y-0 print:m-0 print:p-0">
      <div className="flex items-center justify-between text-xs text-ink-muted print:hidden px-1">
        <span className="font-bold">Sheet {pageIndex + 1} of {totalSheets}</span>
        <span>{students.length} Cards on this sheet (8 Max per A4)</span>
      </div>

      <div className="bg-surface-secondary/20 dark:bg-white/[0.02] border border-line dark:border-line-dark rounded-2xl p-4 shadow-xs print:p-0 print:bg-white print:border-none print:shadow-none print:rounded-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2.5 print:w-[200mm] print:mx-auto">
          {students.map((student) => (
            <StudentIdCardItem
              key={student._id}
              student={student}
              selectedStyle={selectedStyle}
              isSelected={selectedIds.includes(student._id)}
              onToggleSelect={onToggleSelect}
              config={config}
            />
          ))}
        </div>
      </div>

      <div className="hidden print:block print:break-after-page" />
    </div>
  );
};

export default IdCardsSheetPage;
