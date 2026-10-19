import { useRef } from 'react';
import { X, Printer, Award, Star } from 'lucide-react';
import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const PrintableBehaviorReportModal = ({ record, isOpen, onClose }) => {
  const printRef = useRef(null);
  if (!isOpen || !record) return null;

  const s = record.student_id || {};
  const g = record.grade_id || {};
  const aff = record.affective_ratings || {};
  const psy = record.psychomotor_ratings || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-surface-dark rounded-2xl border border-line shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-line print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black text-ink dark:text-ink-dark">
              Print Student Character & Behavior Certificate
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-secondary text-ink-muted">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={printRef} className="p-8 overflow-y-auto print:p-0 space-y-5 text-ink dark:text-ink-dark text-xs">
          <div className="flex items-start justify-between border-b-2 border-line pb-4">
            <div>
              <h1 className="text-xl font-black tracking-tight text-ink">ELITE EDUCATION SYSTEM</h1>
              <p className="font-semibold text-ink-muted">Student Character, Behavioral & Psychomotor Skills Profile</p>
              <p className="text-[10px] text-ink-muted font-bold mt-0.5">Evaluation Period: {record.term_name || 'Academic Term'}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 border border-amber-500/30">
                {record.badge_type ? record.badge_type.replace('_', ' ') : 'Good Conduct'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-secondary/40 border border-line">
            <div>
              <span className="text-[10px] uppercase font-bold text-ink-muted block">Student Name</span>
              <span className="font-bold text-ink text-sm">{s.name || 'Student Name'}</span>
              <span className="text-[10px] text-ink-muted block font-mono">{s.roll_number ? `Roll No: ${s.roll_number}` : ''}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-ink-muted block">Class & Section</span>
              <span className="font-bold text-ink text-sm">{g.name || 'Grade'} - {record.section || 'A'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <h4 className="font-bold text-emerald-600 uppercase text-[10px] tracking-wider border-b border-line pb-1">
                Affective Domain (Values & Conduct)
              </h4>
              {Object.entries(aff).map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-line/40">
                  <span className="text-ink-muted capitalize">{k}</span>
                  <span className="font-bold text-emerald-600 font-mono">{v} / 5</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-primary uppercase text-[10px] tracking-wider border-b border-line pb-1">
                Psychomotor Domain (Skills & Creativity)
              </h4>
              {Object.entries(psy).map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-line/40">
                  <span className="text-ink-muted capitalize">{k.replace('_', ' ')}</span>
                  <span className="font-bold text-primary font-mono">{v} / 5</span>
                </div>
              ))}
            </div>
          </div>

          {record.teacher_observation && (
            <div className="p-3 rounded-xl bg-surface-secondary/30 border border-line">
              <span className="text-[10px] uppercase font-bold text-ink-muted block mb-1">Teacher's Professional Observation:</span>
              <p className="font-semibold text-ink italic">"{record.teacher_observation}"</p>
            </div>
          )}

          <div className="pt-4">
            <OfficialSignatureStampBlock signatureTitle="Class In-Charge / Counselor" stampTitle="Principal's Academic Seal" />
          </div>

          <div className="pt-2 border-t border-line text-center text-[9px] text-ink-muted flex items-center justify-between">
            <span>EliteEdu Educational ERP • Character Development Module</span>
            <span>Printed on: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableBehaviorReportModal;
