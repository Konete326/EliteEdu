import { Clock, Award, Users, Trash2 } from 'lucide-react';

const QuizItemCard = ({ quiz, onResults, onDelete }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
    <div className="space-y-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-900/30">
          {quiz.grade_id?.name} ({quiz.section})
        </span>
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30">
          {quiz.subject_id?.name}
        </span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> {quiz.duration_minutes} min
        </span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Award className="w-3.5 h-3.5" /> {quiz.max_marks} marks
        </span>
      </div>
      <h5 className="font-bold text-gray-900 dark:text-gray-100">{quiz.title}</h5>
      <p className="text-xs text-gray-500">{quiz.quiz_questions?.length || 0} questions attached</p>
    </div>
    <div className="flex items-center gap-2 self-end md:self-center">
      <button
        onClick={() => onResults(quiz)}
        className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 text-purple-600 dark:text-purple-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
      >
        <Users className="w-3.5 h-3.5" /> Results ({quiz.submissions?.length || 0})
      </button>
      <button onClick={() => onDelete(quiz._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default QuizItemCard;
