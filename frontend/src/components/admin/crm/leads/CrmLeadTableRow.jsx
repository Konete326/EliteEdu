import React from 'react';
import CrmLeadRowActions from './CrmLeadRowActions';
import { Calendar, Phone, CheckCircle2 } from 'lucide-react';

const statusColors = {
  'New Inquiry': 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800',
  'Contacted': 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800',
  'Visit Scheduled': 'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800',
  'Test / Interview': 'bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800',
  'Offer Made': 'bg-teal-500/10 text-teal-600 border-teal-200 dark:border-teal-800',
  'Enrolled': 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800',
  'Lost': 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800'
};

const priorityColors = { Urgent: 'text-rose-600 font-bold', High: 'text-amber-600 font-semibold', Medium: 'text-blue-600', Low: 'text-slate-500' };

export default function CrmLeadTableRow({ lead, onTogglePin, onOpenFollowUp, onOpenConvert, onOpenDelete }) {
  const isOverdue = lead.next_follow_up && new Date(lead.next_follow_up) < new Date() && !lead.is_converted;

  return (
    <tr className={`hover:bg-hover/60 transition-colors ${lead.is_pinned ? 'bg-amber-500/5 dark:bg-amber-500/10' : ''}`}>
      <td className="px-4 py-3 font-semibold text-text-primary dark:text-text-primary-dark">
        <div className="flex items-center gap-1.5">
          <span>{lead.student_name}</span>
          {lead.is_converted && <span title="Enrolled Student" className="text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /></span>}
        </div>
      </td>
      <td className="px-4 py-3 text-text-secondary">{lead.father_name || '—'}</td>
      <td className="px-4 py-3 text-text-secondary">
        <a href={`tel:${lead.contact_country_code || '+92'}${lead.contact_number}`} className="flex items-center gap-1 hover:text-primary">
          <Phone className="w-3 h-3 text-text-muted" />
          <span>{lead.contact_country_code || '+92'} {lead.contact_number}</span>
        </a>
      </td>
      <td className="px-4 py-3 text-text-secondary">{lead.grade_id?.name || lead.class_name || '—'}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[lead.lead_status] || 'bg-slate-100 text-slate-700'}`}>
          {lead.lead_status}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`text-[11px] ${priorityColors[lead.priority] || ''}`}>{lead.priority || 'Medium'}</span>
      </td>
      <td className="px-4 py-3 text-text-muted">{lead.lead_source || 'Walk-in'}</td>
      <td className="px-4 py-3">
        {lead.next_follow_up ? (
          <span className={`flex items-center gap-1 text-[11px] ${isOverdue ? 'text-rose-600 font-bold' : 'text-text-muted'}`}>
            <Calendar className="w-3 h-3" />
            {new Date(lead.next_follow_up).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-text-muted text-[11px]">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <CrmLeadRowActions lead={lead} onTogglePin={onTogglePin} onOpenFollowUp={onOpenFollowUp} onOpenConvert={onOpenConvert} onOpenDelete={onOpenDelete} />
      </td>
    </tr>
  );
}
