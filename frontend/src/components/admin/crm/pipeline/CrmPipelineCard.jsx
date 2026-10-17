import React from 'react';
import { Phone, Calendar, UserPlus, MoreHorizontal } from 'lucide-react';

const priorityColors = {
  Urgent: 'bg-rose-500/10 text-rose-600',
  High: 'bg-amber-500/10 text-amber-600',
  Medium: 'bg-blue-500/10 text-blue-600',
  Low: 'bg-slate-500/10 text-slate-600'
};

const STAGES = [
  'New Inquiry', 'Contacted', 'Visit Scheduled', 'Test / Interview', 'Offer Made', 'Enrolled', 'Lost'
];

export default function CrmPipelineCard({ lead, onMoveStage, onConvert }) {
  const isOverdue = lead.next_follow_up && new Date(lead.next_follow_up) < new Date() && !lead.is_converted;

  return (
    <div className={`p-3.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-2.5 transition-all hover:shadow-md ${lead.is_pinned ? 'border-amber-300 dark:border-amber-700' : ''}`}>
      <div className="flex items-start justify-between gap-1">
        <div>
          <h4 className="font-bold text-xs text-text-primary dark:text-text-primary-dark line-clamp-1">{lead.student_name}</h4>
          <span className="text-[11px] text-text-muted">{lead.grade_id?.name || lead.class_name || 'Class N/A'}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityColors[lead.priority] || priorityColors.Medium}`}>
          {lead.priority || 'Medium'}
        </span>
      </div>

      <div className="text-[11px] text-text-secondary space-y-1">
        <a href={`tel:${lead.contact_country_code || '+92'}${lead.contact_number}`} className="flex items-center gap-1 hover:text-primary">
          <Phone className="w-3 h-3 text-text-muted shrink-0" />
          <span>{lead.contact_country_code || '+92'} {lead.contact_number}</span>
        </a>
        {lead.next_follow_up && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-rose-600 font-bold' : 'text-text-muted'}`}>
            <Calendar className="w-3 h-3 shrink-0" />
            <span>Next: {new Date(lead.next_follow_up).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-line/60 dark:border-line-dark/60 text-xs">
        <select
          value={lead.lead_status}
          onChange={(e) => onMoveStage(lead._id, e.target.value)}
          className="text-[11px] font-medium px-2 py-1 rounded-lg border border-line dark:border-line-dark bg-transparent text-text-secondary cursor-pointer outline-hidden"
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>Move: {s}</option>
          ))}
        </select>

        {!lead.is_converted && (
          <button
            type="button"
            onClick={() => onConvert(lead)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-primary text-white hover:bg-primary-hover shadow-2xs cursor-pointer"
          >
            <UserPlus size={12} /> Convert
          </button>
        )}
      </div>
    </div>
  );
}
