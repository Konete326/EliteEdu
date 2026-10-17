import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, RefreshCw, RotateCcw, Building2, Layers, BookOpen, Users, UserCheck } from 'lucide-react';

export default function WizardPrerequisiteCard({ prerequisites, isLoading, onRefresh, onResetDraft, draftSavedAt }) {
  const counts = prerequisites?.counts || {};
  const items = [
    { label: 'Campuses', count: counts.campuses ?? 0, addUrl: '/admin/general-settings/campus', icon: Building2 },
    { label: 'Classes / Grades', count: counts.grades ?? 0, addUrl: '/admin/academic-setup/classes', icon: Layers },
    { label: 'Subjects', count: counts.subjects ?? 0, addUrl: '/admin/academic-setup/subjects', icon: BookOpen },
    { label: 'Teachers', count: counts.teachers ?? 0, addUrl: '/admin/teachers/all', icon: Users },
    { label: 'Active Students', count: counts.students ?? 0, addUrl: '/admin/students/admission', icon: UserCheck }
  ];

  const hasMissing = items.some((i) => i.count === 0);

  return (
    <div className="p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">Prerequisite Guard</h4>
          <p className="text-[11px] text-text-muted dark:text-text-muted-dark">Live readiness health check</p>
        </div>
        <button type="button" onClick={onRefresh} disabled={isLoading} className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-hover dark:hover:bg-hover-dark text-text-muted hover:text-text-primary transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {hasMissing && (
        <div className="p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium leading-relaxed">
            Some prerequisites have 0 records. Add them below — your draft is automatically preserved!
          </p>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isReady = item.count > 0;
          return (
            <div key={item.label} className="flex items-center justify-between p-2 rounded-xl bg-muted/20 border border-line/40 dark:border-line-dark/40">
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${isReady ? 'text-text-muted' : 'text-amber-500'}`} />
                <span className="text-xs font-semibold text-text-primary dark:text-text-primary-dark">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isReady ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                  {item.count}
                </span>
                {!isReady && (
                  <Link to={item.addUrl} className="text-[11px] font-bold text-primary hover:underline">
                    + Add
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-line dark:border-line-dark flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-text-muted dark:text-text-muted-dark">
          <span>Draft Auto-Save</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {draftSavedAt ? new Date(draftSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active'}
          </span>
        </div>
        <button type="button" onClick={onResetDraft} className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-semibold rounded-lg border border-line dark:border-line-dark hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/20 text-text-muted hover:text-red-500 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Reset Form Draft
        </button>
      </div>
    </div>
  );
}
