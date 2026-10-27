import { Star, ShieldCheck, Sparkles, AlertCircle, MessageSquarePlus } from 'lucide-react';

const CONDUCT_STYLES = {
  Exemplary: {
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: Sparkles,
    label: 'Exemplary'
  },
  Good: {
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    icon: ShieldCheck,
    label: 'Good'
  },
  Satisfactory: {
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    icon: Star,
    label: 'Satisfactory'
  },
  'Needs Improvement': {
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    icon: AlertCircle,
    label: 'Needs Attention'
  }
};

const calculateAverageStars = (evaluation) => {
  if (!evaluation) return 5;
  const aff = Object.values(evaluation.affective_ratings || {});
  const psy = Object.values(evaluation.psychomotor_ratings || {});
  const all = [...aff, ...psy].filter((v) => typeof v === 'number' && !isNaN(v));
  if (!all.length) return 5;
  const sum = all.reduce((acc, curr) => acc + curr, 0);
  return (sum / all.length).toFixed(1);
};

export default function BehaviorStudentCard({
  student,
  evaluation,
  onQuickRate,
  onOpenModal
}) {
  const conduct = evaluation?.general_conduct || 'Good';
  const style = CONDUCT_STYLES[conduct] || CONDUCT_STYLES.Good;
  const ConductIcon = style.icon;
  const avgStars = Number(calculateAverageStars(evaluation));
  const fullStars = Math.round(avgStars);
  const observation = evaluation?.teacher_observation?.trim();

  return (
    <div className="rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-3.5 shadow-2xs hover:shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between gap-3 group">
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {student.photo_url ? (
              <img
                src={student.photo_url}
                alt={student.name}
                className="w-10 h-10 rounded-xl object-cover border border-line dark:border-line-dark shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-black text-sm flex items-center justify-center border border-primary/20 shrink-0">
                {(student.name || 'S').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-ink dark:text-ink-dark truncate group-hover:text-primary transition-colors">
                {student.name}
              </h4>
              <p className="text-[11px] text-ink-muted truncate font-medium">
                Roll #{student.roll_number || 'N/A'} • Sec {student.current_section || 'A'}
              </p>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${style.badge}`}>
            <ConductIcon size={11} />
            <span>{style.label}</span>
          </span>
        </div>

        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-surface-secondary/50 dark:bg-white/5 border border-line/60 dark:border-line-dark/60 text-xs">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={12}
                className={s <= fullStars ? 'text-amber-400 fill-amber-400' : 'text-line-dark dark:text-white/20'}
              />
            ))}
            <span className="text-[11px] font-bold text-ink dark:text-ink-dark ml-1">{avgStars} / 5</span>
          </div>
          <span className="text-[10px] font-bold text-ink-muted">GR: {student.gr_number || 'N/A'}</span>
        </div>

        <div className="min-h-[28px] flex items-center">
          {observation ? (
            <p className="text-[11px] text-ink-muted line-clamp-2 italic leading-tight">
              "{observation}"
            </p>
          ) : (
            <p className="text-[11px] text-ink-muted/50 italic leading-tight">
              No specific remarks yet. Tap below to add feedback.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 pt-1 border-t border-line/60 dark:border-line-dark/60">
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Quick Rate:</span>
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => onQuickRate(student._id, 5, 'Exemplary')}
              title="Quick Rate 5★ Exemplary"
              className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
            >
              5★
            </button>
            <button
              type="button"
              onClick={() => onQuickRate(student._id, 4, 'Good')}
              title="Quick Rate 4★ Good"
              className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
            >
              4★
            </button>
            <button
              type="button"
              onClick={() => onQuickRate(student._id, 3, 'Satisfactory')}
              title="Quick Rate 3★ Satisfactory"
              className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition-colors cursor-pointer"
            >
              3★
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenModal(student, evaluation)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-secondary dark:bg-white/5 hover:bg-primary hover:text-white border border-line dark:border-line-dark text-xs font-bold text-ink dark:text-ink-dark transition-all cursor-pointer shadow-2xs group/btn"
        >
          <MessageSquarePlus size={13} className="text-primary group-hover/btn:text-white transition-colors" />
          <span>Feedback &amp; Stars</span>
        </button>
      </div>
    </div>
  );
}
