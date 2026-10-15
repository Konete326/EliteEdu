import { useState } from 'react';
import { FileText, Search } from 'lucide-react';

const HomeworkWidget = ({ stats, homeworkSummary }) => {
  const [filter, setFilter] = useState('');
  const data = homeworkSummary || stats?.homeworkSummary || stats;
  const campuses = data?.campusBreakdown || [];

  const filtered = campuses.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.sub.toLowerCase().includes(filter.toLowerCase())
  );

  const counters = [
    { label: 'TOTAL', count: data?.total ?? 0, color: 'bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50' },
    { label: 'ASSIGNED', count: data?.assigned ?? 0, color: 'bg-emerald-50/80 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' },
    { label: 'PUBLISHED', count: data?.published ?? 0, color: 'bg-cyan-50/80 text-cyan-700 dark:bg-cyan-950/20 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/50' },
    { label: 'UNASSIGNED', count: data?.unassigned ?? 0, color: 'bg-amber-50/80 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' },
    { label: 'UNPUBLISHED', count: data?.unpublished ?? 0, color: 'bg-rose-50/80 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-200 dark:border-rose-900/50' }
  ];

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-ink dark:text-ink-dark">Homework</h2>
            <p className="text-[11px] text-ink-muted">{data?.campusesAssigned || '0 / 0'} Campuses assigned homework</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {counters.map((c) => (
          <div key={c.label} className={`p-2.5 rounded-xl border text-center ${c.color}`}>
            <span className="text-[9px] font-bold uppercase tracking-wider block opacity-80">{c.label}</span>
            <span className="text-lg font-black block mt-0.5">{c.count}</span>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search by campus..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark placeholder:text-ink-muted focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-line dark:border-line-dark text-ink-muted text-[11px]">
              <th className="pb-2 font-medium">Campus</th>
              <th className="pb-2 font-medium text-center">Assigned</th>
              <th className="pb-2 font-medium text-center">Published</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 dark:divide-line-dark/60 text-[11px]">
            {filtered.length > 0 ? (
              filtered.map((c, i) => (
                <tr key={i} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="py-2.5">
                    <p className="font-semibold text-ink dark:text-ink-dark">{c.name}</p>
                    <p className="text-[10px] text-ink-muted">{c.sub}</p>
                  </td>
                  <td className="py-2.5 text-center font-medium text-primary">{c.assigned}</td>
                  <td className="py-2.5 text-center font-medium text-cyan-600 dark:text-cyan-400">{c.published}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-6 text-center text-ink-muted">
                  No campus homework records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomeworkWidget;
