import { useState, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, ArrowUpRight } from 'lucide-react';
import AdmissionsAreaBreakdown from './AdmissionsAreaBreakdown';

const AdmissionsChartWidget = ({ stats, admissionsStats }) => {
  const [period, setPeriod] = useState('Monthly');
  const data = admissionsStats || stats?.admissionsStats || stats;
  const months = data?.monthly || [];
  const areas = data?.areaBreakdown || [];

  const maxAdmissions = useMemo(() => {
    const maxVal = Math.max(...months.map((m) => Math.max(m.admissions || 0, m.dropouts || 0)), 1);
    return Math.max(maxVal, 5);
  }, [months]);

  const totalAdmissions = data?.totalAdmissions ?? 0;
  const totalDropouts = data?.totalDropouts ?? 0;

  const summaryCards = useMemo(() => [
    { label: 'Total Admissions', val: totalAdmissions, color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40 text-emerald-600' },
    { label: 'Total Dropouts', val: totalDropouts, color: 'text-rose-700 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40 text-rose-600' }
  ], [totalAdmissions, totalDropouts]);

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-ink dark:text-ink-dark">Admissions Statistics</h2>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">Admissions and dropouts over time</p>
        </div>

        <div className="flex items-center bg-surface-secondary dark:bg-surface-secondary-dark rounded-lg p-0.5 border border-line dark:border-line-dark text-xs">
          {['Monthly', 'Weekly', 'Daily'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${period === p ? 'bg-primary text-white shadow-sm' : 'text-ink-muted hover:text-ink'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {summaryCards.map((c) => (
          <Link
            key={c.label}
            to="/admin/students"
            className={`p-3 rounded-xl border ${c.color} hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 block group`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider">{c.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xl font-black mt-0.5">{c.val}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <span className="font-semibold text-ink dark:text-ink-dark">Admissions vs Dropouts</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Admissions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Dropouts
              </span>
            </div>
          </div>

          <div className="h-44 flex items-end justify-between gap-1 sm:gap-2 pt-6 border-b border-line dark:border-line-dark px-2">
            {months.map((m) => {
              const admHeight = m.admissions > 0 ? Math.max(8, Math.round((m.admissions / maxAdmissions) * 130)) : 3;
              const dropHeight = m.dropouts > 0 ? Math.max(6, Math.round((m.dropouts / maxAdmissions) * 130)) : 0;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                  <div className="flex items-end gap-0.5 sm:gap-1">
                    <div
                      style={{ height: `${admHeight}px` }}
                      className={`w-2 sm:w-3.5 rounded-t-sm transition-all group-hover:brightness-110 ${
                        m.admissions > 0 ? 'bg-emerald-500' : 'bg-surface-secondary dark:bg-white/5'
                      }`}
                      title={`Admissions: ${m.admissions || 0}`}
                    />
                    {dropHeight > 0 && (
                      <div
                        style={{ height: `${dropHeight}px` }}
                        className="w-1.5 sm:w-2 bg-rose-500 rounded-t-sm transition-all"
                        title={`Dropouts: ${m.dropouts}`}
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-ink-muted mt-1">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <AdmissionsAreaBreakdown areas={areas} totalAdmissions={totalAdmissions} />
      </div>
    </div>
  );
};

export default memo(AdmissionsChartWidget);
