import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Mail, UserX, ShieldAlert } from 'lucide-react';
import api from '../../../../services/api';
import ReportExportToolbar from '../../reports/ReportExportToolbar';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';

const LowAttendanceAlertTab = ({ activeCampusId }) => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [threshold, setThreshold] = useState(75);
  const [targetType, setTargetType] = useState('Student');
  const [data, setData] = useState({ matrix: [] });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const endpoint = targetType === 'Student' ? '/attendance-reports/student-monthly-matrix' : '/attendance-reports/staff-monthly-matrix';
      const res = await api.get(endpoint, { params: { month, campus_id: activeCampusId, search } });
      setData(res.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadAlerts(); }, [month, targetType, activeCampusId]);

  const atRiskRows = (data.matrix || []).filter((r) => (r.presentCount + r.absentCount + r.leaveCount) > 0 && r.percentage < threshold);

  const exportCols = [
    { key: 'name', label: 'Name' }, { key: 'role_info', label: 'Class / Role' },
    { key: 'presentCount', label: 'P' }, { key: 'absentCount', label: 'A' },
    { key: 'leaveCount', label: 'L' }, { key: 'percentage', label: 'Rate %' }
  ];
  const exportRows = atRiskRows.map((r) => ({
    name: targetType === 'Student' ? r.student?.name : r.staff?.name,
    role_info: targetType === 'Student' ? `Class: ${r.student?.current_section || 'A'}` : r.staff?.designation,
    presentCount: r.presentCount, absentCount: r.absentCount, leaveCount: r.leaveCount, percentage: r.percentage
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-line bg-transparent text-xs font-mono font-bold" />
          <select value={targetType} onChange={(e) => setTargetType(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-line bg-transparent text-xs font-semibold">
            <option value="Student">Students At-Risk</option>
            <option value="Staff">Faculty / Staff At-Risk</option>
          </select>
          <select value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="px-2.5 py-1.5 rounded-xl border border-line bg-transparent text-xs font-semibold">
            <option value={75}>Below 75% (Official Policy)</option>
            <option value={60}>Below 60% (Severe Defaulters)</option>
            <option value={50}>Below 50% (Critical)</option>
          </select>
        </div>
        <div className="text-xs font-bold text-rose-600 bg-rose-500/10 px-3 py-1 rounded-xl flex items-center gap-1.5">
          <AlertTriangle size={14} /> {atRiskRows.length} Defaulters Detected
        </div>
      </div>

      <ReportExportToolbar columns={exportCols} rows={exportRows} filename={`low-attendance-${month}`} searchTerm={search} onSearchChange={setSearch} />

      <div className="overflow-x-auto rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-secondary/70 dark:bg-white/[0.03] border-b border-line dark:border-line-dark text-[11px] font-bold text-ink-muted uppercase">
            <tr>
              <th className="py-2.5 px-3">Subject Profile</th>
              <th className="py-2.5 px-3">Class / Designation</th>
              <th className="py-2.5 px-3 text-center text-emerald-600">Present</th>
              <th className="py-2.5 px-3 text-center text-rose-600">Absent</th>
              <th className="py-2.5 px-3 text-center text-amber-600">Leave</th>
              <th className="py-2.5 px-3 text-center">Attendance %</th>
              <th className="py-2.5 px-3">Defaulter Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark">
            {atRiskRows.length === 0 ? (
              <tr><td colSpan={7} className="py-10 text-center text-xs text-ink-muted">{loading ? 'Checking records...' : `Excellent! No ${targetType.toLowerCase()}s found below ${threshold}% attendance.`}</td></tr>
            ) : (
              atRiskRows.map((r) => {
                const entity = targetType === 'Student' ? r.student : r.staff;
                return (
                  <tr key={entity?._id} className="hover:bg-rose-500/[0.03] transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-ink dark:text-white">{entity?.name}</div>
                      <div className="text-[10px] text-ink-muted">{targetType === 'Student' ? `GR: ${entity?.gr_number || '—'} • Father: ${entity?.father_name || '—'}` : `Code: ${entity?.employee_code || '—'} • ${entity?.email || ''}`}</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-xs">{targetType === 'Student' ? `Class Section ${entity?.current_section || 'A'}` : entity?.designation || 'Staff'}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">{r.presentCount}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-600">{r.absentCount}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-600">{r.leaveCount}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-600"><span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">{r.percentage}%</span></td>
                    <td className="py-2.5 px-3"><span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase tracking-wide"><ShieldAlert size={12} /> Low Attendance Alert</span></td>
                  </tr>
                );
              })
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

export default LowAttendanceAlertTab;
