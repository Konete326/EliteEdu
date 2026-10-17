import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ClassTargetPicker from '../grading/ClassTargetPicker';

const RemarkPolicyCard = ({ policy, index, total, grades, onChange, onAddAfter, onRemove }) => {
  const isNew = !policy._id;
  const isRemarkMissing = !policy.remark?.trim();
  const isFromMissing = policy.from_percent === '' || policy.from_percent === undefined || isNaN(policy.from_percent);
  const isToMissing = policy.to_percent === '' || policy.to_percent === undefined || isNaN(policy.to_percent);

  const toggleGrade = (gradeId) => {
    const current = Array.isArray(policy.target_grades) ? [...policy.target_grades] : [];
    const idx = current.indexOf(gradeId);
    if (idx > -1) current.splice(idx, 1);
    else current.push(gradeId);
    onChange({ ...policy, target_grades: current });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          POLICY #{index + 1} {isNew ? '(NEW)' : ''}
        </span>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={onAddAfter} className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800" title="Add policy card">
            <Plus size={16} />
          </button>
          {total > 1 && (
            <button type="button" onClick={onRemove} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" title="Delete policy card">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Type *</label>
          <select value={policy.type || 'Teacher'} onChange={(e) => onChange({ ...policy, type: e.target.value })} className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-white">
            <option value="Teacher">Teacher</option>
            <option value="Principal">Principal</option>
          </select>
        </div>
        <div className="sm:col-span-5">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Remark *</label>
          <input type="text" value={policy.remark || ''} onChange={(e) => onChange({ ...policy, remark: e.target.value })} placeholder="Excellent, Good, Needs improvement..." className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-white" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">From *</label>
          <input type="number" min="0" max="100" value={policy.from_percent ?? ''} onChange={(e) => onChange({ ...policy, from_percent: e.target.value })} className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-white text-center" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">To *</label>
          <input type="number" min="0" max="100" value={policy.to_percent ?? ''} onChange={(e) => onChange({ ...policy, to_percent: e.target.value })} className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-white text-center" />
        </div>
      </div>

      <ClassTargetPicker
        applyToAll={policy.apply_to_all_classes}
        targetGrades={policy.target_grades}
        grades={grades}
        onToggleApply={() => onChange({ ...policy, apply_to_all_classes: !policy.apply_to_all_classes })}
        onToggleGrade={toggleGrade}
      />

      {(isRemarkMissing || isFromMissing || isToMissing) && (
        <ul className="text-[11px] text-red-500 space-y-0.5 pt-1">
          {isRemarkMissing && <li>• Remark is required</li>}
          {isFromMissing && <li>• From is required</li>}
          {isToMissing && <li>• To is required</li>}
        </ul>
      )}
    </div>
  );
};

export default RemarkPolicyCard;
