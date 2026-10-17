import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Settings, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CrmLeadsHeader({ badges = { totalLeads: 0, convertedLeads: 0 }, onOpenSettings }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-line dark:border-line-dark">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-text-primary-dark tracking-tight">
            Leads
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3 h-3" /> Inquiries Hub
          </span>
        </div>
        <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">
          Manage prospective student inquiries, track admissions pipeline, and follow-ups.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-2 bg-surface-secondary/40 dark:bg-surface-dark px-3 py-1.5 rounded-xl border border-line dark:border-line-dark text-xs">
          <span className="text-text-muted">Total Leads:</span>
          <span className="font-bold text-text-primary dark:text-text-primary-dark">{badges.totalLeads || 0}</span>
          <span className="text-line dark:text-line-dark">|</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Converted: {badges.convertedLeads || 0}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-line dark:border-line-dark bg-surface dark:bg-surface-dark hover:bg-hover text-text-secondary cursor-pointer transition-colors"
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
