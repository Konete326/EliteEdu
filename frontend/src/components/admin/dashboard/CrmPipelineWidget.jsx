import { Target, ChevronRight } from 'lucide-react';

const CrmPipelineWidget = ({ crmPipeline }) => {
  const crm = crmPipeline || { totalLeads: 0, converted: 0, conversionRate: '0%', stages: [] };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
          <Target className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">CRM</h3>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mb-4 p-2.5 rounded-xl bg-surface-secondary dark:bg-surface-dark border border-line dark:border-line-dark">
        <div>
          <p className="text-base font-black text-ink dark:text-ink-dark">{crm.totalLeads}</p>
          <p className="text-[10px] text-ink-muted font-medium">Total Leads</p>
        </div>
        <div>
          <p className="text-base font-black text-emerald-600">{crm.converted}</p>
          <p className="text-[10px] text-ink-muted font-medium">Converted</p>
        </div>
        <div>
          <p className="text-base font-black text-primary">{crm.conversionRate}</p>
          <p className="text-[10px] text-ink-muted font-medium">Won</p>
        </div>
      </div>

      <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2">Pipeline</p>
      {crm.stages && crm.stages.length > 0 ? (
        <div className="space-y-1.5">
          {crm.stages.map((stage, idx) => (
            <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-secondary text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color || '#3b82f6' }} />
                <span className="font-medium text-ink dark:text-ink-dark">{stage.name}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-ink dark:text-ink-dark">
                <span>{stage.count}</span>
                <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-[10px] text-ink-muted py-2">No active pipeline leads</p>
      )}
    </div>
  );
};

export default CrmPipelineWidget;
