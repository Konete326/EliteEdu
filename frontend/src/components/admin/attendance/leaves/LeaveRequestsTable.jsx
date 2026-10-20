import React from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import LeaveRequestRow from './LeaveRequestRow';

const LeaveRequestsTable = ({
  leaves = [], pagination = {}, search = '', onSearchChange,
  statusFilter = 'all', onStatusChange, applicantFilter = 'all', onApplicantChange,
  onApprove, onReject, onPrint, onDelete, isProcessing, onPageChange
}) => {
  return (
    <div className="rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs overflow-hidden flex flex-col flex-1 min-h-0">
      <div className="shrink-0 p-3 border-b border-line dark:border-line-dark flex flex-wrap items-center justify-between gap-3 bg-surface-secondary/30 dark:bg-white/[0.01]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'Pending', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onStatusChange(st)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st ? 'bg-primary text-white shadow-2xs' : 'text-ink-muted hover:text-ink hover:bg-surface-secondary'
              }`}
            >
              {st === 'all' ? 'All Status' : st}
            </button>
          ))}
          <div className="h-4 w-[1px] bg-line dark:bg-line-dark mx-1 hidden sm:block" />
          <select
            value={applicantFilter}
            onChange={(e) => onApplicantChange(e.target.value)}
            className="px-2 py-1 rounded-xl border border-line bg-surface text-xs font-semibold"
          >
            <option value="all">All Applicants</option>
            <option value="Student">Students Only</option>
            <option value="Staff">Staff Only</option>
          </select>
        </div>

        <div className="relative flex-1 sm:max-w-xs min-w-[180px]">
          <Search size={13} className="absolute left-2.5 top-2.5 text-ink-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search applicant, class, or reason..."
            className="w-full pl-7 pr-3 py-1.5 rounded-xl border border-line bg-surface text-xs"
          />
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 h-full">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-surface dark:bg-surface-dark shadow-2xs border-b border-line dark:border-line-dark text-[11px] font-bold text-ink-muted uppercase">
            <tr>
              <th className="py-2.5 px-3 bg-surface dark:bg-surface-dark">Applicant</th>
              <th className="py-2.5 px-3 bg-surface dark:bg-surface-dark">Leave Type</th>
              <th className="py-2.5 px-3 bg-surface dark:bg-surface-dark">Period & Days</th>
              <th className="py-2.5 px-3 bg-surface dark:bg-surface-dark">Reason</th>
              <th className="py-2.5 px-3 bg-surface dark:bg-surface-dark">Status</th>
              <th className="py-2.5 px-3 text-right bg-surface dark:bg-surface-dark">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark">
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs text-ink-muted">
                  No leave applications found matching filters.
                </td>
              </tr>
            ) : (
              leaves.map((l) => (
                <LeaveRequestRow
                  key={l._id}
                  leave={l}
                  onApprove={onApprove}
                  onReject={onReject}
                  onPrint={onPrint}
                  onDelete={onDelete}
                  isProcessing={isProcessing}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="shrink-0 p-3 border-t border-line dark:border-line-dark flex items-center justify-between text-xs text-ink-muted">
          <span>Page {pagination.page} of {pagination.pages} ({pagination.total} total)</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="p-1 rounded-lg border border-line disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.pages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="p-1 rounded-lg border border-line disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestsTable;
