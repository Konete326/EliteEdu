import React from 'react';
import { MessageSquare, Edit2, Trash2 } from 'lucide-react';

const RemarkTable = ({ remarks, onEdit, onDelete }) => {
  if (!remarks || remarks.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-16 text-center border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <MessageSquare size={24} />
        </div>
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No remarks</h4>
        <p className="text-xs text-slate-400">Create your first remark template to begin.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Subjects</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {remarks.map(rem => (
            <tr key={rem._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
              <td className="px-6 py-4">
                <span className="font-semibold text-slate-800 dark:text-white block">{rem.name}</span>
                {rem.text && <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{rem.text}</span>}
              </td>
              <td className="px-6 py-4">
                {!rem.subjects || rem.subjects.length === 0 ? (
                  <span className="text-[11px] text-slate-400 italic">All Subjects</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {rem.subjects.map(s => (
                      <span key={s._id || s} className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 font-medium">
                        {s.name || s}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button onClick={() => onEdit(rem)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => onDelete(rem)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RemarkTable;
