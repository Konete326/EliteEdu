import { useState, useEffect } from 'react';
import api from '../../../services/api';
import ReportExportToolbar from '../reports/ReportExportToolbar';

const DailyCollectionRegisterTab = () => {
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadReport = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/fees/reports?report_type=daily&start_date=${startDate}&end_date=${endDate}`);
      if (res.data?.records) setRecords(res.data.records);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReport(); }, [startDate, endDate]);

  const filtered = records.filter((r) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const st = r.student_id || {};
    return st.name?.toLowerCase().includes(q) || st.gr_number?.toLowerCase().includes(q) || r.receipt_number?.toLowerCase().includes(q);
  });

  const exportCols = [
    { key: 'receipt_number', label: 'Receipt #' },
    { key: 'date', label: 'Date' },
    { key: 'student_name', label: 'Student' },
    { key: 'gr_number', label: 'GR #' },
    { key: 'method', label: 'Method' },
    { key: 'amount', label: 'Amount (PKR)' },
    { key: 'collector', label: 'Collector' }
  ];
  const exportRows = filtered.map((r) => ({
    receipt_number: r.receipt_number,
    date: new Date(r.payment_date).toLocaleDateString('en-GB'),
    student_name: r.student_id?.name,
    gr_number: r.student_id?.gr_number,
    method: r.payment_method,
    amount: r.paid_amount,
    collector: r.collector_name
  }));

  const total = filtered.reduce((sum, r) => sum + Number(r.paid_amount || 0), 0);

  return (
    <div className="space-y-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-surface border border-line">
        <div className="flex items-center gap-2">
          <span className="font-bold text-ink">Date Range:</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none" />
          <span>to</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none" />
        </div>
        <div className="font-black text-emerald-600 font-mono text-sm">Total Collected: PKR {total.toLocaleString()}</div>
      </div>

      <ReportExportToolbar columns={exportCols} rows={exportRows} filename="daily-fee-register" searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-left">
          <thead className="bg-surface-secondary/60 text-ink-muted text-[10px] uppercase font-bold border-b border-line">
            <tr>
              <th className="py-2.5 px-3">Receipt #</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Student & GR #</th>
              <th className="py-2.5 px-3">Method</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
              <th className="py-2.5 px-3">Collector</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.length === 0 ? (
              <tr><td colSpan="6" className="py-8 text-center text-ink-muted">{loading ? 'Loading...' : 'No payments found in date range.'}</td></tr>
            ) : (
              filtered.map((r) => (
                <tr key={r._id} className="hover:bg-surface-secondary/30">
                  <td className="py-2 px-3 font-mono font-bold text-primary">{r.receipt_number}</td>
                  <td className="py-2 px-3">{new Date(r.payment_date).toLocaleDateString('en-GB')}</td>
                  <td className="py-2 px-3 font-bold">{r.student_id?.name} <span className="font-mono text-ink-muted font-normal">({r.student_id?.gr_number})</span></td>
                  <td className="py-2 px-3">{r.payment_method}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600">PKR {Number(r.paid_amount).toLocaleString()}</td>
                  <td className="py-2 px-3 text-ink-muted">{r.collector_name || 'Staff'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyCollectionRegisterTab;
