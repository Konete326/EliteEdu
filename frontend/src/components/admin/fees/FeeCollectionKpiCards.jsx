import { DollarSign, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

const FeeCollectionKpiCards = ({ kpis = {} }) => {
  const cards = [
    {
      title: "Today's Collection",
      value: `PKR ${Number(kpis.today_collected || 0).toLocaleString()}`,
      sub: `${kpis.today_transactions_count || 0} Transactions today`,
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      title: 'Month Collection (MTD)',
      value: `PKR ${Number(kpis.month_collected || 0).toLocaleString()}`,
      sub: `Projected: PKR ${Number(kpis.projected_revenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      title: 'Total Pending / Arrears',
      value: `PKR ${Number(kpis.total_pending || 0).toLocaleString()}`,
      sub: `${kpis.defaulters_count || 0} Outstanding accounts`,
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      title: 'Paid vs Unpaid Challans',
      value: `${kpis.paid_count || 0} / ${kpis.total_invoices || 0}`,
      sub: `${kpis.recovery_rate || 0}% Recovery rate`,
      icon: CheckCircle2,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.06, ease: 'easeOut' }}
            whileHover={{ y: -3 }}
            className="relative overflow-hidden p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs space-y-2 hover:border-primary/40 hover:shadow-md transition-all before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_50%_50%,currentColor_2%,transparent_2%)] before:opacity-[0.04] before:bg-[length:16px_16px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">{c.title}</span>
              <div className={`p-2 rounded-xl ${c.bg} ${c.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-black text-ink dark:text-ink-dark">
              <AnimatedNumber value={c.value} />
            </div>
            <div className="text-[11px] text-ink-muted">{c.sub}</div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FeeCollectionKpiCards;
