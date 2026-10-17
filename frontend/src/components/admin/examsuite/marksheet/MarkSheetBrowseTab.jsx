import React from 'react';
import { ClipboardList, Edit3, Lock, Unlock, Trash2 } from 'lucide-react';

const MarkSheetBrowseTab = ({ markSheets, onEnterMarks, onToggleLock, onDelete }) => {
  return (
    <div className="space-y-3">
      <div className="text-xs text-slate-400 font-medium">
        {markSheets.length} sheet(s)
      </div>

      {markSheets.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-16 text-center border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <ClipboardList size={24} />
          </div>
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No mark sheets found for these filters.</h4>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Class</th>
                  <th className="px-4 py-3.5">Subject</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Max Marks</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {markSheets.map(ms => (
                  <tr key={ms._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-white">{ms.grade_id?.name || 'Class'}</td>
                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 font-semibold">{ms.subject_id?.name || 'Subject'}</td>
                    <td className="px-4 py-3.5 text-slate-500">{ms.exam_category_id?.name || 'Standard Exam'}</td>
                    <td className="px-4 py-3.5 text-slate-400">{ms.exam_date ? new Date(ms.exam_date).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-white">{ms.max_marks}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        ms.status === 'Locked' ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400' :
                        ms.status === 'Submitted' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                        'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}>
                        {ms.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => onEnterMarks(ms._id)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20">
                          <Edit3 size={13} /> Enter Marks
                        </button>
                        <button onClick={() => onToggleLock(ms._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
                          {ms.results_locked ? <Lock size={14} className="text-red-500" /> : <Unlock size={14} />}
                        </button>
                        <button onClick={() => onDelete(ms)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkSheetBrowseTab;
