import React from 'react';
import CrmLeadTableRow from './CrmLeadTableRow';

export default function CrmLeadsTable({
  leads = [],
  loading,
  page,
  totalPages,
  onPageChange,
  onTogglePin,
  onOpenFollowUp,
  onOpenConvert,
  onOpenDelete
}) {
  if (loading) {
    return <div className="py-20 text-center text-xs text-text-muted">Loading CRM leads...</div>;
  }

  if (leads.length === 0) {
    return (
      <div className="py-16 text-center text-xs text-text-muted bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark">
        No prospective inquiries found matching current filters.
      </div>
    );
  }

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-secondary/50 dark:bg-slate-800/60 text-text-muted font-bold uppercase tracking-wider border-b border-line dark:border-line-dark">
            <tr>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Father Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Next Follow-up</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark">
            {leads.map((lead) => (
              <CrmLeadTableRow
                key={lead._id}
                lead={lead}
                onTogglePin={onTogglePin}
                onOpenFollowUp={onOpenFollowUp}
                onOpenConvert={onOpenConvert}
                onOpenDelete={onOpenDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-3 border-t border-line dark:border-line-dark text-xs">
        <span className="text-text-muted">Page {page} of {totalPages}</span>
        <div className="flex gap-1.5">
          <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1 rounded-lg border border-line dark:border-line-dark hover:bg-hover disabled:opacity-40 cursor-pointer">Previous</button>
          <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="px-3 py-1 rounded-lg border border-line dark:border-line-dark hover:bg-hover disabled:opacity-40 cursor-pointer">Next</button>
        </div>
      </div>
    </div>
  );
}
