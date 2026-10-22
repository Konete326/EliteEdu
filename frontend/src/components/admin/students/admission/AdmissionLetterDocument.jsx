import { useState } from 'react';
import { Printer, Edit3, FileText, Table, SlidersHorizontal, Users } from 'lucide-react';
import AdmissionLetterAccentBar from './AdmissionLetterAccentBar';
import AdmissionLetterHeader from './AdmissionLetterHeader';
import AdmissionLetterRecipient from './AdmissionLetterRecipient';
import AdmissionLetterBody from './AdmissionLetterBody';
import AdmissionLetterSignatures from './AdmissionLetterSignatures';
import AdmissionRegistrationStrip from './AdmissionRegistrationStrip';
import AdmissionParticularsTable from './AdmissionParticularsTable';
import AdmissionParentDetails from './AdmissionParentDetails';
import AdmissionFooterRules from './AdmissionFooterRules';

const AdmissionLetterDocument = ({
  student,
  template,
  templates = [],
  onSelectTemplate,
  onEditTemplate,
  onQuickEditClick,
  onOpenStudentDrawer
}) => {
  const [viewMode, setViewMode] = useState('letter');

  if (!student) {
    return (
      <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-12 text-center text-ink-muted">
        Select a student from the directory to view and print their official admission letter.
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-3.5 px-5 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenStudentDrawer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary text-xs font-bold text-ink dark:text-white transition-colors cursor-pointer"
            title="Open student picker"
          >
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>Switch Student</span>
          </button>

          <div>
            <span className="text-xs font-bold text-ink dark:text-white block">
              {student.name}
            </span>
            <p className="text-[11px] text-ink-muted">
              GR: <span className="font-mono font-bold text-primary">{student.gr_number}</span> •{' '}
              {student.current_grade?.name || 'Class'} ({student.current_section || 'A'})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {templates.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-ink-muted hidden sm:inline">Template:</span>
              <select
                value={template?._id || ''}
                onChange={(e) => {
                  const found = templates.find((t) => t._id === e.target.value);
                  if (found) onSelectTemplate(found);
                }}
                className="px-2.5 py-1.5 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#16161d] text-xs font-semibold text-ink dark:text-white outline-none cursor-pointer"
              >
                {templates.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.title} {t.is_default ? '(Default)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

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

          {template && onEditTemplate && (
            <button
              type="button"
              onClick={() => onEditTemplate(template)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-xs font-bold text-primary transition-colors cursor-pointer"
              title="Edit template rules and clauses"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Edit Rules</span>
            </button>
          )}

          <button
            type="button"
            onClick={onQuickEditClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary text-xs font-semibold text-ink dark:text-white transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Student Details</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        {viewMode === 'letter' ? (
          <div
            style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
            className="relative bg-white text-black border border-line dark:border-white/10 rounded-2xl shadow-md p-6 sm:p-10 pl-10 sm:pl-14 space-y-4 max-w-[850px] mx-auto min-h-[1050px] print:p-4 print:pl-8 print:border-none print:shadow-none print:max-w-none print:m-0 print:rounded-none"
          >
            <AdmissionLetterAccentBar template={template} />
            <AdmissionLetterHeader student={student} template={template} />
            <AdmissionLetterRecipient student={student} />
            <AdmissionLetterBody student={student} template={template} />
            <AdmissionLetterSignatures student={student} template={template} />
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0c0c0f] border border-line dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm space-y-2.5 max-w-[850px] mx-auto print:p-2 print:border-none print:shadow-none print:bg-white print:text-black">
            <AdmissionLetterHeader student={student} template={template} />
            <AdmissionRegistrationStrip student={student} />
            <AdmissionParticularsTable student={student} />
            <AdmissionParentDetails student={student} />
            <AdmissionFooterRules />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionLetterDocument;
