import { Printer, Edit3 } from 'lucide-react';
import AdmissionFormHeader from './AdmissionFormHeader';
import AdmissionRegistrationStrip from './AdmissionRegistrationStrip';
import AdmissionParticularsTable from './AdmissionParticularsTable';
import AdmissionParentDetails from './AdmissionParentDetails';
import AdmissionFooterRules from './AdmissionFooterRules';

const AdmissionFormDocument = ({ student, onQuickEditClick }) => {
  if (!student) {
    return (
      <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-12 text-center text-ink-muted">
        Select a student from the directory on the left to view and print their official admission form.
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-3.5 px-5 shadow-xs print:hidden">
        <div>
          <span className="text-xs font-bold text-ink dark:text-ink-dark">
            Admission Record: {student.name}
          </span>
          <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">
            GR: {student.gr_number} • Class: {student.current_grade?.name || 'Class'} ({student.current_section || 'A'})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onQuickEditClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary text-xs font-semibold text-ink-sub dark:text-ink-sub-dark transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-primary" />
            <span>Quick Edit Details</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0c0c0f] border border-line dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm space-y-2.5 print:p-2 print:border-none print:shadow-none print:bg-white print:text-black">
        <AdmissionFormHeader student={student} />
        <AdmissionRegistrationStrip student={student} />
        <AdmissionParticularsTable student={student} />
        <AdmissionParentDetails student={student} />
        <AdmissionFooterRules />
      </div>
    </div>
  );
};

export default AdmissionFormDocument;
