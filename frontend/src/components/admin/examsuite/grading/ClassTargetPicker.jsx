import React from 'react';

const ClassTargetPicker = ({ applyToAll, targetGrades, grades, onToggleApply, onToggleGrade }) => {
  return (
    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">Apply to all classes</span>
          <span className="text-[11px] text-slate-400">If on, this policy is used for every class. Otherwise, pick specific classes.</span>
        </div>
        <button
          type="button"
          onClick={onToggleApply}
          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
            applyToAll !== false ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
          }`}
        >
          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
            applyToAll !== false ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
      </div>

      {applyToAll === false && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          {(grades || []).map(g => (
            <button
              key={g._id}
              type="button"
              onClick={() => onToggleGrade(g._id)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                (targetGrades || []).includes(g._id)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassTargetPicker;
