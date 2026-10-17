import React from 'react';
import { Search, Calendar, Phone, AlertCircle } from 'lucide-react';

export default function CrmFollowUpQueue({
  leads = [],
  selectedLeadId,
  onSelectLead,
  activeFilter,
  onFilterChange,
  search,
  onSearchChange
}) {
  return (
    <div className="bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark p-4 space-y-3.5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-text-muted">Follow-up Queue</h3>
        <div className="flex bg-surface-secondary/40 p-0.5 rounded-xl text-[11px] font-bold">
          {['today', 'overdue', 'upcoming', 'all'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onFilterChange(f)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                activeFilter === f
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {f === 'today' ? 'Due Today' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by name, phone..."
          className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-transparent text-text-primary outline-hidden"
        />
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
        {leads.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-muted">No follow-ups in this queue.</div>
        ) : (
          leads.map((lead) => {
            const isSelected = lead._id === selectedLeadId;
            const isOverdue = lead.next_follow_up && new Date(lead.next_follow_up) < new Date() && !lead.is_converted;
            return (
              <div
                key={lead._id}
                onClick={() => onSelectLead(lead)}
                className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  isSelected
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-xs'
                    : 'border-line dark:border-line-dark hover:bg-hover'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-text-primary dark:text-text-primary-dark">{lead.student_name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isOverdue ? 'bg-rose-500/10 text-rose-600' : 'bg-surface-secondary text-text-muted'
                  }`}>
                    {lead.lead_status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-secondary">
                  <span>Class: {lead.grade_id?.name || lead.class_name || 'N/A'}</span>
                  <span>{lead.contact_country_code || '+92'} {lead.contact_number}</span>
                </div>
                {lead.next_follow_up && (
                  <div className={`flex items-center gap-1 text-[11px] ${isOverdue ? 'text-rose-600 font-bold' : 'text-text-muted'}`}>
                    <Calendar className="w-3 h-3" />
                    <span>Scheduled: {new Date(lead.next_follow_up).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
