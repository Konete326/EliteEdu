import { useState } from 'react';
import { BarChart3 } from 'lucide-react';

const AdmissionsChartWidget = ({ stats }) => {
  const [period, setPeriod] = useState('Monthly');
  const [areaMode, setAreaMode] = useState('Area');
  const data = stats?.admissionsStats;
  const months = data?.monthly || [];
  const maxAdmissions = 40;

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

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select className="px-2.5 py-1 rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark focus:outline-none">
            <option>All Classes</option>
          </select>
          <div className="flex items-center bg-surface-secondary dark:bg-surface-secondary-dark rounded-lg p-0.5 border border-line dark:border-line-dark">
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
          <select className="px-2.5 py-1 rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark focus:outline-none">
            <option>2026</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Total Admissions</span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{data?.totalAdmissions ?? 126}</p>
        </div>
        <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">Total Dropouts</span>
          <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">{data?.totalDropouts ?? 6}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <span className="font-semibold text-ink dark:text-ink-dark">Admissions vs Dropouts</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Admissions</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Dropouts</span>
            </div>
          </div>

          <div className="h-44 flex items-end justify-between gap-1 sm:gap-2 pt-6 border-b border-line dark:border-line-dark px-2">
            {months.map((m) => {
              const admHeight = Math.max(4, Math.round((m.admissions / maxAdmissions) * 130));
              const dropHeight = Math.max(2, Math.round((m.dropouts / maxAdmissions) * 130));
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                  <div className="flex items-end gap-0.5 sm:gap-1">
                    <div style={{ height: `${admHeight}px` }} className="w-2 sm:w-3.5 bg-emerald-500 rounded-t-sm transition-all group-hover:brightness-110" title={`Admissions: ${m.admissions}`} />
                    {m.dropouts > 0 && (
                      <div style={{ height: `${dropHeight}px` }} className="w-1.5 sm:w-2 bg-rose-500 rounded-t-sm transition-all" title={`Dropouts: ${m.dropouts}`} />
                    )}
                  </div>
                  <span className="text-[10px] text-ink-muted mt-1">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col items-center justify-between border-t lg:border-t-0 lg:border-l border-line dark:border-line-dark pt-3 lg:pt-0 lg:pl-4">
          <div className="w-full flex items-center justify-between text-xs">
            <span className="font-semibold text-ink dark:text-ink-dark">Admissions by Area</span>
            <div className="flex bg-surface-secondary dark:bg-surface-secondary-dark rounded-md p-0.5">
              <button type="button" onClick={() => setAreaMode('Area')} className={`px-2 py-0.5 text-[10px] rounded ${areaMode === 'Area' ? 'bg-primary text-white' : 'text-ink-muted'}`}>Area Wise</button>
              <button type="button" onClick={() => setAreaMode('Region')} className={`px-2 py-0.5 text-[10px] rounded ${areaMode === 'Region' ? 'bg-primary text-white' : 'text-ink-muted'}`}>Region Wise</button>
            </div>
          </div>

          <div className="my-3 relative flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-28 h-28 transform -rotate-90">
              <circle cx="18" cy="18" r="14" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="80 20" strokeDashoffset="0" />
              <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray="12 88" strokeDashoffset="-80" />
              <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="8 92" strokeDashoffset="-92" />
            </svg>
          </div>

          <div className="w-full space-y-1 text-[11px] text-ink-muted">
            <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Uncategorized</span><span className="font-semibold text-ink dark:text-ink-dark">122</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> North Nazimabad</span><span className="font-semibold text-ink dark:text-ink-dark">3</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Gulberg</span><span className="font-semibold text-ink dark:text-ink-dark">1</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsChartWidget;
