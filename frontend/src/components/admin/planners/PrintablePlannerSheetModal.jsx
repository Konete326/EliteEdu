import { useRef } from 'react';
import { X, Printer, BookOpen } from 'lucide-react';
import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const PrintablePlannerSheetModal = ({ records = [], activeTab, isOpen, onClose }) => {
  const printRef = useRef(null);
  if (!isOpen) return null;

  const isLesson = activeTab === 'Lesson_Plan';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-surface dark:bg-surface-dark rounded-2xl border border-line shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-line print:hidden">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black text-ink dark:text-ink-dark">
              Printable {isLesson ? 'Weekly Lesson Plan Routine' : 'Academic Events & Circular Roster'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Sheet</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-secondary text-ink-muted">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={printRef} className="p-8 overflow-y-auto print:p-0 space-y-4 text-ink text-xs select-text">
          <div className="text-center border-b-2 border-line pb-3">
            <h1 className="text-base font-black tracking-tight">ELITE EDUCATION SYSTEM</h1>
            <p className="font-semibold text-ink-muted text-[11px]">
              {isLesson ? 'Institutional Lesson Plan & Instructional Milestone Schedule' : 'Official Academic Event, PTM & Holiday Circular'}
            </p>
            <p className="text-[10px] text-ink-muted font-mono pt-1">
              Active Entries: {records.length} • Generated on {new Date().toLocaleDateString()}
            </p>
          </div>

          <table className="w-full text-left border-collapse border border-line text-[11px]">
            <thead>
              <tr className="bg-surface-secondary text-ink-muted font-bold border-b border-line">
                <th className="p-2 border-r border-line">Date</th>
                <th className="p-2 border-r border-line">{isLesson ? 'Class & Subject' : 'Event Type'}</th>
                <th className="p-2 border-r border-line">Topic / Title</th>
                <th className="p-2 border-r border-line">{isLesson ? 'Objectives & Aids' : 'Notice Details'}</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {records.map((r) => (
                <tr key={r._id}>
                  <td className="p-2 border-r border-line font-mono whitespace-nowrap">{new Date(r.start_date).toLocaleDateString()}</td>
                  <td className="p-2 border-r border-line font-bold whitespace-nowrap">
                    {isLesson ? `${r.grade_id?.name || 'Class'} (${r.section}) • ${r.subject_id?.name || ''}` : r.record_type.replace('_', ' ')}
                  </td>
                  <td className="p-2 border-r border-line font-bold">{r.title}</td>
                  <td className="p-2 border-r border-line text-[10px] text-ink-muted">
                    {isLesson ? (r.learning_objectives || r.teaching_aids || '-') : (r.description || '-')}
                  </td>
                  <td className="p-2 text-center font-bold text-[10px]">{r.status.replace('_', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-4">
            <OfficialSignatureStampBlock
              signatureTitle="Academic Coordinator"
              stampTitle="Institutional Stamp"
              compact={true}
            />
          </div>

          <div className="pt-2 border-t border-line flex items-center justify-between text-[9px] text-ink-muted">
            <span>Verified by Directorate of Academics &amp; Quality Assurance</span>
            <span className="font-black tracking-widest uppercase opacity-70 text-[10px] text-primary">EliteEdu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintablePlannerSheetModal;
