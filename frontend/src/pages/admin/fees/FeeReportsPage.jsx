import { useState } from 'react';
import { FileText, CalendarCheck, BarChart3, PieChart } from 'lucide-react';
import DailyCollectionRegisterTab from '../../../components/admin/fees/DailyCollectionRegisterTab';
import RecoveryMatrixTab from '../../../components/admin/fees/RecoveryMatrixTab';
import PaymentModeBreakdownTab from '../../../components/admin/fees/PaymentModeBreakdownTab';

const FeeReportsPage = () => {
  const [activeTab, setActiveTab] = useState('daily');

  const tabs = [
    { key: 'daily', label: 'Daily Collection Register', icon: CalendarCheck },
    { key: 'recovery', label: 'Class Recovery Matrix', icon: BarChart3 },
    { key: 'modes', label: 'Payment Mode Breakdown', icon: PieChart }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-ink dark:text-ink-dark uppercase tracking-tight">Fee Reports & Bulk Ledger</h1>
        <p className="text-xs text-ink-muted">Audit institutional fee collection logs, class-wise recovery targets, and payment channels.</p>
      </div>

      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface-secondary/50 border border-line w-fit">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive ? 'bg-surface text-primary shadow-xs' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === 'daily' && <DailyCollectionRegisterTab />}
        {activeTab === 'recovery' && <RecoveryMatrixTab />}
        {activeTab === 'modes' && <PaymentModeBreakdownTab />}
      </div>
    </div>
  );
};

export default FeeReportsPage;
