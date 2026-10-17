import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800">
        <p className="text-sm text-slate-500">No exam categories found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">
                  {cat.name}
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                  {cat.description || '—'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    cat.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {cat.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => onEdit(cat)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => onDelete(cat)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                      <Trash2 size={15} />
                    </button>
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

export default CategoryTable;
