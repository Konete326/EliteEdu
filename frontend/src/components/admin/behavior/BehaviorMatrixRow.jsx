import { ExternalLink, User as UserIcon } from 'lucide-react';
import BehaviorRatingCell from './BehaviorRatingCell';

const CONDUCT_COLORS = {
  Exemplary: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200',
  Good: 'text-blue-700 bg-blue-50 dark:bg-blue-900/30 border-blue-200',
  Satisfactory: 'text-cyan-700 bg-cyan-50 dark:bg-cyan-900/30 border-cyan-200',
  'Needs Improvement': 'text-rose-700 bg-rose-50 dark:bg-rose-900/30 border-rose-200'
};

const BehaviorMatrixRow = ({ student, evaluation, onChangeRating, onChangeConduct, onChangeObservation, onViewReportCard }) => {
  const aff = evaluation.affective_ratings || {};
  const psy = evaluation.psychomotor_ratings || {};

  return (
    <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 border-b border-gray-100 dark:border-gray-700/60 text-xs">
      <td className="p-3 font-mono font-bold text-gray-500 w-12 text-center">
        {student.roll_number || '—'}
      </td>
      <td className="p-3 min-w-[160px]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
            {student.photo_url ? (
              <img src={student.photo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-4 h-4" />
            )}
          </div>
          <div className="truncate">
            <div className="font-bold text-gray-900 dark:text-gray-100 truncate">{student.name}</div>
            <div className="text-[10px] text-gray-400 font-mono">GR: {student.gr_number || '—'}</div>
          </div>
        </div>
      </td>

      <td className="p-2 border-l border-gray-100 dark:border-gray-700/50">
        <BehaviorRatingCell value={aff.punctuality} onChange={(v) => onChangeRating('affective', 'punctuality', v)} />
      </td>
      <td className="p-2 border-l border-gray-100 dark:border-gray-700/50">
        <BehaviorRatingCell value={aff.discipline} onChange={(v) => onChangeRating('affective', 'discipline', v)} />
      </td>
      <td className="p-2 border-l border-gray-100 dark:border-gray-700/50">
        <BehaviorRatingCell value={aff.neatness} onChange={(v) => onChangeRating('affective', 'neatness', v)} />
      </td>
      <td className="p-2 border-l border-gray-100 dark:border-gray-700/50">
        <BehaviorRatingCell value={aff.obedience} onChange={(v) => onChangeRating('affective', 'obedience', v)} />
      </td>
      <td className="p-2 border-l border-gray-100 dark:border-gray-700/50">
        <BehaviorRatingCell value={aff.teamwork} onChange={(v) => onChangeRating('affective', 'teamwork', v)} />
      </td>

      <td className="p-2 border-l border-purple-100 dark:border-purple-800/30">
        <BehaviorRatingCell value={psy.handwriting} onChange={(v) => onChangeRating('psychomotor', 'handwriting', v)} />
      </td>
      <td className="p-2 border-l border-purple-100 dark:border-purple-800/30">
        <BehaviorRatingCell value={psy.communication} onChange={(v) => onChangeRating('psychomotor', 'communication', v)} />
      </td>
      <td className="p-2 border-l border-purple-100 dark:border-purple-800/30">
        <BehaviorRatingCell value={psy.sports} onChange={(v) => onChangeRating('psychomotor', 'sports', v)} />
      </td>
      <td className="p-2 border-l border-purple-100 dark:border-purple-800/30">
        <BehaviorRatingCell value={psy.creativity} onChange={(v) => onChangeRating('psychomotor', 'creativity', v)} />
      </td>
      <td className="p-2 border-l border-purple-100 dark:border-purple-800/30">
        <BehaviorRatingCell value={psy.computer_skills} onChange={(v) => onChangeRating('psychomotor', 'computer_skills', v)} />
      </td>

      <td className="p-2 border-l border-gray-100 dark:border-gray-700/50 min-w-[130px]">
        <select
          value={evaluation.general_conduct || 'Good'}
          onChange={(e) => onChangeConduct(e.target.value)}
          className={`w-full px-2 py-1 rounded-lg text-xs font-bold border ${CONDUCT_COLORS[evaluation.general_conduct || 'Good']}`}
        >
          <option value="Exemplary">Exemplary</option>
          <option value="Good">Good</option>
          <option value="Satisfactory">Satisfactory</option>
          <option value="Needs Improvement">Needs Work</option>
        </select>
      </td>

      <td className="p-2 border-l border-gray-100 dark:border-gray-700/50 min-w-[180px]">
        <input
          type="text"
          placeholder="Character / skills remarks..."
          value={evaluation.teacher_observation || ''}
          onChange={(e) => onChangeObservation(e.target.value)}
          className="w-full px-2.5 py-1 border rounded-lg text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </td>

      <td className="p-2 text-center border-l border-gray-100 dark:border-gray-700/50">
        <button
          type="button"
          onClick={() => onViewReportCard(student._id)}
          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 transition-colors"
          title="View Student Report Card"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
};

export default BehaviorMatrixRow;
