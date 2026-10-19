import { Bus, Users, Armchair, DollarSign } from 'lucide-react';

const TransportKpiCards = ({ kpis = {} }) => {
  const cards = [
    { label: 'Vehicles / Routes', value: kpis.totalRoutes || 0, icon: Bus, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Enrolled Students', value: kpis.assignedStudentsCount || 0, icon: Users, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Available Seats', value: kpis.availableSeats ?? Math.max(0, (kpis.totalCapacity || 0) - (kpis.assignedStudentsCount || 0)), icon: Armchair, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Est. Monthly Revenue', value: `PKR ${(kpis.estMonthlyRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3">
            <div className={`p-3 rounded-xl ${c.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{c.label}</p>
              <h4 className="text-lg font-black text-gray-900 dark:text-gray-100 mt-0.5">{c.value}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransportKpiCards;
