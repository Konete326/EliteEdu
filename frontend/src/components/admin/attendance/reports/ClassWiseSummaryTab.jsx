import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../../../services/api';
import ReportExportToolbar from '../../reports/ReportExportToolbar';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';

const ClassWiseSummaryTab = ({ activeCampusId }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState({ rows: [], kpis: {}, header: {} });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/attendance-reports/class-summary', { params: { date, campus_id: activeCampusId } });
      setData(res.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [date, activeCampusId]);

  const filteredRows = (data.rows || []).filter((r) => `${r.grade_name} ${r.section}`.toLowerCase().includes(search.toLowerCase()));
  const exportCols = [
    { key: 'grade_name', label: 'Class' }, { key: 'section', label: 'Section' },
    { key: 'total_students', label: 'Total' }, { key: 'present', label: 'Present' },
    { key: 'absent', label: 'Absent' }, { key: 'leave', label: 'Leave' },
    { key: 'late', label: 'Late' }, { key: 'attendance_rate', label: 'Rate %' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs print:hidden">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-primary" />
          <span className="text-xs font-bold text-ink-muted">Select Date:</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-2.5 py-1 rounded-xl border border-line bg-transparent text-xs font-mono font-bold" />
        </div>
        <button onClick={loadData} className="px-3.5 py-1.5 rounded-xl bg-surface-secondary text-xs font-bold hover:bg-line text-ink cursor-pointer">Refresh</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 print:hidden">
        <div className="p-3 rounded-xl border border-line bg-surface dark:bg-surface-dark"><span className="text-[10px] text-ink-muted font-bold block">TOTAL ENROLLED</span><span className="text-lg font-bold font-mono">{data.kpis?.totalStudents || 0}</span></div>
        <div className="p-3 rounded-xl border border-line bg-surface dark:bg-surface-dark"><span className="text-[10px] text-emerald-600 font-bold block">PRESENT</span><span className="text-lg font-bold text-emerald-600 font-mono">{data.kpis?.present || 0}</span></div>
        <div className="p-3 rounded-xl border border-line bg-surface dark:bg-surface-dark"><span className="text-[10px] text-rose-600 font-bold block">ABSENT</span><span className="text-lg font-bold text-rose-600 font-mono">{data.kpis?.absent || 0}</span></div>
        <div className="p-3 rounded-xl border border-line bg-surface dark:bg-surface-dark"><span className="text-[10px] text-amber-600 font-bold block">ON LEAVE</span><span className="text-lg font-bold text-amber-600 font-mono">{data.kpis?.leave || 0}</span></div>
        <div className="p-3 rounded-xl border border-line bg-surface dark:bg-surface-dark"><span className="text-[10px] text-blue-600 font-bold block">LATE ARRIVALS</span><span className="text-lg font-bold text-blue-600 font-mono">{data.kpis?.late || 0}</span></div>
        <div className="p-3 rounded-xl border border-primary/30 bg-primary/5"><span className="text-[10px] text-primary font-bold block">ATTENDANCE RATE</span><span className="text-lg font-bold text-primary font-mono">{data.kpis?.rate || 0}%</span></div>
      </div>

      <ReportExportToolbar columns={exportCols} rows={filteredRows} filename={`class-attendance-${date}`} searchTerm={search} onSearchChange={setSearch} />

      <div className="hidden print:block text-center pb-2 border-b border-line mb-2">
        <h2 className="text-base font-black uppercase">{data.header?.school_name}</h2>
        <p className="text-xs font-bold text-slate-600">{data.header?.campus_name} — Class-Wise Attendance Summary ({date})</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-secondary/70 dark:bg-white/[0.03] border-b border-line dark:border-line-dark text-[11px] font-bold text-ink-muted uppercase">
            <tr>
              <th className="py-2.5 px-3">Class & Section</th>
              <th className="py-2.5 px-3 text-center">Enrolled</th>
              <th className="py-2.5 px-3 text-center text-emerald-600">Present</th>
              <th className="py-2.5 px-3 text-center text-rose-600">Absent</th>
              <th className="py-2.5 px-3 text-center text-amber-600">Leave</th>
              <th className="py-2.5 px-3 text-center text-blue-600">Late</th>
              <th className="py-2.5 px-3 text-center text-ink-muted">Unmarked</th>
              <th className="py-2.5 px-3">Attendance Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark">
            {filteredRows.length === 0 ? (
              <tr><td colSpan={8} className="py-8 text-center text-xs text-ink-muted">{loading ? 'Compiling class statistics...' : 'No classes found.'}</td></tr>
            ) : (
              filteredRows.map((r, i) => (
                <tr key={`${r.grade_id}_${r.section}_${i}`} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-ink dark:text-white">{r.grade_name} ({r.section})</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold">{r.total_students}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">{r.present}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-600">{r.absent}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-600">{r.leave}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600">{r.late}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-ink-muted">{r.unmarked}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className={`h-full rounded-full ${r.attendance_rate >= 80 ? 'bg-emerald-500' : r.attendance_rate >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${r.attendance_rate}%` }} />
                      </div>
                      <span className="text-[11px] font-mono font-bold w-10 text-right">{r.attendance_rate}%</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="hidden print:flex items-center justify-between pt-4 border-t border-line">
        <OfficialSignatureStampBlock />
        <span className="text-[10px] font-mono text-slate-400">EliteEdu Attendance Studio</span>
      </div>
    </div>
  );
};

export default ClassWiseSummaryTab;
