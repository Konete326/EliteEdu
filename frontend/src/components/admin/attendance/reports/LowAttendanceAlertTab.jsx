import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, ShieldAlert, Sliders } from 'lucide-react';
import api from '../../../../services/api';
import ReportExportToolbar from '../../reports/ReportExportToolbar';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';

const getInstitutionalThreshold = () => {
  try {
    const raw = localStorage.getItem('elite_attendance_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.lowAttendanceThreshold) return Number(parsed.lowAttendanceThreshold);
    }
  } catch {}
  return 75;
};

const LowAttendanceAlertTab = ({ activeCampusId }) => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [policyThreshold, setPolicyThreshold] = useState(getInstitutionalThreshold);
  const [threshold, setThreshold] = useState(getInstitutionalThreshold);
  const [targetType, setTargetType] = useState('Student');
  const [data, setData] = useState({ matrix: [] });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const syncSettings = useCallback(() => {
    const current = getInstitutionalThreshold();
    setPolicyThreshold(current);
  }, []);

  useEffect(() => {
    window.addEventListener('elite_attendance_settings_updated', syncSettings);
    window.addEventListener('storage', syncSettings);
    return () => {
      window.removeEventListener('elite_attendance_settings_updated', syncSettings);
      window.removeEventListener('storage', syncSettings);
    };
  }, [syncSettings]);

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

  const handleUpdatePolicyDefault = () => {
    try {
      const raw = localStorage.getItem('elite_attendance_settings');
      const existing = raw ? JSON.parse(raw) : {};
      existing.lowAttendanceThreshold = Number(threshold);
      localStorage.setItem('elite_attendance_settings', JSON.stringify(existing));
      setPolicyThreshold(Number(threshold));
      window.dispatchEvent(new Event('elite_attendance_settings_updated'));
      window.dispatchEvent(new Event('elite_settings_updated'));
    } catch {}
  };

  return (
    <div className="space-y-3 flex-1 min-h-0 flex flex-col">
      <div className="shrink-0 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs print:hidden">
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-xs font-mono font-bold text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-xs font-semibold text-ink dark:text-ink-dark outline-none focus:border-primary"
            >
              <option value="Student">Students At-Risk</option>
              <option value="Staff">Faculty / Staff At-Risk</option>
            </select>
            <div className="flex items-center gap-1.5">
              <select
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-xs font-semibold text-ink dark:text-ink-dark outline-none focus:border-primary"
              >
                <option value={policyThreshold}>Below {policyThreshold}% (Official Policy)</option>
                <option value={80}>Below 80% (Warning Level)</option>
                <option value={75}>Below 75% (Standard Default)</option>
                <option value={60}>Below 60% (Severe Defaulters)</option>
                <option value={50}>Below 50% (Critical Alert)</option>
              </select>
              <div className="flex items-center gap-1 bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark rounded-xl px-2 py-1">
                <span className="text-[11px] text-ink-muted font-bold">%</span>
                <input
                  type="number"
                  min="10"
                  max="99"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-12 text-xs font-bold text-ink dark:text-ink-dark bg-transparent outline-none"
                  title="Custom Attendance Threshold %"
                />
              </div>
              {threshold !== policyThreshold && (
                <button
                  type="button"
                  onClick={handleUpdatePolicyDefault}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all cursor-pointer flex items-center gap-1"
                  title="Save current threshold as institutional policy default"
                >
                  <Sliders size={12} />
                  <span>Set as Default</span>
                </button>
              )}
            </div>
          </div>
          <div className="text-xs font-bold text-rose-600 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <AlertTriangle size={14} />
            <span>{atRiskRows.length} Defaulters Below {threshold}%</span>
          </div>
        </div>

        <ReportExportToolbar columns={exportCols} rows={exportRows} filename={`low-attendance-${month}`} searchTerm={search} onSearchChange={setSearch} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs print:[print-color-adjust:exact]">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-20 bg-surface dark:bg-surface-dark shadow-2xs border-b border-line dark:border-line-dark text-[11px] font-bold text-ink-muted uppercase">
            <tr>
              <th className="py-2.5 px-3 bg-surface dark:bg-surface-dark">Subject Profile</th>
              <th className="py-2.5 px-3 bg-surface dark:bg-surface-dark">Class / Designation</th>
              <th className="py-2.5 px-3 text-center text-emerald-600 bg-surface dark:bg-surface-dark">Present</th>
              <th className="py-2.5 px-3 text-center text-rose-600 bg-surface dark:bg-surface-dark">Absent</th>
              <th className="py-2.5 px-3 text-center text-amber-600 bg-surface dark:bg-surface-dark">Leave</th>
              <th className="py-2.5 px-3 text-center bg-surface dark:bg-surface-dark">Attendance %</th>
              <th className="py-2.5 px-3 bg-surface dark:bg-surface-dark">Defaulter Status</th>
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
