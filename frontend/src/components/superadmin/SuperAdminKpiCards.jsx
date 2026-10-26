import { Building2, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

const SuperAdminKpiCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0, ease: 'easeOut' }}
        whileHover={{ y: -3 }}
        className="relative overflow-hidden p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs hover:border-primary/40 hover:shadow-md transition-all before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_50%_50%,currentColor_2%,transparent_2%)] before:opacity-[0.04] before:bg-[length:16px_16px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-ink-sub dark:text-ink-sub-dark uppercase tracking-wider">Registered Schools</span>
          <div className="p-2 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-3xl font-extrabold text-ink dark:text-ink-dark">
            <AnimatedNumber value={stats?.totalSchools ?? 0} />
          </span>
          <p className="mt-1 text-xs text-ink-muted dark:text-ink-muted-dark">
            <AnimatedNumber value={stats?.privateSchools ?? 0} /> Private • <AnimatedNumber value={stats?.governmentSchools ?? 0} /> Government
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-line dark:border-line-dark">
          <Link to="/superadmin/schools" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover">
            <span>View institutions directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08, ease: 'easeOut' }}
        whileHover={{ y: -3 }}
        className="relative overflow-hidden p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs hover:border-primary/40 hover:shadow-md transition-all before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_50%_50%,currentColor_2%,transparent_2%)] before:opacity-[0.04] before:bg-[length:16px_16px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-ink-sub dark:text-ink-sub-dark uppercase tracking-wider">Total Users</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-3xl font-extrabold text-ink dark:text-ink-dark">
            <AnimatedNumber value={stats?.totalUsers ?? 0} />
          </span>
          <p className="mt-1 text-xs text-ink-muted dark:text-ink-muted-dark">
            <AnimatedNumber value={stats?.totalTeachers ?? 0} /> Teachers • <AnimatedNumber value={stats?.totalAdmins ?? 0} /> Principals
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-line dark:border-line-dark">
          <Link to="/superadmin/schools" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover">
            <span>Inspect user distribution</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.16, ease: 'easeOut' }}
        whileHover={{ y: -3 }}
        className="relative overflow-hidden p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs hover:border-primary/40 hover:shadow-md transition-all before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_50%_50%,currentColor_2%,transparent_2%)] before:opacity-[0.04] before:bg-[length:16px_16px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-ink-sub dark:text-ink-sub-dark uppercase tracking-wider">System Governance</span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-xl font-bold text-ink dark:text-ink-dark">Active Ecosystem</span>
          <p className="mt-1 text-xs text-ink-muted dark:text-ink-muted-dark">Real-time database connectivity and multi-tenant isolation active.</p>
        </div>
        <div className="mt-4 pt-4 border-t border-line dark:border-line-dark">
          <Link to="/superadmin/schools/new" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover">
            <span>Register new institution</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SuperAdminKpiCards;
