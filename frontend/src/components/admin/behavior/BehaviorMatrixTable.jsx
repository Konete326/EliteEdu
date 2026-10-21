import { Users, Award, RotateCw } from 'lucide-react';
import BehaviorMatrixRow from './BehaviorMatrixRow';

const BehaviorMatrixTable = ({
  students = [], evaluations = {}, onChangeRating, onChangeConduct, onChangeObservation, onViewReportCard, loading
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl border border-gray-100 dark:border-gray-700 text-center space-y-3">
        <RotateCw className="w-8 h-8 text-primary animate-spin mx-auto" />
        <p className="text-xs text-gray-500 font-semibold">Loading student roster and behavior evaluations...</p>
      </div>
    );
  }

  if (!students.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl border border-gray-100 dark:border-gray-700 text-center space-y-3">
        <Users className="w-8 h-8 text-gray-400 mx-auto" />
        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">No active students found in this class/section</h4>
        <p className="text-xs text-gray-400">Please choose another grade or section from the left filter panel.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1050px]">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-750 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 font-black">
              <th className="p-3 text-center w-12">Roll</th>
              <th className="p-3 min-w-[160px]">Student Details</th>
              <th colSpan="5" className="p-2 text-center bg-blue-50/50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-l border-blue-100 dark:border-blue-800/40">
                Affective Domain (Character & Values: 1-5)
              </th>
              <th colSpan="5" className="p-2 text-center bg-purple-50/50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-l border-purple-100 dark:border-purple-800/40">
                Psychomotor Domain (Practical Skills: 1-5)
              </th>
              <th className="p-3 text-center border-l border-gray-200 dark:border-gray-700 min-w-[130px]">Conduct</th>
              <th className="p-3 border-l border-gray-200 dark:border-gray-700 min-w-[180px]">Teacher Observation</th>
              <th className="p-3 text-center border-l border-gray-200 dark:border-gray-700 w-12">Report</th>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-[10px] font-bold border-b border-gray-200 dark:border-gray-700">
              <th className="p-2 text-center" />
              <th className="p-2" />
              <th className="p-2 text-center border-l border-blue-100 dark:border-blue-800/30">Punctual</th>
              <th className="p-2 text-center border-l border-blue-100 dark:border-blue-800/30">Discipline</th>
              <th className="p-2 text-center border-l border-blue-100 dark:border-blue-800/30">Neatness</th>
              <th className="p-2 text-center border-l border-blue-100 dark:border-blue-800/30">Obedience</th>
              <th className="p-2 text-center border-l border-blue-100 dark:border-blue-800/30">Teamwork</th>
              <th className="p-2 text-center border-l border-purple-100 dark:border-purple-800/30">Writing</th>
              <th className="p-2 text-center border-l border-purple-100 dark:border-purple-800/30">Speech</th>
              <th className="p-2 text-center border-l border-purple-100 dark:border-purple-800/30">Sports</th>
              <th className="p-2 text-center border-l border-purple-100 dark:border-purple-800/30">Creativity</th>
              <th className="p-2 text-center border-l border-purple-100 dark:border-purple-800/30">Computer</th>
              <th className="p-2 border-l border-gray-200 dark:border-gray-700" />
              <th className="p-2 border-l border-gray-200 dark:border-gray-700" />
              <th className="p-2 border-l border-gray-200 dark:border-gray-700" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {students.map(({ student }) => (
              <BehaviorMatrixRow
                key={student._id}
                student={student}
                evaluation={evaluations[student._id] || {}}
                onChangeRating={(domain, key, val) => onChangeRating(student._id, domain, key, val)}
                onChangeConduct={(val) => onChangeConduct(student._id, val)}
                onChangeObservation={(val) => onChangeObservation(student._id, val)}
                onViewReportCard={onViewReportCard}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BehaviorMatrixTable;
