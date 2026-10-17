import React, { useState } from 'react';
import { X, Printer, Key, FileText } from 'lucide-react';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';

const PrintQuestionPaperModal = ({ isOpen, onClose, paper }) => {
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  if (!isOpen || !paper) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[95vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAnswerKey(false)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${!showAnswerKey ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300'}`}>
              <FileText size={14} /> Student Question Paper
            </button>
            <button onClick={() => setShowAnswerKey(true)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${showAnswerKey ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300'}`}>
              <Key size={14} /> Teacher Answer Key
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover">
              <Printer size={14} /> Print A4 Sheet
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-200"><X size={18} /></button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto bg-white text-slate-900 font-serif space-y-6">
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <h2 className="text-xl font-bold uppercase tracking-wider">{paper.title}</h2>
            <div className="flex justify-between text-xs font-sans font-semibold pt-2">
              <span>CLASS: {paper.grade_id?.name || 'Class'}</span>
              <span>SUBJECT: {paper.subject_id?.name || 'Subject'}</span>
              <span>TIME: {paper.duration_minutes || 120} MINS</span>
              <span>MAX MARKS: {paper.total_marks}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-sans pt-2">
              <div className="flex items-center gap-2">
                <span>STUDENT ROLL NO:</span>
                <span className="inline-block border border-slate-400 w-32 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span>STUDENT NAME:</span>
                <span className="inline-block border-b border-slate-400 w-48 h-6" />
              </div>
            </div>
          </div>

          {(paper.sections || []).map((sec, sIdx) => (
            <div key={sIdx} className="space-y-3">
              <div className="bg-slate-100 p-2 font-sans font-bold text-xs uppercase flex justify-between">
                <span>{sec.title}</span>
                <span className="font-normal italic lowercase">{sec.instructions}</span>
              </div>
              <div className="space-y-3 font-sans text-xs pl-2">
                {(sec.questions || []).map((q, qIdx) => (
                  <div key={qIdx} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>Q{qIdx + 1}. {q.question_text}</span>
                      <span className="text-slate-500 font-normal font-mono">[{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]</span>
                    </div>
                    {q.question_type === 'MCQ' && q.options?.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pl-4 text-[11px] text-slate-700">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full border border-slate-400 inline-flex items-center justify-center text-[10px]">{String.fromCharCode(65 + oIdx)}</span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {showAnswerKey && q.correct_answer && (
                      <div className="pl-4 text-[11px] font-mono text-emerald-800 bg-emerald-50 p-1.5 rounded-sm">
                        Answer Key: {q.correct_answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-6">
            <OfficialSignatureStampBlock
              signatureTitle="Examiner Signature"
              stampTitle="Principal / Controller Stamp"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintQuestionPaperModal;
