import { GraduationCap, BookOpen, Users, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

const TeacherStatsGrid = ({ classesCount = 0, subjectsCount = 0, studentsCount = 0, permissionsCount = 0 }) => {
  const cards = [
    { title: 'Assigned Classes', count: classesCount, icon: GraduationCap, color: 'text-primary bg-primary/10 border-primary/20' },
    { title: 'Taught Subjects', count: subjectsCount, icon: BookOpen, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
    { title: 'My Enrolled Students', count: studentsCount, icon: Users, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Active Modules', count: permissionsCount, icon: ShieldCheck, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05, ease: 'easeOut' }}
            whileHover={{ y: -3 }}
            className="relative overflow-hidden p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex items-center justify-between before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_50%_50%,currentColor_2%,transparent_2%)] before:opacity-[0.04] before:bg-[length:16px_16px]"
          >
            <div>
              <p className="text-[11px] font-semibold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className="text-2xl font-black text-ink dark:text-ink-dark mt-1">
                <AnimatedNumber value={card.count} />
              </h3>
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${card.color} transition-transform hover:scale-105`}>
              <Icon className="w-5 h-5" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TeacherStatsGrid;
