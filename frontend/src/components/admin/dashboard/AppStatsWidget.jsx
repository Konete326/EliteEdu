import { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, CheckCircle2, ArrowUpRight } from 'lucide-react';

const AppStatsWidget = ({ stats, appStats }) => {
  const data = appStats || stats?.appDownloadStats || stats;
  const campuses = data?.campusBreakdown || [];

  const cards = useMemo(() => [
    { title: 'Total Downloads', val: data?.totalDownloads ?? 0, sub: `Students: ${data?.studentDownloads ?? 0} | Staff: ${data?.staffDownloads ?? 0}`, theme: 'text-indigo-700 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-200/60 dark:border-indigo-900/40', path: '/admin/students' },
    { title: 'Active Users', val: data?.activeUsers ?? 0, bar: data?.activePct ?? 0, barColor: 'bg-emerald-500', theme: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40', path: '/admin/students' },
    { title: 'Student Strength', val: data?.studentStrength ?? 0, bar: data?.studentDownloadPct ?? 0, barColor: 'bg-blue-500', theme: 'text-blue-700 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-900/40', path: '/admin/students' },
    { title: 'Staff Strength', val: data?.staffStrength ?? 0, bar: data?.staffDownloadPct ?? 0, barColor: 'bg-amber-500', theme: 'text-amber-700 dark:text-amber-400 bg-amber-50/70 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40', path: '/admin/teachers' }
  ], [data]);

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark">
            <Smartphone className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-ink dark:text-ink-dark">App Download Statistics</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-3 h-3" />
          <span>Active</span>
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <Link
            key={c.title}
            to={c.path}
            className={`p-3.5 rounded-xl border ${c.theme} hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer block group`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase">{c.title}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xl font-black text-ink dark:text-ink-dark mt-1">{c.val}</p>
            {c.sub ? (
              <p className="text-[11px] text-ink-muted mt-2 truncate">{c.sub}</p>
            ) : (
              <div className="w-full bg-surface-secondary dark:bg-surface-secondary-dark h-1.5 rounded-full overflow-hidden mt-3">
                <div className={`${c.barColor} h-full rounded-full`} style={{ width: `${c.bar}%` }} />
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-line dark:border-line-dark text-ink-muted">
              <th className="pb-2 font-medium">Campus</th>
              <th className="pb-2 font-medium">Downloads</th>
              <th className="pb-2 font-medium">Active Users</th>
              <th className="pb-2 font-medium">Students</th>
              <th className="pb-2 font-medium">Staff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 dark:divide-line-dark/60">
            {campuses.map((c, i) => (
              <tr key={i} className="hover:bg-surface-secondary/40 transition-colors">
                <td className="py-2.5">
                  <p className="font-semibold text-ink dark:text-ink-dark">{c.name}</p>
                  <p className="text-[11px] text-ink-muted">{c.sub}</p>
                </td>
                <td className="py-2.5 font-medium">{c.downloads}</td>
                <td className="py-2.5 font-semibold text-emerald-600 dark:text-emerald-400">{c.activeUsers}</td>
                <td className="py-2.5">
                  <span className="text-primary font-medium">{c.students}</span>
                  <div className="w-16 bg-line dark:bg-line-dark h-1 rounded-full mt-1 overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${c.studentPct}%` }} />
                  </div>
                </td>
                <td className="py-2.5">
                  <span className="text-amber-600 font-medium">{c.staff}</span>
                  <div className="w-16 bg-line dark:bg-line-dark h-1 rounded-full mt-1 overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{ width: `${c.staffPct}%` }} />
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

export default memo(AppStatsWidget);
