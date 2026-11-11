import { UserCheck, UserX, Clock, AlertTriangle, User } from 'lucide-react';
import StaffAttendanceMobileCard from './StaffAttendanceMobileCard';

const StaffAttendanceTable = ({ staff, attendanceMap, onStatusChange, onRemarksChange, onMarkAll }) => {
  const statuses = [
    { key: 'Present', label: 'P', active: 'bg-emerald-600 text-white' },
    { key: 'Absent', label: 'A', active: 'bg-rose-600 text-white' },
    { key: 'Late', label: 'L', active: 'bg-amber-600 text-white' },
    { key: 'Half_Day', label: 'HD', active: 'bg-purple-600 text-white' }
  ];

  return (
    <div className="space-y-4">
      <div className="p-3.5 sm:p-4 rounded-2xl border border-line dark:border-white/10 flex flex-wrap items-center justify-between gap-3 bg-surface dark:bg-[#0c0c0c] shadow-xs">
        <h3 className="text-xs sm:text-sm font-bold text-ink dark:text-white">Staff &amp; Faculty Register ({staff.length})</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onMarkAll('Present')}
            className="min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors cursor-pointer"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={() => onMarkAll('Absent')}
            className="min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors cursor-pointer"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      <div className="block md:hidden space-y-3">
        {staff.map((mem, idx) => (
          <StaffAttendanceMobileCard
            key={mem._id}
            mem={mem}
            record={attendanceMap[mem._id] || { status: 'Present', remarks: '' }}
            onStatusChange={onStatusChange}
            onRemarksChange={onRemarksChange}
            index={idx}
          />
        ))}
      </div>

      <div className="hidden md:block bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 dark:bg-white/5 text-ink-muted border-b border-line dark:border-white/10 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Staff Code</th>
                <th className="py-2.5 px-4 font-semibold">Staff Member</th>
                <th className="py-2.5 px-4 font-semibold">Designation / Role</th>
                <th className="py-2.5 px-4 font-semibold text-center">Status</th>
                <th className="py-2.5 px-4 font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-white/5 text-ink dark:text-white">
              {staff.map((mem, idx) => {
                const record = attendanceMap[mem._id] || { status: 'Present', remarks: '' };
                return (
                  <tr key={mem._id} className="hover:bg-primary/5 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-ink-muted">
                      {mem.employee_id || mem.code || `EMP-${idx + 1}`}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                          {mem.photo_url ? <img src={mem.photo_url} alt="" className="w-full h-full object-cover" /> : <User className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <p className="font-semibold text-xs leading-snug">{mem.name}</p>
                          <p className="text-[10px] text-ink-muted">{mem.email || mem.contact_number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-[11px] text-ink-muted">
                      {mem.designation || mem.role || 'Teacher'}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {statuses.map((stObj) => (
                          <button
                            key={stObj.key}
                            type="button"
                            onClick={() => onStatusChange(mem._id, stObj.key)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all ${record.status === stObj.key ? stObj.active : 'border-line dark:border-white/10 text-ink-muted hover:border-ink-muted cursor-pointer'}`}
                            title={stObj.key}
                          >
                            {stObj.label}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <input
                        type="text"
                        value={record.remarks || ''}
                        onChange={(e) => onRemarksChange(mem._id, e.target.value)}
                        placeholder="Optional notes..."
                        className="w-full px-2.5 py-1 text-xs rounded-lg border border-line dark:border-white/10 bg-transparent text-ink dark:text-white focus:outline-hidden focus:ring-1 focus:ring-primary"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendanceTable;
