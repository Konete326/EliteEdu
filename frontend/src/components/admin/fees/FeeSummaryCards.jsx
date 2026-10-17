import { DollarSign, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

const FeeSummaryCards = ({ summary }) => {
  const s = summary || {};
  const totalCollected = Number(s.total_collected || 0);
  const projectedRevenue = Number(s.projected_revenue || 0);
  const paidCount = Number(s.paid_students_count || 0);
  const defaultersCount = Number(s.defaulters_count || 0);
  const totalStudents = Number(s.total_students || 0);

  const collectionRate = projectedRevenue > 0 ? Math.round((totalCollected / projectedRevenue) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Total Collections</span>
          <div className="w-8 h-8 rounded-xl bg-good/10 text-good flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <p className="mt-2 text-xl font-black text-ink dark:text-ink-dark">Rs. {totalCollected.toLocaleString()}</p>
        <p className="mt-1 text-[11px] text-good font-medium flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> {collectionRate}% of projected target
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Paid Students</span>
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <p className="mt-2 text-xl font-black text-ink dark:text-ink-dark">{paidCount}</p>
        <p className="mt-1 text-[11px] text-ink-muted font-medium">Out of {totalStudents} active students</p>
      </div>

      <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Defaulters / Pending</span>
          <div className="w-8 h-8 rounded-xl bg-bad/10 text-bad flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <p className="mt-2 text-xl font-black text-bad">{defaultersCount}</p>
        <p className="mt-1 text-[11px] text-bad font-medium">Pending fee clearance</p>
      </div>

      <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Projected Revenue</span>
          <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <p className="mt-2 text-xl font-black text-ink dark:text-ink-dark">Rs. {projectedRevenue.toLocaleString()}</p>
        <p className="mt-1 text-[11px] text-ink-muted font-medium">Base fee minus discounts</p>
      </div>
    </div>
  );
};

export default FeeSummaryCards;
