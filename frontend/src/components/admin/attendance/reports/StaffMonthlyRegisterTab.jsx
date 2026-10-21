import React, { useState, useEffect } from 'react';
import { LayoutGrid, Table2, ArrowRightLeft } from 'lucide-react';
import api from '../../../../services/api';
import ReportExportToolbar from '../../reports/ReportExportToolbar';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';
import StaffMonthlyRegisterMobileCard from './StaffMonthlyRegisterMobileCard';

const StaffMonthlyRegisterTab = ({ activeCampusId }) => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [designation, setDesignation] = useState('all');
  const [search, setSearch] = useState('');
  const [data, setData] = useState({ days: [], matrix: [], header: {} });
  const [loading, setLoading] = useState(false);
  const [mobileView, setMobileView] = useState('cards');

  const loadMatrix = async () => {
    try {
      setLoading(true);
      const res = await api.get('/attendance-reports/staff-monthly-matrix', {
        params: { month, campus_id: activeCampusId, designation, search }
      });
      setData(res.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadMatrix(); }, [month, designation, activeCampusId]);

  const exportCols = [
    { key: 'staff_name', label: 'Faculty / Staff' }, { key: 'designation', label: 'Designation' },
    { key: 'presentCount', label: 'P' }, { key: 'absentCount', label: 'A' },
    { key: 'leaveCount', label: 'L' }, { key: 'percentage', label: 'Rate %' }
  ];
  const exportRows = (data.matrix || []).map((m) => ({ ...m, staff_name: m.staff?.name, designation: m.staff?.designation }));

  return (
    <div className="space-y-3 flex-1 flex flex-col w-full">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs print:hidden">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent text-xs font-mono font-bold w-full sm:w-auto outline-none focus:border-primary"
          />
          <select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent text-xs font-semibold w-full sm:w-auto outline-none focus:border-primary"
          >
            <option value="all">All Designations</option>
            {['Teacher', 'Senior Teacher', 'Headmaster', 'Principal', 'Admin Staff', 'Accountant'].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <button
          onClick={loadMatrix}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors cursor-pointer shadow-xs"
        >
          Filter
        </button>
      </div>

      <div className="shrink-0 print:hidden">
        <ReportExportToolbar columns={exportCols} rows={exportRows} filename={`staff-register-${month}`} searchTerm={search} onSearchChange={setSearch} />
      </div>

      <div className="hidden print:block text-center pb-3 border-b-2 border-black mb-3">
        <h2 className="text-lg font-black uppercase text-black">{data.header?.school_name || 'Institutional Attendance'}</h2>
        <p className="text-xs font-bold text-black">{data.header?.campus_name} — Staff Monthly Attendance Register (Month: {month})</p>
      </div>

      <div className="sm:hidden flex items-center justify-between px-3 py-2 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-2xs print:hidden">
        <span className="text-xs font-bold text-ink-muted">
          {data.matrix?.length || 0} Staff Members Listed
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
            <span>Matrix</span>
          </button>
        </div>
      </div>

      {mobileView === 'cards' && (
        <div className="sm:hidden space-y-2.5 pb-4 print:hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-ink-muted bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark">
              Loading staff register...
            </div>
          ) : data.matrix?.length === 0 ? (
            <div className="p-8 text-center text-xs text-ink-muted bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark">
              No staff found matching criteria.
            </div>
          ) : (
            data.matrix?.map((row) => (
              <StaffMonthlyRegisterMobileCard
                key={row.staff?._id || row._id}
                row={row}
                days={data.days}
              />
            ))
          )}
        </div>
      )}

      <div className={`${mobileView === 'cards' ? 'hidden sm:flex' : 'flex'} flex-1 min-h-[380px] sm:min-h-0 flex-col rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs overflow-hidden print:border print:border-black print:rounded-none print:shadow-none print:overflow-visible`}>
        <div className="sm:hidden shrink-0 flex items-center justify-between px-3 py-1.5 bg-primary/5 dark:bg-primary/10 border-b border-line dark:border-line-dark text-primary text-[10px] font-bold">
          <span className="flex items-center gap-1">
            <ArrowRightLeft size={11} />
            Swipe table horizontally to see days 1–31
          </span>
          <span className="font-mono">{data.days?.length || 31} Days</span>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse print:border print:border-black">
            <thead className="sticky top-0 z-20 bg-surface dark:bg-surface-dark shadow-2xs border-b border-line dark:border-line-dark text-[10px] font-bold text-ink-muted uppercase print:relative print:shadow-none print:bg-slate-100 print:text-black print:border-b-2 print:border-black">
              <tr>
                <th className="py-2.5 px-3 sticky left-0 bg-surface dark:bg-surface-dark z-30 min-w-[130px] sm:min-w-[150px] border-r border-line dark:border-line-dark shadow-[2px_0_4px_rgba(0,0,0,0.05)] print:static print:shadow-none print:bg-slate-100 print:border print:border-black">
                  Faculty / Staff
                </th>
                {(data.days || []).map((d) => (
                  <th key={d.day} className="py-1 px-1 text-center min-w-[24px] font-mono bg-surface dark:bg-surface-dark print:bg-slate-100 print:text-black print:border print:border-black">{d.day}</th>
                ))}
                <th className="py-2.5 px-2 text-center text-emerald-600 bg-surface dark:bg-surface-dark print:bg-slate-100 print:text-black print:border print:border-black">P</th>
                <th className="py-2.5 px-2 text-center text-rose-600 bg-surface dark:bg-surface-dark print:bg-slate-100 print:text-black print:border print:border-black">A</th>
                <th className="py-2.5 px-2 text-center text-amber-600 bg-surface dark:bg-surface-dark print:bg-slate-100 print:text-black print:border print:border-black">L</th>
                <th className="py-2.5 px-2 text-center text-primary bg-surface dark:bg-surface-dark print:bg-slate-100 print:text-black print:border print:border-black">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-line-dark font-mono text-[11px] print:divide-black">
              {data.matrix?.length === 0 ? (
                <tr><td colSpan={(data.days?.length || 31) + 5} className="py-8 text-center text-xs text-ink-muted font-sans print:text-black">{loading ? 'Loading staff register...' : 'No staff found matching criteria.'}</td></tr>
              ) : (
                data.matrix?.map((row) => (
                  <tr key={row.staff?._id || row._id} className="hover:bg-surface-secondary/40 transition-colors print:border-b print:border-black">
                    <td className="py-2 px-3 sticky left-0 bg-surface dark:bg-surface-dark z-10 font-sans border-r border-line dark:border-line-dark shadow-[2px_0_4px_rgba(0,0,0,0.05)] print:static print:shadow-none print:text-black print:border print:border-black">
                      <div className="font-bold text-ink dark:text-white print:text-black truncate max-w-[130px] sm:max-w-[150px]">{row.staff?.name}</div>
                      <div className="text-[10px] text-ink-muted print:text-black">{row.staff?.designation || 'Faculty'} • {row.staff?.employee_code || '—'}</div>
                    </td>
                    {data.days?.map((d) => {
                      const entry = row.dayMap?.[d.dayStr];
                      const st = entry?.status;
                      const bg = st === 'P' ? 'text-emerald-600 bg-emerald-500/10' : st === 'A' ? 'text-rose-600 bg-rose-500/10 font-bold' : st === 'L' ? 'text-amber-600 bg-amber-500/10 font-bold' : st === 'LT' ? 'text-blue-600 bg-blue-500/10' : 'text-slate-300';
                      return (
                        <td key={d.day} className="py-1 px-0.5 text-center print:border print:border-black" title={entry?.in ? `In: ${entry.in}` : ''}>
                          <span className={`inline-block w-5 h-5 leading-5 rounded text-[10px] ${bg} print:bg-transparent print:text-black`}>
                            {st || '·'}
                          </span>
                        </td>
                      );
                    })}
                    <td className="py-2 px-2 text-center font-bold text-emerald-600 print:text-black print:border print:border-black">{row.presentCount}</td>
                    <td className="py-2 px-2 text-center font-bold text-rose-600 print:text-black print:border print:border-black">{row.absentCount}</td>
                    <td className="py-2 px-2 text-center font-bold text-amber-600 print:text-black print:border print:border-black">{row.leaveCount}</td>
                    <td className="py-2 px-2 text-center font-bold text-primary font-sans print:border print:border-black">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary print:bg-transparent print:text-black">
                        {row.percentage}%
                      </span>
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

export default StaffMonthlyRegisterTab;
