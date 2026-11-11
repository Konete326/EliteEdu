import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

const LeaveKpiStrip = ({ kpis = {}, activeStatus = 'all', onSelectStatus }) => {
  const cards = [
    { key: 'all', label: 'Total', count: kpis.total || 0, icon: Calendar, color: 'text-primary bg-primary/10 border-primary/20' },
    { key: 'Pending', label: 'Pending', count: kpis.pending || 0, icon: Clock, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { key: 'Approved', label: 'Approved', count: kpis.approved || 0, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { key: 'Rejected', label: 'Rejected', count: kpis.rejected || 0, icon: XCircle, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 w-full">
      {cards.map((c) => {
        const Icon = c.icon;
        const isActive = activeStatus === c.key;
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onSelectStatus && onSelectStatus(c.key)}
            className={`p-2.5 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer bg-surface dark:bg-surface-dark w-full ${
              isActive ? 'ring-2 ring-primary border-primary shadow-xs' : 'border-line dark:border-line-dark hover:border-line-dark'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-ink-muted">{c.label}</span>
              <div className={`p-1 sm:p-1.5 rounded-xl border ${c.color}`}><Icon size={13} /></div>
            </div>
            <div className="text-lg sm:text-xl font-bold text-ink dark:text-ink-dark mt-1 font-mono">{c.count}</div>
          </button>
        );
      })}
    </div>
  );
};

export default LeaveKpiStrip;
