import React from 'react';
import { Tag, Plus } from 'lucide-react';

export default function CrmClassificationCard({
  formData,
  onChange,
  onOpenQuickAddStatus,
  onOpenQuickAddSource
}) {
  return (
    <div className="bg-surface dark:bg-surface-dark p-5 rounded-2xl border border-line dark:border-line-dark shadow-xs space-y-4">
      <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark flex items-center gap-2 border-b border-line dark:border-line-dark pb-2">
        <Tag className="w-4 h-4 text-primary" /> Lead Classification
      </h3>
      <div className="space-y-3 text-xs">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold text-text-muted uppercase">Lead Status</label>
            <button type="button" onClick={onOpenQuickAddStatus} className="text-primary hover:text-primary-hover flex items-center gap-0.5 text-[11px] font-bold cursor-pointer"><Plus size={12} /> Add</button>
          </div>
          <select value={formData.lead_status || 'New Inquiry'} onChange={(e) => onChange('lead_status', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-transparent font-semibold">
            {['New Inquiry', 'Contacted', 'Visit Scheduled', 'Test / Interview', 'Offer Made', 'Enrolled', 'Lost'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold text-text-muted uppercase">Lead Source</label>
            <button type="button" onClick={onOpenQuickAddSource} className="text-primary hover:text-primary-hover flex items-center gap-0.5 text-[11px] font-bold cursor-pointer"><Plus size={12} /> Add</button>
          </div>
          <select value={formData.lead_source || 'Walk-in'} onChange={(e) => onChange('lead_source', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-transparent font-semibold">
            {['Walk-in', 'Facebook', 'Website', 'WhatsApp', 'Referral', 'Banner'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Priority</label>
            <select value={formData.priority || 'Medium'} onChange={(e) => onChange('priority', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-transparent">
              {['Low', 'Medium', 'High', 'Urgent'].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Purpose</label>
            <input type="text" value={formData.purpose || 'Admission inquiry'} onChange={(e) => onChange('purpose', e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent font-medium" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Tag / Label</label>
          <input type="text" value={formData.tag_label || ''} onChange={(e) => onChange('tag_label', e.target.value)} placeholder="e.g. Sibling Discount, Fast Track" className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent font-medium" />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Expected Enrollment Date</label>
          <input type="date" value={formData.expected_enrollment_date ? String(formData.expected_enrollment_date).substring(0, 10) : ''} onChange={(e) => onChange('expected_enrollment_date', e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent" />
        </div>
      </div>
    </div>
  );
}
