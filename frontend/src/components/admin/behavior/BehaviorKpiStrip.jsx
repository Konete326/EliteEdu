import { Users, Award, TrendingUp, AlertTriangle } from 'lucide-react';

const BehaviorKpiStrip = ({ kpis = {} }) => {
  const cards = [
    {
      label: 'Students Evaluated',
      value: kpis.totalStudents || 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/40'
    },
    {
      label: 'Exemplary Conduct',
      value: kpis.exemplaryCount || 0,
      icon: Award,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/40'
    },
    {
      label: 'Class Average Score',
      value: `${kpis.classAverage || '5.0'} / 5`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/40'
    },
    {
      label: 'Needs Attention',
      value: kpis.needsAttention || 0,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/40'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className={`p-4 rounded-2xl border ${c.bg} flex items-center justify-between shadow-sm`}>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{c.label}</p>
              <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mt-1">{c.value}</h3>
            </div>
            <div className={`p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-sm ${c.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BehaviorKpiStrip;
