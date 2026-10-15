import { Smartphone, CheckCircle2 } from 'lucide-react';

const AppStatsWidget = ({ stats, appStats }) => {
  const data = appStats || stats?.appDownloadStats || stats;
  const campuses = data?.campusBreakdown || [];

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
        <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40">
          <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-700 dark:text-indigo-400">Total Downloads</span>
          <p className="text-xl font-black text-ink dark:text-ink-dark mt-1">{data?.totalDownloads ?? 0}</p>
          <div className="flex items-center justify-between text-[11px] text-ink-muted mt-2">
            <span>Students: {data?.studentDownloads ?? 0}</span>
            <span>Staff: {data?.staffDownloads ?? 0}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
          <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">Active Users</span>
          <p className="text-xl font-black text-ink dark:text-ink-dark mt-1">{data?.activeUsers ?? 0}</p>
          <div className="w-full bg-emerald-200/50 dark:bg-emerald-900/40 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${data?.activePct ?? 0}%` }} />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 dark:text-blue-400">Student Strength</span>
          <p className="text-xl font-black text-ink dark:text-ink-dark mt-1">{data?.studentStrength ?? 0}</p>
          <div className="w-full bg-blue-200/50 dark:bg-blue-900/40 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${data?.studentDownloadPct ?? 0}%` }} />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
          <span className="text-[10px] font-bold tracking-wider uppercase text-amber-700 dark:text-amber-400">Staff Strength</span>
          <p className="text-xl font-black text-ink dark:text-ink-dark mt-1">{data?.staffStrength ?? 0}</p>
          <div className="w-full bg-amber-200/50 dark:bg-amber-900/40 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${data?.staffDownloadPct ?? 0}%` }} />
          </div>
        </div>
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

export default AppStatsWidget;
