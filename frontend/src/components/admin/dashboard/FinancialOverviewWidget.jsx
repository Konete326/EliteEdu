import { useState } from 'react';
import { Landmark, Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';

const FinancialOverviewWidget = ({ stats, financialOverview }) => {
  const [showValues, setShowValues] = useState(false);
  const data = financialOverview || stats?.financialOverview || stats;
  const campuses = data?.campusBreakdown || [];

  const mask = (val) => (showValues ? val : '••••••');

  const cards = [
    { label: "Today's Collection", value: data?.todayCollection || 'Rs. 0', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40' },
    { label: 'MTD Collection', value: data?.mtdCollection || 'Rs. 0', icon: TrendingUp, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/20 border-teal-200/60 dark:border-teal-900/40' },
    { label: 'YTD Collection', value: data?.ytdCollection || 'Rs. 0', icon: TrendingUp, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-900/40' },
    { label: 'Est. Monthly Revenue', value: data?.estMonthlyRevenue || 'Rs. 0', icon: Landmark, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/20 border-purple-200/60 dark:border-purple-900/40' },
    { label: 'Outstanding', value: data?.outstanding || 'Rs. 0', icon: TrendingDown, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40' },
    { label: 'Profit / Loss (Month)', value: data?.profitThisMonth || 'Rs. 0', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40' },
    { label: 'Total Expense (Year)', value: data?.totalExpenseYear || 'Rs. 0', icon: TrendingDown, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40' },
    { label: 'Expense Today', value: data?.expenseToday || 'Rs. 0', icon: TrendingDown, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40' }
  ];

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark">
            <Landmark className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-ink dark:text-ink-dark">Financial Overview</h2>
        </div>
        <button
          type="button"
          onClick={() => setShowValues((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border border-line dark:border-line-dark text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-colors"
        >
          {showValues ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showValues ? 'Hide Values' : 'Show Values'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className={`p-3 rounded-xl border ${c.color} transition-all`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-sub dark:text-ink-sub-dark truncate">{c.label}</span>
              <c.icon className="w-3.5 h-3.5 opacity-80" />
            </div>
            <p className="text-base font-black text-ink dark:text-ink-dark mt-1 font-mono tracking-tight">{mask(c.value)}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto pt-1">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-line dark:border-line-dark text-ink-muted">
              <th className="pb-2 font-medium">Campus</th>
              <th className="pb-2 font-medium">Today</th>
              <th className="pb-2 font-medium">MTD</th>
              <th className="pb-2 font-medium">YTD</th>
              <th className="pb-2 font-medium">Est. Monthly</th>
              <th className="pb-2 font-medium">Outstanding</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 dark:divide-line-dark/60 font-mono text-[11px]">
            {campuses.map((c, i) => (
              <tr key={i} className="hover:bg-surface-secondary/40 transition-colors">
                <td className="py-2.5 font-sans">
                  <p className="font-semibold text-ink dark:text-ink-dark">{c.name}</p>
                  <p className="text-[11px] text-ink-muted">{c.sub}</p>
                </td>
                <td className="py-2.5 text-emerald-600 dark:text-emerald-400">{mask(c.today)}</td>
                <td className="py-2.5 text-teal-600 dark:text-teal-400">{mask(c.mtd)}</td>
                <td className="py-2.5 text-blue-600 dark:text-blue-400">{mask(c.ytd)}</td>
                <td className="py-2.5 text-purple-600 dark:text-purple-400">{mask(c.estMonthly)}</td>
                <td className="py-2.5 text-amber-600 dark:text-amber-400">{mask(c.outstanding)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialOverviewWidget;
