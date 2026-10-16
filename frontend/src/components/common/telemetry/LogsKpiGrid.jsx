import { Database, AlertOctagon, Terminal, UserCheck } from 'lucide-react';

const LogsKpiGrid = ({ summary }) => {
  const cards = [
    {
      title: 'Total Telemetry Logs',
      count: summary.totalLogs || 0,
      icon: Database,
      badge: 'All Types',
      color: 'text-primary dark:text-primary-dark',
      bg: 'bg-primary/10 border-primary/20'
    },
    {
      title: 'Network & API Failures',
      count: summary.networkErrors || 0,
      icon: AlertOctagon,
      badge: 'HTTP 4xx / 5xx',
      color: 'text-bad dark:text-bad',
      bg: 'bg-bad/10 border-bad/20'
    },
    {
      title: 'Console & Runtime Crashes',
      count: summary.consoleErrors || 0,
      icon: Terminal,
      badge: 'Uncaught JS',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'User Activity Actions',
      count: summary.activityLogs || 0,
      icon: UserCheck,
      badge: 'State Changes',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="p-3.5 sm:p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-semibold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider block">
                {c.title}
              </span>
              <div className="text-xl sm:text-2xl font-black text-ink dark:text-ink-dark mt-0.5">
                {c.count.toLocaleString()}
              </div>
              <span className="text-[10px] font-medium text-ink-sub dark:text-ink-sub-dark mt-0.5 block">
                {c.badge}
              </span>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${c.bg}`}>
              <Icon className={`w-5 h-5 ${c.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LogsKpiGrid;
