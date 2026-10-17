import React from 'react';
import { Calendar, Eye, Trash2 } from 'lucide-react';

const DatesheetTable = ({ datesheets, onEdit, onDelete }) => {
  if (!datesheets || datesheets.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-16 text-center border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <Calendar size={24} />
        </div>
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No datesheets found</h4>
        <p className="text-xs text-slate-400">Adjust your filters or create a new datesheet to begin.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3.5">Session</th>
              <th className="px-4 py-3.5">Class</th>
              <th className="px-4 py-3.5">Section</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Exam Type</th>
              <th className="px-4 py-3.5">Exam Dates</th>
              <th className="px-4 py-3.5">Papers</th>
              <th className="px-4 py-3.5">Last Updated</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {datesheets.map(d => (
              <tr key={d._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-white">{d.session}</td>
                <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 font-semibold">{d.class_name}</td>
                <td className="px-4 py-3.5 text-slate-500">{d.section}</td>
                <td className="px-4 py-3.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    d.status === 'Published' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">{d.exam_type}</td>
                <td className="px-4 py-3.5 text-slate-500">{d.exam_dates}</td>
                <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-white">{d.papers_count}</td>
                <td className="px-4 py-3.5 text-slate-400">{d.last_updated}</td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onEdit(d._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary"><Eye size={15} /></button>
                    <button onClick={() => onDelete(d)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatesheetTable;
