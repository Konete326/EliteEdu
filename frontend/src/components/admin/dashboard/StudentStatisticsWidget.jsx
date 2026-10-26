import { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowUpRight } from 'lucide-react';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

const StudentStatisticsWidget = ({ studentStats }) => {
  const stats = studentStats || {
    enquiries: { total: 0, boys: 0, girls: 0 },
    registrations: { total: 0, boys: 0, girls: 0 },
    admissions: { total: 0, boys: 0, girls: 0 },
    campusBreakdown: []
  };

  const items = useMemo(() => [
    { label: 'Inquiries', data: stats.enquiries, path: '/admin/crm/inquiries', theme: 'text-blue-700 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/30' },
    { label: 'Registered', data: stats.registrations, path: '/admin/crm/admissions', theme: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30' },
    { label: 'Admissions', data: stats.admissions, path: '/admin/students', theme: 'text-violet-700 dark:text-violet-400 bg-violet-50/60 dark:bg-violet-950/30 border-violet-100 dark:border-violet-900/30' }
  ], [stats.enquiries, stats.registrations, stats.admissions]);

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
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`p-2.5 rounded-xl border ${item.theme} hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 cursor-pointer block group`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold">{item.label}</p>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-base font-black text-ink dark:text-ink-dark">
              <AnimatedNumber value={item.data?.total || 0} />
            </p>
            <div className="flex gap-1 mt-1 text-[9px] font-semibold opacity-90">
              <span>B: <AnimatedNumber value={item.data?.boys || 0} /></span>
              <span>•</span>
              <span>G: <AnimatedNumber value={item.data?.girls || 0} /></span>
            </div>
          </Link>
        ))}
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
            {stats.campusBreakdown && stats.campusBreakdown.length > 0 ? (
              stats.campusBreakdown.map((c, i) => (
                <tr key={i} className="hover:bg-surface-secondary/40">
                  <td className="py-2 pr-2">
                    <p className="font-semibold text-xs truncate max-w-[100px]">{c.name}</p>
                    <p className="text-[10px] text-ink-muted">{c.sub}</p>
                  </td>
                  <td className="py-2 text-center text-blue-600 font-bold">{c.inquiries || 0}</td>
                  <td className="py-2 text-center text-emerald-600 font-bold">{c.registered || 0}</td>
                  <td className="py-2 text-right text-violet-600 font-bold">{c.admissions || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-[10px] text-ink-muted">No campus breakdown records</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(StudentStatisticsWidget);
