import TeacherServiceCardItem from './TeacherServiceCardItem';

const TeacherServiceCardsSheet = ({
  teachers = [],
  pageIndex,
  totalSheets,
  selectedStyle,
  sideMode,
  selectedIds,
  onToggleSelect,
  onEditTeacher,
  config
}) => {
  return (
    <div className="space-y-2 print:space-y-0 print:m-0 print:p-0">
      <div className="flex items-center justify-between text-xs text-ink-muted print:hidden px-1">
        <span className="font-bold">Service Sheet {pageIndex + 1} of {totalSheets}</span>
        <span>{teachers.length} Cards on this sheet (8 Max per A4)</span>
      </div>

      <div className="bg-surface-secondary/20 dark:bg-white/[0.02] border border-line dark:border-line-dark rounded-2xl p-4 shadow-xs print:p-0 print:bg-white print:border-none print:shadow-none print:rounded-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2.5 print:w-[200mm] print:mx-auto">
          {teachers.map((teacher) => (
            <TeacherServiceCardItem
              key={teacher._id}
              teacher={teacher}
              selectedStyle={selectedStyle}
              sideMode={sideMode}
              isSelected={selectedIds.includes(teacher._id)}
              onToggleSelect={onToggleSelect}
              onEditTeacher={onEditTeacher}
              config={config}
            />
          ))}
        </div>
      </div>

      <div className="hidden print:block print:break-after-page" />
    </div>
  );
};

export default TeacherServiceCardsSheet;
