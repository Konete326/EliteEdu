import React from 'react';
import { User, QrCode } from 'lucide-react';

const STATUS_BUTTONS = [
  { code: 'P', label: 'P', activeClass: 'bg-emerald-600 text-white shadow-xs', title: 'Present' },
  { code: 'A', label: 'A', activeClass: 'bg-rose-600 text-white shadow-xs', title: 'Absent' },
  { code: 'L', label: 'L', activeClass: 'bg-sky-600 text-white shadow-xs', title: 'Leave' },
  { code: 'LT', label: 'LT', activeClass: 'bg-amber-600 text-white shadow-xs', title: 'Late' },
  { code: 'HD', label: 'HD', activeClass: 'bg-violet-600 text-white shadow-xs', title: 'Half Day' }
];

const StudentAttendanceSheetTable = ({ records = [], onStatusChange, onRemarksChange }) => {
  return (
    <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 h-full">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="sticky top-0 z-10 bg-surface dark:bg-surface-dark shadow-2xs text-ink-muted border-b border-line dark:border-line-dark uppercase tracking-wider text-[10px] font-semibold">
          <tr>
            <th className="py-3 px-4 w-28 bg-surface dark:bg-surface-dark">Roll / GR</th>
            <th className="py-3 px-4 bg-surface dark:bg-surface-dark">Student Details</th>
            <th className="py-3 px-4 text-center w-56 bg-surface dark:bg-surface-dark">Attendance Status</th>
            <th className="py-3 px-4 w-60 bg-surface dark:bg-surface-dark">Remarks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60 dark:divide-line-dark/60 text-ink dark:text-ink-dark">
          {records.map((r, idx) => {
            const student = r.student || {};
            const fullName = (student.name || `${student.first_name || ''} ${student.last_name || ''}`).trim() || 'Student';
            const rollDisplay = student.roll_number || student.gr_number || `S-${idx + 1}`;
            const photo = student.photo_url || student.avatar_url || student.image || student.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0d9488&color=fff&size=64&bold=true`;

            return (
              <tr key={student._id || r._id} className="hover:bg-surface-secondary/40 dark:hover:bg-surface-secondary-dark/40 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-[11px] text-ink-muted">
                  {rollDisplay}
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-line dark:border-line-dark shadow-2xs">
                      {photo ? (
                        <img
                          src={photo}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-bold text-xs text-ink dark:text-ink-dark leading-tight truncate">
                          {fullName}
                        </p>
                        {r.marked_via === 'Card_Scan' && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                            <QrCode className="w-2.5 h-2.5" /> Scan
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-ink-muted truncate">
                        {student.father_name ? `S/O ${student.father_name}` : `GR: ${student.gr_number || 'N/A'}`}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-1 bg-surface-secondary dark:bg-surface-secondary-dark p-1 rounded-xl w-fit mx-auto border border-line dark:border-line-dark">
                    {STATUS_BUTTONS.map((opt) => (
                      <button
                        key={opt.code}
                        type="button"
                        title={opt.title}
                        onClick={() => onStatusChange(student._id || r._id, opt.code)}
                        className={`w-7 h-7 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          r.status === opt.code
                            ? opt.activeClass
                            : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </td>

                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={r.remarks || ''}
                    onChange={(e) => onRemarksChange(student._id || r._id, e.target.value)}
                    placeholder="Optional remarks..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StudentAttendanceSheetTable;
