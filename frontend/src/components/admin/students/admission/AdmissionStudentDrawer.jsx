import { X, Users } from 'lucide-react';
import AdmissionStudentSelector from './AdmissionStudentSelector';

const AdmissionStudentDrawer = ({
  isOpen,
  onClose,
  students = [],
  selectedStudent,
  onSelectStudent,
  searchQuery,
  onSearchChange,
  campuses = [],
  selectedCampus,
  onCampusChange,
  grades = [],
  selectedGrade,
  onGradeChange,
  currentPage,
  totalPages,
  onPageChange,
  loading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-surface dark:bg-[#0c0c0f] border-l border-line dark:border-white/10 shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-line dark:border-white/10 flex items-center justify-between bg-surface-secondary/20">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-ink dark:text-white">Select Student for Letter</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-surface-secondary text-ink-muted hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <AdmissionStudentSelector
            students={students}
            selectedStudent={selectedStudent}
            onSelectStudent={(stu) => {
              onSelectStudent(stu);
              onClose();
            }}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            campuses={campuses}
            selectedCampus={selectedCampus}
            onCampusChange={onCampusChange}
            grades={grades}
            selectedGrade={selectedGrade}
            onGradeChange={onGradeChange}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AdmissionStudentDrawer;
