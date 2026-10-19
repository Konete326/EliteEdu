import { Award, Star, AlertTriangle } from 'lucide-react';

const TERMS = ['First Term', 'Mid Term', 'Final Term', 'Annual'];

const BehaviorHeader = ({ activeTerm, onTermChange, stats = {} }) => {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">Affective & Psychomotor Behavior Studio</h1>
          <p className="text-xs font-semibold text-ink-muted">Student character development, behavioral badges, psychomotor skills and official certificates</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line bg-surface-secondary/40 text-xs font-bold">
          <span className="text-ink-muted">Term:</span>
          <select
            value={activeTerm}
            onChange={(e) => onTermChange(e.target.value)}
            className="bg-transparent font-bold outline-none text-ink cursor-pointer"
          >
            {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs">
          <span className="text-[10px] uppercase font-bold text-primary block">Evaluations</span>
          <span className="font-black text-primary">{stats.totalEvaluated || 0} Students</span>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-600 block">Merit Stars</span>
            <span className="font-black text-amber-700 dark:text-amber-400">{stats.meritStars || 0}</span>
          </div>
        </div>

        {Number(stats.warnings || 0) > 0 && (
          <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-600 block">Warnings</span>
              <span className="font-black text-rose-700 dark:text-rose-400">{stats.warnings}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BehaviorHeader;
