import { memo } from 'react';
import { User } from 'lucide-react';

const StudentAttendanceTableRow = memo(({ student, index, status, remarks, onStatusChange, onRemarksChange, statuses }) => {
  return (
    <tr className="hover:bg-primary/5 transition-colors">
      <td className="py-2.5 px-4 font-mono text-[11px] text-text-muted">
        {student.roll_number || student.gr_number || `S-${index + 1}`}
      </td>
      <td className="py-2.5 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
            {student.photo_url ? <img src={student.photo_url} alt="" className="w-full h-full object-cover" /> : <User className="w-3.5 h-3.5" />}
          </div>
          <div>
            <p className="font-semibold text-xs leading-snug">{student.name}</p>
            <p className="text-[10px] text-text-muted">{student.father_name ? `S/O ${student.father_name}` : ''}</p>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-4">
        <div className="flex items-center justify-center gap-1.5">
          {statuses.map((stObj) => (
            <button
              key={stObj.key}
              type="button"
              onClick={() => onStatusChange(student._id, stObj.key)}
              className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all ${status === stObj.key ? stObj.active : 'border-line dark:border-white/10 text-text-muted hover:border-text-muted'}`}
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
          value={remarks || ''}
          onChange={(e) => onRemarksChange(student._id, e.target.value)}
          placeholder="Optional notes..."
          className="w-full px-2.5 py-1 text-xs rounded-lg border border-line dark:border-white/10 bg-transparent text-text dark:text-text-dark focus:outline-hidden focus:ring-1 focus:ring-primary"
        />
      </td>
    </tr>
  );
});

const StudentAttendanceTable = ({ students, attendanceMap, onStatusChange, onRemarksChange, onMarkAll }) => {
  const statuses = [
    { key: 'Present', label: 'P', color: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 font-bold', active: 'bg-emerald-600 text-white' },
    { key: 'Absent', label: 'A', color: 'bg-rose-500/15 text-rose-600 border-rose-500/30 font-bold', active: 'bg-rose-600 text-white' },
    { key: 'Late', label: 'L', color: 'bg-amber-500/15 text-amber-600 border-amber-500/30 font-bold', active: 'bg-amber-600 text-white' },
    { key: 'Excused', label: 'E', color: 'bg-blue-500/15 text-blue-600 border-blue-500/30 font-bold', active: 'bg-blue-600 text-white' }
  ];

  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
      <div className="p-4 border-b border-line dark:border-white/10 flex flex-wrap items-center justify-between gap-3 bg-surface-alt/50 dark:bg-white/5">
        <h3 className="text-xs font-semibold text-text dark:text-text-dark">Student Roll List ({students.length})</h3>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onMarkAll('Present')} className="px-3 py-1 text-xs font-medium rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors">
            Mark All Present
          </button>
          <button type="button" onClick={() => onMarkAll('Absent')} className="px-3 py-1 text-xs font-medium rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors">
            Mark All Absent
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-alt dark:bg-white/5 text-text-muted border-b border-line dark:border-white/10 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-2.5 px-4 font-semibold">Roll / GR</th>
              <th className="py-2.5 px-4 font-semibold">Student Name</th>
              <th className="py-2.5 px-4 font-semibold text-center">Status</th>
              <th className="py-2.5 px-4 font-semibold">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-white/5 text-text dark:text-text-dark">
            {students.map((st, idx) => {
              const record = attendanceMap[st._id];
              return (
                <StudentAttendanceTableRow
                  key={st._id}
                  student={st}
                  index={idx}
                  status={record?.status || 'Present'}
                  remarks={record?.remarks || ''}
                  onStatusChange={onStatusChange}
                  onRemarksChange={onRemarksChange}
                  statuses={statuses}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAttendanceTable;
