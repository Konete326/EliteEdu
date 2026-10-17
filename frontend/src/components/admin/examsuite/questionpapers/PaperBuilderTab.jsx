import React, { useState } from 'react';
import { Sparkles, Printer, FileText, Trash2 } from 'lucide-react';
import AutoGeneratePaperModal from './AutoGeneratePaperModal';
import PrintQuestionPaperModal from './PrintQuestionPaperModal';

const PaperBuilderTab = ({ papers, grades, subjects, chapters, onGeneratePaper, onDeletePaper }) => {
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [printPaper, setPrintPaper] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Assessment Question Papers</h3>
          <p className="text-xs text-slate-400">Generate, review, and print Board-standard examination sheets.</p>
        </div>
        <button onClick={() => setGenerateModalOpen(true)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs">
          <Sparkles size={15} /> 1-Click Auto-Generate Paper
        </button>
      </div>

      {papers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-16 text-center border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <FileText size={24} />
          </div>
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No question papers created yet</h4>
          <p className="text-xs text-slate-400">Click Auto-Generate Paper to create an A4 board paper instantly.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Class</th>
                <th className="px-5 py-3.5">Subject</th>
                <th className="px-5 py-3.5">Total Marks</th>
                <th className="px-5 py-3.5">Duration</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {papers.map(p => (
                <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-white">{p.title}</td>
                  <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-semibold">{p.grade_id?.name || 'Class'}</td>
                  <td className="px-5 py-3.5 text-slate-500">{p.subject_id?.name || 'Subject'}</td>
                  <td className="px-5 py-3.5 font-bold text-primary">{p.total_marks} Marks</td>
                  <td className="px-5 py-3.5 text-slate-500">{p.duration_minutes || 120} Mins</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setPrintPaper(p)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20">
                        <Printer size={13} /> Print Sheet
                      </button>
                      <button onClick={() => onDeletePaper(p._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AutoGeneratePaperModal isOpen={generateModalOpen} onClose={() => setGenerateModalOpen(false)} onGenerate={onGeneratePaper} grades={grades} subjects={subjects} chapters={chapters} />
      <PrintQuestionPaperModal isOpen={!!printPaper} paper={printPaper} onClose={() => setPrintPaper(null)} />
    </div>
  );
};

export default PaperBuilderTab;
