import React from 'react';
import PageLoader from '../../common/PageLoader';

const StaffInfoTable = ({ rows = [], columns = [], loading = false }) => {
  const visibleCols = columns.filter((c) => c.visible !== false);

  if (loading) {
    return <PageLoader text="Compiling staff & HR roster..." />;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-surface-secondary/70 dark:bg-white/[0.03] border-b border-line dark:border-line-dark text-[11px] font-bold text-ink-muted uppercase">
          <tr>
            {visibleCols.map((col) => (
              <th key={col.id} className="py-2.5 px-3 whitespace-nowrap">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line dark:divide-line-dark">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={visibleCols.length || 13} className="py-8 text-center text-xs text-ink-muted">
                No staff records found matching criteria.
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id || r.sr} className="hover:bg-surface-secondary/40 transition-colors">
                {visibleCols.map((col) => {
                  if (col.id === 'sr') return <td key={col.id} className="py-2 px-3 font-mono">{r.sr}</td>;
                  if (col.id === 'emp_code') return <td key={col.id} className="py-2 px-3 font-mono font-bold text-primary">{r.emp_code}</td>;
                  if (col.id === 'name') return <td key={col.id} className="py-2 px-3 font-bold text-slate-800 dark:text-white whitespace-nowrap">{r.name}</td>;
                  if (col.id === 'role_designation') return <td key={col.id} className="py-2 px-3 font-semibold text-ink whitespace-nowrap">{r.designation} <span className="text-[10px] text-ink-muted">({r.role})</span></td>;
                  if (col.id === 'qualification') return <td key={col.id} className="py-2 px-3">{r.qualification}</td>;
                  if (col.id === 'contact_number') return <td key={col.id} className="py-2 px-3 font-mono">{r.contact_number}</td>;
                  if (col.id === 'email') return <td key={col.id} className="py-2 px-3 text-[11px] max-w-[140px] truncate" title={r.email}>{r.email}</td>;
                  if (col.id === 'cnic') return <td key={col.id} className="py-2 px-3 font-mono text-[11px] whitespace-nowrap">{r.cnic}</td>;
                  if (col.id === 'joining_date') return <td key={col.id} className="py-2 px-3 font-mono text-[11px] whitespace-nowrap">{r.joining_date}</td>;
                  if (col.id === 'present_mtd') return <td key={col.id} className="py-2 px-3 font-bold text-emerald-600 whitespace-nowrap">{r.present_mtd}</td>;
                  if (col.id === 'absent_leave_mtd') return <td key={col.id} className="py-2 px-3 font-semibold text-rose-500 whitespace-nowrap">{r.absent_leave_mtd}</td>;
                  if (col.id === 'basic_salary') return <td key={col.id} className="py-2 px-3 font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">{r.basic_salary}</td>;
                  if (col.id === 'status') {
                    const isAct = String(r.status).toLowerCase() === 'active';
                    return (
                      <td key={col.id} className="py-2 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isAct ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                          {r.status}
                        </span>
                      </td>
                    );
                  }
                  return <td key={col.id} className="py-2 px-3">{r[col.id] || '—'}</td>;
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffInfoTable;
