import React from 'react';
import CrmPipelineCard from './CrmPipelineCard';
import { Layers } from 'lucide-react';

const STAGES = [
  { id: 'New Inquiry', label: 'New Inquiries', color: 'border-t-blue-500' },
  { id: 'Contacted', label: 'Contacted', color: 'border-t-amber-500' },
  { id: 'Visit Scheduled', label: 'Visit Scheduled', color: 'border-t-purple-500' },
  { id: 'Test / Interview', label: 'Test / Interview', color: 'border-t-indigo-500' },
  { id: 'Offer Made', label: 'Offer Made', color: 'border-t-teal-500' },
  { id: 'Enrolled', label: 'Enrolled / Converted', color: 'border-t-emerald-500' },
  { id: 'Lost', label: 'Lost / Discontinued', color: 'border-t-rose-500' }
];

export default function CrmPipelineBoard({ leads = [], onMoveStage, onConvert }) {
  return (
    <div className="w-full h-[calc(100vh-220px)] min-h-[480px] flex gap-4 overflow-x-auto pb-2 pt-1 items-stretch">
      {STAGES.map(({ id, label, color }) => {
        const columnLeads = leads.filter((l) => l.lead_status === id);
        return (
          <div
            key={id}
            className={`w-72 shrink-0 rounded-2xl border border-line dark:border-line-dark bg-surface-secondary/20 dark:bg-slate-900/40 p-3.5 flex flex-col border-t-4 ${color}`}
          >
            <div className="flex items-center justify-between pb-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-text-muted" />
                <h3 className="font-bold text-xs text-text-primary dark:text-text-primary-dark">{label}</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-text-primary">
                {columnLeads.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-3">
              {columnLeads.length === 0 ? (
                <div className="py-8 text-center text-[11px] text-text-muted border border-dashed border-line dark:border-line-dark rounded-xl">
                  No leads in this stage
                </div>
              ) : (
                columnLeads.map((lead) => (
                  <CrmPipelineCard
                    key={lead._id}
                    lead={lead}
                    onMoveStage={onMoveStage}
                    onConvert={onConvert}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
