import React, { useState, useEffect } from 'react';
import { Calendar, LayoutGrid, Table2, ArrowRightLeft } from 'lucide-react';
import api from '../../../../services/api';
import ReportExportToolbar from '../../reports/ReportExportToolbar';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';
import ClassWiseSummaryMobileCard from './ClassWiseSummaryMobileCard';

const ClassWiseSummaryTab = ({ activeCampusId }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState({ rows: [], kpis: {}, header: {} });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [mobileView, setMobileView] = useState('cards');

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
    <div className="space-y-3 flex-1 flex flex-col w-full">
      <div className="shrink-0 space-y-3 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar size={15} className="text-primary shrink-0" />
            <span className="text-xs font-bold text-ink-muted shrink-0">Select Date:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-2.5 py-1 rounded-xl border border-line dark:border-line-dark bg-transparent text-xs font-mono font-bold w-full sm:w-auto outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={loadData}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors cursor-pointer shadow-xs"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <div className="p-2.5 sm:p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
            <span className="text-[9px] sm:text-[10px] text-ink-muted font-bold block truncate">TOTAL ENROLLED</span>
            <span className="text-base sm:text-lg font-bold font-mono">{data.kpis?.totalStudents || 0}</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
            <span className="text-[9px] sm:text-[10px] text-emerald-600 font-bold block truncate">PRESENT</span>
            <span className="text-base sm:text-lg font-bold text-emerald-600 font-mono">{data.kpis?.present || 0}</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
            <span className="text-[9px] sm:text-[10px] text-rose-600 font-bold block truncate">ABSENT</span>
            <span className="text-base sm:text-lg font-bold text-rose-600 font-mono">{data.kpis?.absent || 0}</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
            <span className="text-[9px] sm:text-[10px] text-amber-600 font-bold block truncate">ON LEAVE</span>
            <span className="text-base sm:text-lg font-bold text-amber-600 font-mono">{data.kpis?.leave || 0}</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
            <span className="text-[9px] sm:text-[10px] text-blue-600 font-bold block truncate">LATE ARRIVALS</span>
            <span className="text-base sm:text-lg font-bold text-blue-600 font-mono">{data.kpis?.late || 0}</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl border border-primary/30 bg-primary/5">
            <span className="text-[9px] sm:text-[10px] text-primary font-bold block truncate">ATTENDANCE RATE</span>
            <span className="text-base sm:text-lg font-bold text-primary font-mono">{data.kpis?.rate || 0}%</span>
          </div>
        </div>

        <ReportExportToolbar columns={exportCols} rows={filteredRows} filename={`class-attendance-${date}`} searchTerm={search} onSearchChange={setSearch} />
      </div>

      <div className="hidden print:block text-center pb-3 border-b-2 border-black mb-3">
        <h2 className="text-lg font-black uppercase text-black">{data.header?.school_name || 'Institutional Attendance'}</h2>
        <p className="text-xs font-bold text-black">{data.header?.campus_name} — Class-Wise Attendance Summary Register ({date})</p>
      </div>

      <div className="sm:hidden flex items-center justify-between px-3 py-2 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-2xs print:hidden">
        <span className="text-xs font-bold text-ink-muted">
          {filteredRows.length} Classes Listed
        </span>
        <div className="flex items-center gap-1 bg-surface-secondary dark:bg-surface-secondary-dark p-1 rounded-lg border border-line dark:border-line-dark">
          <button
            type="button"
            onClick={() => setMobileView('cards')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              mobileView === 'cards'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <LayoutGrid size={12} />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('table')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              mobileView === 'table'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Table2 size={12} />
            <span>Table</span>
          </button>
        </div>
      </div>

      {mobileView === 'cards' && (
        <div className="sm:hidden space-y-2.5 pb-4 print:hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-ink-muted bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark">
              Compiling class statistics...
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="p-8 text-center text-xs text-ink-muted bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark">
              No classes found.
            </div>
          ) : (
            filteredRows.map((r, i) => (
              <ClassWiseSummaryMobileCard
                key={`${r.grade_id}_${r.section}_${i}`}
                row={r}
              />
            ))
          )}
        </div>
      )}

      <div className={`${mobileView === 'cards' ? 'hidden sm:flex' : 'flex'} flex-1 min-h-[380px] sm:min-h-0 flex-col rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs overflow-hidden print:border print:border-black print:rounded-none print:shadow-none print:overflow-visible`}>
        <div className="sm:hidden shrink-0 flex items-center justify-between px-3 py-1.5 bg-primary/5 dark:bg-primary/10 border-b border-line dark:border-line-dark text-primary text-[10px] font-bold">
          <span className="flex items-center gap-1">
            <ArrowRightLeft size={11} />
            Swipe table horizontally to see all metrics
          </span>
          <span className="font-mono">{filteredRows.length} Rows</span>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full min-w-[620px] text-left text-xs border-collapse print:border print:border-black">
            <thead className="sticky top-0 z-20 bg-surface dark:bg-surface-dark shadow-2xs border-b border-line dark:border-line-dark text-[11px] font-bold text-ink-muted uppercase print:relative print:shadow-none print:bg-slate-100 print:text-black print:border-b-2 print:border-black">
              <tr>
                <th className="py-2.5 px-3 sticky left-0 bg-surface dark:bg-surface-dark z-30 min-w-[140px] border-r border-line dark:border-line-dark shadow-[2px_0_4px_rgba(0,0,0,0.05)] print:static print:shadow-none print:bg-slate-100 print:border print:border-black">Class &amp; Section</th>
                <th className="py-2.5 px-3 text-center bg-surface dark:bg-surface-dark print:bg-slate-100 print:border print:border-black">Enrolled</th>
                <th className="py-2.5 px-3 text-center text-emerald-600 bg-surface dark:bg-surface-dark print:bg-slate-100 print:text-black print:border print:border-black">Present</th>
                <th className="py-2.5 px-3 text-center text-rose-600 bg-surface dark:bg-surface-dark print:bg-slate-100 print:text-black print:border print:border-black">Absent</th>
                <th className="py-2.5 px-3 text-center text-amber-600 bg-surface dark:bg-surface-dark print:bg-slate-100 print:text-black print:border print:border-black">Leave</th>
                <th className="py-2.5 px-3 text-center text-blue-600 bg-surface dark:bg-surface-dark print:bg-slate-100 print:text-black print:border print:border-black">Late</th>
                <th className="py-2.5 px-3 text-center text-ink-muted bg-surface dark:bg-surface-dark print:bg-slate-100 print:text-black print:border print:border-black">Unmarked</th>
                <th className="py-2.5 px-3 bg-surface dark:bg-surface-dark print:bg-slate-100 print:border print:border-black">Attendance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-line-dark print:divide-black">
              {filteredRows.length === 0 ? (
                <tr><td colSpan={8} className="py-8 text-center text-xs text-ink-muted print:text-black">{loading ? 'Compiling class statistics...' : 'No classes found.'}</td></tr>
              ) : (
                filteredRows.map((r, i) => (
                  <tr key={`${r.grade_id}_${r.section}_${i}`} className="hover:bg-surface-secondary/40 transition-colors print:border-b print:border-black">
                    <td className="py-2.5 px-3 sticky left-0 bg-surface dark:bg-surface-dark z-10 font-bold text-ink dark:text-white border-r border-line dark:border-line-dark shadow-[2px_0_4px_rgba(0,0,0,0.05)] print:static print:shadow-none print:text-black print:border print:border-black">{r.grade_name} ({r.section})</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold print:text-black print:border print:border-black">{r.total_students}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600 print:text-black print:border print:border-black">{r.present}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-600 print:text-black print:border print:border-black">{r.absent}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-600 print:text-black print:border print:border-black">{r.leave}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600 print:text-black print:border print:border-black">{r.late}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-ink-muted print:text-black print:border print:border-black">{r.unmarked}</td>
                    <td className="py-2.5 px-3 print:border print:border-black">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden print:hidden">
                          <div className={`h-full rounded-full ${r.attendance_rate >= 80 ? 'bg-emerald-500' : r.attendance_rate >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${r.attendance_rate}%` }} />
                        </div>
                        <span className="text-[11px] font-mono font-bold w-10 text-right print:w-auto print:text-black">{r.attendance_rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="hidden print:flex items-center justify-between pt-6 border-t-2 border-black mt-4">
        <OfficialSignatureStampBlock />
        <span className="text-[10px] font-mono text-black font-bold">EliteEdu Institutional Attendance Studio</span>
      </div>
    </div>
  );
};

export default ClassWiseSummaryTab;
