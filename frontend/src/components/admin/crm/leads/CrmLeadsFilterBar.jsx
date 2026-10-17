import React from 'react';
import { Search, QrCode, RotateCcw } from 'lucide-react';

export default function CrmLeadsFilterBar({ filters, onChange, onReset, campuses = [], grades = [], onOpenQr }) {
  return (
    <div className="bg-surface dark:bg-surface-dark p-3.5 rounded-2xl border border-line dark:border-line-dark shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
        <div className="relative sm:col-span-2">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={filters.search} onChange={(e) => onChange('search', e.target.value)} placeholder="Search by student, father, phone, email..." className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-transparent text-text-primary focus:border-primary outline-hidden" />
        </div>
        <div>
          <select value={filters.campus_id} onChange={(e) => onChange('campus_id', e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary outline-hidden">
            <option value="all">All Campuses</option>
            {campuses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <select value={filters.grade_id} onChange={(e) => onChange('grade_id', e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary outline-hidden">
            <option value="all">All Classes</option>
            {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
        </div>
        <div>
          <select value={filters.lead_status} onChange={(e) => onChange('lead_status', e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary outline-hidden">
            <option value="all">All Statuses</option>
            {['New Inquiry', 'Contacted', 'Visit Scheduled', 'Test / Interview', 'Offer Made', 'Enrolled', 'Lost'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <select value={filters.lead_source} onChange={(e) => onChange('lead_source', e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary outline-hidden">
            <option value="all">All Sources</option>
            {['Walk-in', 'Facebook', 'Website', 'WhatsApp', 'Referral', 'Banner'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-line/60 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={filters.show_converted} onChange={(e) => onChange('show_converted', e.target.checked)} className="rounded text-primary focus:ring-primary w-3.5 h-3.5 accent-primary" />
            <span className="text-text-secondary text-xs">Show Converted Leads</span>
          </label>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-text-muted">Follow-up:</span>
            {['all', 'today', 'overdue', 'upcoming'].map((f) => (
              <button key={f} type="button" onClick={() => onChange('follow_up_filter', f)} className={`px-2 py-0.5 rounded-lg capitalize text-[11px] font-medium transition-colors ${filters.follow_up_filter === f ? 'bg-primary text-white' : 'bg-surface-secondary/40 text-text-muted hover:text-text-primary'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onOpenQr} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-line dark:border-line-dark hover:bg-hover text-text-secondary text-xs cursor-pointer">
            <QrCode className="w-3.5 h-3.5" /> <span>Walk-in QR Form</span>
          </button>
          <button type="button" onClick={onReset} className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-hover cursor-pointer" title="Reset Filters">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
