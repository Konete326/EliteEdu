import React from 'react';
import { UserCheck, Shield, Phone, Mail, Award } from 'lucide-react';

const StaffReportTable = ({ rows = [], loading = false }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-surface-secondary/70 dark:bg-white/[0.03] border-b border-line dark:border-line-dark text-[11px] font-bold text-ink-muted uppercase">
          <tr>
            <th className="py-2.5 px-3">SR#</th>
            <th className="py-2.5 px-3">Staff Profile</th>
            <th className="py-2.5 px-3">Emp Code</th>
            <th className="py-2.5 px-3">Designation / Role</th>
            <th className="py-2.5 px-3">BPS Grade</th>
            <th className="py-2.5 px-3">Campus</th>
            <th className="py-2.5 px-3">Contact Lines</th>
            <th className="py-2.5 px-3 text-right">Basic Salary</th>
            <th className="py-2.5 px-3">Joining Date</th>
            <th className="py-2.5 px-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line dark:divide-line-dark">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={10} className="py-10 text-center text-xs text-ink-muted">
                {loading ? 'Compiling staff directory records...' : 'No faculty or staff found matching criteria.'}
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id} className="hover:bg-surface-secondary/40 transition-colors">
                <td className="py-2.5 px-3 font-mono text-ink-muted">{r.sr}</td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2.5">
                    {r.photo_url ? (
                      <img src={r.photo_url} alt="" className="w-8 h-8 rounded-xl object-cover border border-line" />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                        {r.name?.charAt(0) || 'S'}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-ink dark:text-white leading-tight">{r.name}</div>
                      <div className="text-[10px] text-ink-muted">{r.qualification || r.department}</div>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-primary">{r.employee_code}</td>
                <td className="py-2.5 px-3">
                  <div className="font-semibold text-ink dark:text-white">{r.designation}</div>
                  <div className="text-[10px] text-ink-muted">{r.role} • {r.department}</div>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-ink">{r.bps_grade}</td>
                <td className="py-2.5 px-3 text-xs font-semibold">{r.campus_name}</td>
                <td className="py-2.5 px-3 font-mono text-[11px]">
                  <div className="text-ink font-semibold">{r.contact_number}</div>
                  <div className="text-[10px] text-ink-muted lowercase">{r.email}</div>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-right text-emerald-600">
                  {r.basic_salary > 0 ? `Rs. ${Number(r.basic_salary).toLocaleString()}` : '—'}
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-ink-muted">{r.joining_date}</td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffReportTable;
