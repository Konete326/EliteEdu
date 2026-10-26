import { Users, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

const StudentAttendanceKpiStrip = ({ summary = {} }) => {
  const cards = [
    { label: 'Total Enrolled', value: summary.total || 0, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Present Today', value: summary.present || 0, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Absent', value: summary.absent || 0, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'On Leave / Late', value: (summary.leave || 0) + (summary.late || 0), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05, ease: 'easeOut' }}
            whileHover={{ y: -3 }}
            className="relative overflow-hidden bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-4 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex items-center justify-between before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_50%_50%,currentColor_2%,transparent_2%)] before:opacity-[0.04] before:bg-[length:16px_16px]"
          >
            <div>
              <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">{c.label}</p>
              <h3 className="text-2xl font-black text-ink dark:text-ink-dark mt-0.5">
                <AnimatedNumber value={c.value} />
              </h3>
            </div>
            <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.color} flex items-center justify-center transition-transform hover:scale-105`}>
              <Icon className="w-5 h-5" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StudentAttendanceKpiStrip;
