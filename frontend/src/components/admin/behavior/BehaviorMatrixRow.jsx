import { ExternalLink, User as UserIcon } from 'lucide-react';
import BehaviorRatingCell from './BehaviorRatingCell';

const CONDUCT_COLORS = {
  Exemplary: 'text-emerald-700 bg-emerald-500/10 dark:text-emerald-300 border-emerald-500/30',
  Good: 'text-primary bg-primary-soft/60 dark:text-primary-dark border-primary/30',
  Satisfactory: 'text-cyan-700 bg-cyan-500/10 dark:text-cyan-300 border-cyan-500/30',
  'Needs Improvement': 'text-rose-700 bg-rose-500/10 dark:text-rose-300 border-rose-500/30'
};

const BehaviorMatrixRow = ({
  student,
  evaluation,
  domainView = 'all',
  onChangeRating,
  onChangeConduct,
  onChangeObservation,
  onQuickRateStudent,
  onViewReportCard
}) => {
  const aff = evaluation.affective_ratings || {};
  const psy = evaluation.psychomotor_ratings || {};
  const showAffective = domainView === 'all' || domainView === 'affective';
  const showPsychomotor = domainView === 'all' || domainView === 'psychomotor';

  return (
    <tr className="hover:bg-surface-secondary/70 dark:hover:bg-surface-secondary-dark/70 border-b border-line/60 dark:border-line-dark/60 text-xs transition-colors">
      <td className="p-2 font-mono font-bold text-ink-muted dark:text-ink-muted-dark w-10 text-center">
        {student.roll_number || '—'}
      </td>

      <td className="p-2 min-w-[140px] max-w-[180px]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted dark:text-ink-muted-dark flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-line/60 dark:border-line-dark/60">
            {student.photo_url ? (
              <img src={student.photo_url} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-3.5 h-3.5" />
            )}
          </div>
          <div className="truncate">
            <div className="font-bold text-ink dark:text-ink-dark truncate">{student.name}</div>
            <div className="text-[10px] text-ink-muted dark:text-ink-muted-dark font-mono">GR: {student.gr_number || '—'}</div>
          </div>
        </div>
      </td>

      <td className="p-1.5 border-l border-line/60 dark:border-line-dark/60 w-24">
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              onQuickRateStudent(student._id, Number(e.target.value));
              e.target.value = '';
            }
          }}
          className="w-full text-[10px] font-bold px-1.5 py-1 rounded-lg border border-line dark:border-line-dark bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted dark:text-ink-muted-dark hover:text-ink focus:outline-none cursor-pointer"
        >
          <option value="" disabled>⚡ Quick Set</option>
          <option value="5">All 5 ★</option>
          <option value="4">All 4 ★</option>
          <option value="3">All 3 ★</option>
          <option value="2">All 2 ★</option>
          <option value="1">All 1 ★</option>
        </select>
      </td>

      {showAffective && (
        <>
          <td className="p-1 border-l border-line/60 dark:border-line-dark/60 w-14">
            <BehaviorRatingCell value={aff.punctuality} onChange={(v) => onChangeRating('affective', 'punctuality', v)} />
          </td>
          <td className="p-1 border-l border-line/60 dark:border-line-dark/60 w-14">
            <BehaviorRatingCell value={aff.discipline} onChange={(v) => onChangeRating('affective', 'discipline', v)} />
          </td>
          <td className="p-1 border-l border-line/60 dark:border-line-dark/60 w-14">
            <BehaviorRatingCell value={aff.neatness} onChange={(v) => onChangeRating('affective', 'neatness', v)} />
          </td>
          <td className="p-1 border-l border-line/60 dark:border-line-dark/60 w-14">
            <BehaviorRatingCell value={aff.obedience} onChange={(v) => onChangeRating('affective', 'obedience', v)} />
          </td>
          <td className="p-1 border-l border-line/60 dark:border-line-dark/60 w-14">
            <BehaviorRatingCell value={aff.teamwork} onChange={(v) => onChangeRating('affective', 'teamwork', v)} />
          </td>
        </>
      )}

      {showPsychomotor && (
        <>
          <td className="p-1 border-l border-accent/20 dark:border-accent/15 w-14">
            <BehaviorRatingCell value={psy.handwriting} onChange={(v) => onChangeRating('psychomotor', 'handwriting', v)} />
          </td>
          <td className="p-1 border-l border-accent/20 dark:border-accent/15 w-14">
            <BehaviorRatingCell value={psy.communication} onChange={(v) => onChangeRating('psychomotor', 'communication', v)} />
          </td>
          <td className="p-1 border-l border-accent/20 dark:border-accent/15 w-14">
            <BehaviorRatingCell value={psy.sports} onChange={(v) => onChangeRating('psychomotor', 'sports', v)} />
          </td>
          <td className="p-1 border-l border-accent/20 dark:border-accent/15 w-14">
            <BehaviorRatingCell value={psy.creativity} onChange={(v) => onChangeRating('psychomotor', 'creativity', v)} />
          </td>
          <td className="p-1 border-l border-accent/20 dark:border-accent/15 w-14">
            <BehaviorRatingCell value={psy.computer_skills} onChange={(v) => onChangeRating('psychomotor', 'computer_skills', v)} />
          </td>
        </>
      )}

      <td className="p-1.5 border-l border-line/60 dark:border-line-dark/60 min-w-[115px]">
        <select
          value={evaluation.general_conduct || 'Good'}
          onChange={(e) => onChangeConduct(e.target.value)}
          className={`w-full px-2 py-1 rounded-lg text-xs font-bold border ${CONDUCT_COLORS[evaluation.general_conduct || 'Good']} bg-surface dark:bg-surface-dark focus:ring-1 focus:ring-primary focus:outline-none transition-colors`}
        >
          <option value="Exemplary">Exemplary</option>
          <option value="Good">Good</option>
          <option value="Satisfactory">Satisfactory</option>
          <option value="Needs Improvement">Needs Work</option>
        </select>
      </td>

      <td className="p-1.5 border-l border-line/60 dark:border-line-dark/60 min-w-[150px]">
        <input
          type="text"
          placeholder="Remarks..."
          value={evaluation.teacher_observation || ''}
          onChange={(e) => onChangeObservation(e.target.value)}
          className="w-full px-2.5 py-1 border border-line dark:border-line-dark rounded-lg text-xs bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark placeholder:text-ink-muted/50 focus:border-primary focus:outline-none transition-colors"
        />
      </td>

      <td className="p-1.5 text-center border-l border-line/60 dark:border-line-dark/60 w-10">
        <button
          type="button"
          onClick={() => onViewReportCard(student._id)}
          className="p-1.5 rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark border border-line/60 dark:border-line-dark/60 hover:bg-primary-soft hover:text-primary dark:hover:text-primary-dark text-ink-muted dark:text-ink-muted-dark transition-colors"
          title="View Student Report Card"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
};

export default BehaviorMatrixRow;
