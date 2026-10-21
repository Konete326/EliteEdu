import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Settings, CheckCircle2, Users } from 'lucide-react';

export default function CrmLeadsHeader({ badges = { totalLeads: 0, convertedLeads: 0 }, onOpenSettings }) {
  const navigate = useNavigate();

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">
              Admissions CRM &amp; Leads
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
              <UserPlus className="w-3 h-3" /> Inquiries Hub
            </span>
          </div>
          <p className="text-xs font-semibold text-ink-muted">
            Manage prospective student inquiries, track admissions pipeline, and follow-ups
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-2 bg-surface-secondary/40 dark:bg-surface-dark px-3 py-1.5 rounded-xl border border-line dark:border-line-dark text-xs">
          <span className="text-ink-muted">Total Leads:</span>
          <span className="font-bold text-ink dark:text-ink-dark">{badges.totalLeads || 0}</span>
          <span className="text-line dark:text-line-dark">|</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Converted: {badges.convertedLeads || 0}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-line dark:border-line-dark bg-surface dark:bg-surface-dark hover:bg-hover text-ink-muted hover:text-ink cursor-pointer transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/admin/crm/inquiries/new')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow-xs cursor-pointer transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ New Lead</span>
        </button>
      </div>
    </div>
  );
}
