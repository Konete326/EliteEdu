import React from 'react';
import { Users, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';

export default function CrmAnalyticsKpis({ kpis = {} }) {
  const cards = [
    {
      title: 'Total Inquiries',
      value: kpis.totalLeads ?? 0,
      icon: Users,
      color: 'text-primary bg-primary/10 border-primary/20',
      subtitle: 'All-time prospective leads'
    },
    {
      title: 'Converted Admissions',
      value: kpis.convertedLeads ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
      subtitle: 'Enrolled students'
    },
    {
      title: 'Conversion Rate',
      value: `${kpis.conversionRate ?? 0}%`,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-500/10 border-purple-500/20',
      subtitle: 'Inquiry-to-enrollment ratio'
    },
    {
      title: 'Due Follow-ups',
      value: kpis.pendingToday ?? 0,
      icon: Calendar,
      color: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
      subtitle: `Overdue: ${kpis.overdueFollowUps ?? 0}`
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-text-muted">{c.title}</span>
              <h3 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mt-0.5">{c.value}</h3>
              <p className="text-[11px] text-text-muted mt-1">{c.subtitle}</p>
            </div>
            <div className={`p-3 rounded-2xl border ${c.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
