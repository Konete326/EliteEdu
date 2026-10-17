import React from 'react';
import { Lock, Unlock } from 'lucide-react';

const MarkSheetLockTab = ({ markSheets, onToggleLock }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-xs">
      <div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Freeze Examination Marks</h3>
        <p className="text-xs text-slate-400">Locking results prevents teachers from modifying student scores after official verification.</p>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {markSheets.map(ms => (
          <div key={ms._id} className="py-3.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-xs text-slate-800 dark:text-white block">
                {ms.grade_id?.name} — {ms.subject_id?.name} ({ms.exam_category_id?.name || 'Exam'})
              </span>
              <span className="text-[11px] text-slate-400">
                Max Marks: {ms.max_marks} | Status: {ms.status}
              </span>
            </div>
            <button
              onClick={() => onToggleLock(ms._id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                ms.results_locked
                  ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              {ms.results_locked ? <><Lock size={13} /> Locked</> : <><Unlock size={13} /> Unlocked</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarkSheetLockTab;
