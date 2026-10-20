import React, { useState, useEffect } from 'react';
import { Calendar, Search } from 'lucide-react';
import api from '../../../../services/api';
import ReportExportToolbar from '../../reports/ReportExportToolbar';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';
import ClassSearchableSelect from '../ClassSearchableSelect';

const StudentMonthlyRegisterTab = ({ activeCampusId }) => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [search, setSearch] = useState('');
  const [data, setData] = useState({ days: [], matrix: [], header: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/grades').then((r) => {
      const gList = r.data?.grades || r.data || [];
      setGrades(gList);
      if (gList.length > 0 && selectedGrade === 'all') {
        setSelectedGrade(gList[0]._id);
      }
    }).catch(() => {});
  }, []);

  const loadMatrix = async () => {
    try {
      setLoading(true);
      const res = await api.get('/attendance-reports/student-monthly-matrix', {
        params: { month, grade_id: selectedGrade, section: selectedSection, campus_id: activeCampusId, search }
      });
      setData(res.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadMatrix(); }, [month, selectedGrade, selectedSection, activeCampusId]);

  const exportCols = [
    { key: 'student_name', label: 'Student' }, { key: 'gr_number', label: 'GR#' },
    { key: 'presentCount', label: 'P' }, { key: 'absentCount', label: 'A' },
    { key: 'leaveCount', label: 'L' }, { key: 'percentage', label: 'Rate %' }
  ];
  const exportRows = (data.matrix || []).map((m) => ({ ...m, student_name: m.student?.name, gr_number: m.student?.gr_number }));

  return (
    <div className="space-y-3 flex-1 min-h-0 flex flex-col">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-line bg-transparent text-xs font-mono font-bold" />
          <div className="w-48">
            <ClassSearchableSelect
              grades={grades}
              selectedGradeId={selectedGrade}
              onGradeChange={setSelectedGrade}
              allowAll={true}
              allLabel="All Classes"
              placeholder="Search or type class..."
            />
          </div>
          <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-line bg-transparent text-xs font-semibold">
            <option value="all">All Sections</option>
            {['A', 'B', 'C', 'D'].map((s) => <option key={s} value={s}>Section {s}</option>)}
          </select>
        </div>
        <button onClick={loadMatrix} className="px-3.5 py-1.5 rounded-xl bg-surface-secondary text-xs font-bold hover:bg-line text-ink cursor-pointer">Filter</button>
      </div>

      <div className="shrink-0">
        <ReportExportToolbar columns={exportCols} rows={exportRows} filename={`student-register-${month}`} searchTerm={search} onSearchChange={setSearch} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs print:[print-color-adjust:exact]">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-20 bg-surface dark:bg-surface-dark shadow-2xs border-b border-line dark:border-line-dark text-[10px] font-bold text-ink-muted uppercase">
            <tr>
              <th className="py-2.5 px-3 sticky left-0 bg-surface dark:bg-surface-dark z-30 min-w-[140px] border-r border-line dark:border-line-dark shadow-[2px_0_4px_rgba(0,0,0,0.05)]">Student / GR#</th>
              {(data.days || []).map((d) => (
                <th key={d.day} className="py-1 px-1 text-center min-w-[24px] font-mono bg-surface dark:bg-surface-dark">{d.day}</th>
              ))}
              <th className="py-2.5 px-2 text-center text-emerald-600 bg-surface dark:bg-surface-dark">P</th>
              <th className="py-2.5 px-2 text-center text-rose-600 bg-surface dark:bg-surface-dark">A</th>
              <th className="py-2.5 px-2 text-center text-amber-600 bg-surface dark:bg-surface-dark">L</th>
              <th className="py-2.5 px-2 text-center text-primary bg-surface dark:bg-surface-dark">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark font-mono text-[11px]">
            {data.matrix?.length === 0 ? (
              <tr><td colSpan={(data.days?.length || 31) + 5} className="py-8 text-center text-xs text-ink-muted font-sans">{loading ? 'Loading monthly register...' : 'No students matching filter.'}</td></tr>
            ) : (
              data.matrix?.map((row) => (
                <tr key={row.student?._id} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="py-2 px-3 sticky left-0 bg-surface dark:bg-surface-dark z-10 font-sans border-r border-line dark:border-line-dark shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
                    <div className="font-bold text-ink dark:text-white truncate max-w-[140px]">{row.student?.name}</div>
                    <div className="text-[10px] text-ink-muted">GR: {row.student?.gr_number || '—'}</div>
                  </td>
                  {data.days?.map((d) => {
                    const st = row.dayMap[d.dayStr];
                    const bg = st === 'P' ? 'text-emerald-600 bg-emerald-500/10' : st === 'A' ? 'text-rose-600 bg-rose-500/10 font-bold' : st === 'L' ? 'text-amber-600 bg-amber-500/10 font-bold' : st === 'LT' ? 'text-blue-600 bg-blue-500/10' : 'text-slate-300';
                    return <td key={d.day} className="py-1 px-0.5 text-center"><span className={`inline-block w-5 h-5 leading-5 rounded text-[10px] ${bg}`}>{st || '·'}</span></td>;
                  })}
                  <td className="py-2 px-2 text-center font-bold text-emerald-600">{row.presentCount}</td>
                  <td className="py-2 px-2 text-center font-bold text-rose-600">{row.absentCount}</td>
                  <td className="py-2 px-2 text-center font-bold text-amber-600">{row.leaveCount}</td>
                  <td className="py-2 px-2 text-center font-bold text-primary font-sans"><span className={`px-1.5 py-0.5 rounded text-[10px] ${row.isLowAttendance ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>{row.percentage}%</span></td>
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

export default StudentMonthlyRegisterTab;
