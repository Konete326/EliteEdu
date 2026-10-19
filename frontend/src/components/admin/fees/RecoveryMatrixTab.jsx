import { useState, useEffect } from 'react';
import api from '../../../services/api';
import ReportExportToolbar from '../reports/ReportExportToolbar';

const RecoveryMatrixTab = () => {
  const [matrix, setMatrix] = useState([]);
  const [billingMonth, setBillingMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadMatrix = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/fees/reports?report_type=recovery_matrix&billing_month=${billingMonth}`);
      if (res.data?.matrix) setMatrix(res.data.matrix);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMatrix(); }, [billingMonth]);

  const filtered = matrix.filter((m) => {
    if (!searchTerm) return true;
    return m.grade_name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const exportCols = [
    { key: 'grade_name', label: 'Class / Grade' },
    { key: 'invoice_count', label: 'Challan Count' },
    { key: 'total_billed', label: 'Total Billed (PKR)' },
    { key: 'total_collected', label: 'Collected (PKR)' },
    { key: 'balance_outstanding', label: 'Outstanding (PKR)' },
    { key: 'recovery_rate', label: 'Recovery %' }
  ];

  return (
    <div className="space-y-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-surface border border-line">
        <div className="flex items-center gap-2">
          <span className="font-bold text-ink">Billing Month:</span>
          <input type="month" value={billingMonth} onChange={(e) => setBillingMonth(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none" />
        </div>
        <div className="text-ink-muted">Overall class recovery breakdown for {billingMonth}</div>
      </div>

      <ReportExportToolbar columns={exportCols} rows={filtered} filename="fee-recovery-matrix" searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-left">
          <thead className="bg-surface-secondary/60 text-ink-muted text-[10px] uppercase font-bold border-b border-line">
            <tr>
              <th className="py-2.5 px-3">Class / Grade</th>
              <th className="py-2.5 px-3 text-center">Invoices</th>
              <th className="py-2.5 px-3 text-right">Total Billed</th>
              <th className="py-2.5 px-3 text-right">Collected</th>
              <th className="py-2.5 px-3 text-right">Outstanding</th>
              <th className="py-2.5 px-3 text-center w-36">Recovery %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.length === 0 ? (
              <tr><td colSpan="6" className="py-8 text-center text-ink-muted">{loading ? 'Loading...' : 'No class data found.'}</td></tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.grade_id} className="hover:bg-surface-secondary/30">
                  <td className="py-2 px-3 font-bold text-ink">{m.grade_name}</td>
                  <td className="py-2 px-3 text-center font-mono">{m.invoice_count}</td>
                  <td className="py-2 px-3 text-right font-mono">Rs. {Number(m.total_billed).toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600">Rs. {Number(m.total_collected).toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-bad">Rs. {Number(m.balance_outstanding).toLocaleString()}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-line overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, m.recovery_rate)}%` }} />
                      </div>
                      <span className="font-mono font-bold text-[11px] w-9 text-right">{m.recovery_rate}%</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecoveryMatrixTab;
