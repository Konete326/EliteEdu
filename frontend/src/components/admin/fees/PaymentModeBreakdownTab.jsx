import { useState, useEffect } from 'react';
import { DollarSign, Landmark, CreditCard, FileCheck } from 'lucide-react';
import api from '../../../services/api';

const PaymentModeBreakdownTab = () => {
  const [modes, setModes] = useState({ Cash: 0, 'Bank Deposit': 0, 'Online Transfer': 0, Cheque: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/fees/reports?report_type=payment_modes')
      .then((res) => { if (res.data?.modes) setModes(res.data.modes); })
      .finally(() => setLoading(false));
  }, []);

  const total = Object.values(modes).reduce((sum, v) => sum + Number(v || 0), 0);

  const modeConfigs = [
    { key: 'Cash', label: 'Cash Collection', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { key: 'Bank Deposit', label: 'Bank Branch Deposit', icon: Landmark, color: 'text-primary', bg: 'bg-primary/10' },
    { key: 'Online Transfer', label: 'Online / Card / IBAN', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { key: 'Cheque', label: 'Bank Cheque / Pay Order', icon: FileCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' }
  ];

  return (
    <div className="space-y-4 text-xs">
      <div className="p-4 rounded-2xl bg-surface border border-line flex items-center justify-between">
        <div>
          <h3 className="font-bold text-ink uppercase text-xs">Payment Method Portfolio</h3>
          <p className="text-ink-muted text-[11px]">Analysis of fee revenue collected across channels</p>
        </div>
        <div className="font-mono font-black text-sm text-ink">Total Portfolio: PKR {total.toLocaleString()}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modeConfigs.map((m) => {
          const amount = Number(modes[m.key] || 0);
          const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
          const Icon = m.icon;
          return (
            <div key={m.key} className="p-4 rounded-2xl bg-surface border border-line shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-muted uppercase text-[11px]">{m.label}</span>
                <div className={`p-2 rounded-xl ${m.bg} ${m.color}`}><Icon className="w-4 h-4" /></div>
              </div>
              <div className="text-lg font-black font-mono text-ink">PKR {amount.toLocaleString()}</div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-ink-muted">
                  <span>Share</span>
                  <span className="font-bold">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-line overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentModeBreakdownTab;
