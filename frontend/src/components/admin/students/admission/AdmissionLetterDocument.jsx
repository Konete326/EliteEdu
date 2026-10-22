import { useState } from 'react';
import { Printer, Edit3, FileText, Table } from 'lucide-react';
import AdmissionLetterAccentBar from './AdmissionLetterAccentBar';
import AdmissionLetterHeader from './AdmissionLetterHeader';
import AdmissionLetterRecipient from './AdmissionLetterRecipient';
import AdmissionLetterBody from './AdmissionLetterBody';
import AdmissionLetterSignatures from './AdmissionLetterSignatures';
import AdmissionRegistrationStrip from './AdmissionRegistrationStrip';
import AdmissionParticularsTable from './AdmissionParticularsTable';
import AdmissionParentDetails from './AdmissionParentDetails';
import AdmissionFooterRules from './AdmissionFooterRules';

const AdmissionLetterDocument = ({ student, onQuickEditClick }) => {
  const [viewMode, setViewMode] = useState('letter');

  if (!student) {
    return (
      <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-12 text-center text-ink-muted">
        Select a student from the directory on the left to view and print their official admission letter.
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

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-line dark:border-white/10 p-0.5 bg-surface-secondary/40">
            <button
              type="button"
              onClick={() => setViewMode('letter')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'letter'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Offer Letter</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('sheet')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'sheet'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink dark:hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Particulars Form</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onQuickEditClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary text-xs font-semibold text-ink-sub dark:text-ink-sub-dark transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-primary" />
            <span>Quick Edit</span>
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

      {viewMode === 'letter' ? (
        <div
          style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
          className="relative bg-white text-black border border-line dark:border-white/10 rounded-2xl shadow-md p-6 sm:p-10 pl-10 sm:pl-14 space-y-4 max-w-[850px] mx-auto min-h-[1050px] print:p-4 print:pl-8 print:border-none print:shadow-none print:max-w-none print:m-0 print:rounded-none"
        >
          <AdmissionLetterAccentBar />
          <AdmissionLetterHeader student={student} />
          <AdmissionLetterRecipient student={student} />
          <AdmissionLetterBody student={student} />
          <AdmissionLetterSignatures student={student} />
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0c0c0f] border border-line dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm space-y-2.5 print:p-2 print:border-none print:shadow-none print:bg-white print:text-black">
          <AdmissionLetterHeader student={student} />
          <AdmissionRegistrationStrip student={student} />
          <AdmissionParticularsTable student={student} />
          <AdmissionParentDetails student={student} />
          <AdmissionFooterRules />
        </div>
      )}
    </div>
  );
};

export default AdmissionLetterDocument;
