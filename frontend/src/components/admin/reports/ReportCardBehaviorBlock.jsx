import { Award, Star } from 'lucide-react';

const BADGE_MAP = {
  Merit_Star: { label: 'Merit Star Award', bg: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
  Good_Conduct: { label: 'Good Conduct', bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' },
  Needs_Counseling: { label: 'Guidance & Counseling', bg: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30' },
  Disciplinary_Warning: { label: 'Conduct Advisory', bg: 'bg-rose-500/10 text-rose-600 border-rose-500/30' }
};

const ReportCardBehaviorBlock = ({ behaviorRecord }) => {
  if (!behaviorRecord) return null;
  const badge = BADGE_MAP[behaviorRecord.badge_type] || BADGE_MAP.Good_Conduct;
  const affective = behaviorRecord.affective_ratings || {};
  const psychomotor = behaviorRecord.psychomotor_ratings || {};

  return (
    <div className="p-3 rounded-2xl border border-line bg-surface space-y-2 text-xs">
      <div className="flex items-center justify-between border-b border-line pb-1.5">
        <div className="flex items-center gap-1.5 font-black uppercase text-[11px] text-ink-muted tracking-wider">
          <Award className="w-4 h-4 text-primary" />
          <span>Holistic Behavior & Skills Evaluation (Affective & Psychomotor Domains)</span>
        </div>
        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${badge.bg}`}>
          {badge.label}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-ink">
        <div className="p-2 rounded-xl bg-surface-secondary/40 border border-line/60">
          <span className="text-[10px] font-bold text-ink-muted uppercase block mb-1">Affective Domain (Character & Values: 1-5)</span>
          <div className="grid grid-cols-5 gap-1 text-center font-bold text-[10px]">
            <div><span className="text-[9px] text-ink-muted block">Punctual</span><span className="text-primary">{affective.punctuality ?? 5}/5</span></div>
            <div><span className="text-[9px] text-ink-muted block">Discipline</span><span className="text-primary">{affective.discipline ?? 5}/5</span></div>
            <div><span className="text-[9px] text-ink-muted block">Neatness</span><span className="text-primary">{affective.neatness ?? 5}/5</span></div>
            <div><span className="text-[9px] text-ink-muted block">Honesty</span><span className="text-primary">{affective.honesty ?? 5}/5</span></div>
            <div><span className="text-[9px] text-ink-muted block">Cooperation</span><span className="text-primary">{affective.cooperation ?? 5}/5</span></div>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-surface-secondary/40 border border-line/60">
          <span className="text-[10px] font-bold text-ink-muted uppercase block mb-1">Psychomotor Domain (Practical Skills: 1-5)</span>
          <div className="grid grid-cols-5 gap-1 text-center font-bold text-[10px]">
            <div><span className="text-[9px] text-ink-muted block">Handwriting</span><span className="text-good">{psychomotor.handwriting ?? 5}/5</span></div>
            <div><span className="text-[9px] text-ink-muted block">Speaking</span><span className="text-good">{psychomotor.communication ?? 5}/5</span></div>
            <div><span className="text-[9px] text-ink-muted block">Sports</span><span className="text-good">{psychomotor.sports_games ?? 5}/5</span></div>
            <div><span className="text-[9px] text-ink-muted block">Creativity</span><span className="text-good">{psychomotor.creativity_arts ?? 5}/5</span></div>
            <div><span className="text-[9px] text-ink-muted block">Lab Skills</span><span className="text-good">{psychomotor.lab_practical ?? 5}/5</span></div>
          </div>
        </div>
      </div>

      {behaviorRecord.teacher_observation && (
        <div className="text-[10px] italic text-ink-muted px-1 flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-500 shrink-0" />
          <span>Faculty Character Note: &quot;{behaviorRecord.teacher_observation}&quot;</span>
        </div>
      )}
    </div>
  );
};

export default ReportCardBehaviorBlock;
