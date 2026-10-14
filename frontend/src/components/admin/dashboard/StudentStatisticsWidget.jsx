import { Users } from 'lucide-react';

const StudentStatisticsWidget = ({ studentStats }) => {
  const stats = studentStats || {
    enquiries: { total: 0, boys: 0, girls: 0 },
    registrations: { total: 0, boys: 0, girls: 0 },
    admissions: { total: 0, boys: 0, girls: 0 },
    campusBreakdown: []
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Student Statistics</h3>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30">
          <p className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400">Inquiries</p>
          <p className="text-base font-black text-ink dark:text-ink-dark">{stats.enquiries?.total || 0}</p>
          <div className="flex gap-1 mt-1 text-[9px] font-semibold text-blue-600 dark:text-blue-400">
            <span>B: {stats.enquiries?.boys || 0}</span>
            <span>•</span>
            <span>G: {stats.enquiries?.girls || 0}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30">
          <p className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Registered</p>
          <p className="text-base font-black text-ink dark:text-ink-dark">{stats.registrations?.total || 0}</p>
          <div className="flex gap-1 mt-1 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span>B: {stats.registrations?.boys || 0}</span>
            <span>•</span>
            <span>G: {stats.registrations?.girls || 0}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/30">
          <p className="text-[10px] uppercase font-bold text-violet-700 dark:text-violet-400">Admissions</p>
          <p className="text-base font-black text-ink dark:text-ink-dark">{stats.admissions?.total || 0}</p>
          <div className="flex gap-1 mt-1 text-[9px] font-semibold text-violet-600 dark:text-violet-400">
            <span>B: {stats.admissions?.boys || 0}</span>
            <span>•</span>
            <span>G: {stats.admissions?.girls || 0}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-line dark:border-line-dark text-[11px] text-ink-muted">
              <th className="pb-2 font-medium">Campus</th>
              <th className="pb-2 text-center font-medium">Inquiries</th>
              <th className="pb-2 text-center font-medium">Registered</th>
              <th className="pb-2 text-right font-medium">Admissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/40 dark:divide-line-dark/40 font-medium text-ink dark:text-ink-dark">
            {stats.campusBreakdown?.map((c, i) => (
              <tr key={i} className="hover:bg-surface-secondary/40">
                <td className="py-2 pr-2">
                  <p className="font-semibold text-xs truncate max-w-[100px]">{c.name}</p>
                  <p className="text-[10px] text-ink-muted">{c.sub}</p>
                </td>
                <td className="py-2 text-center text-blue-600 font-bold">{c.inquiries || 0}</td>
                <td className="py-2 text-center text-emerald-600 font-bold">{c.registered || 0}</td>
                <td className="py-2 text-right text-violet-600 font-bold">{c.admissions || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentStatisticsWidget;
