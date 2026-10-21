import { Clock, Award, Users, Trash2 } from 'lucide-react';

const QuizItemCard = ({ quiz, onResults, onDelete }) => (
  <div className="p-3.5 sm:p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-3">
    <div className="space-y-1.5 min-w-0 flex-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
          {quiz.grade_id?.name || 'Class'} ({quiz.section || 'A'})
        </span>
        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          {quiz.subject_id?.name || 'Subject'}
        </span>
        <span className="text-[11px] text-ink-muted flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3 text-primary" /> {quiz.duration_minutes} min
        </span>
        <span className="text-[11px] text-ink-muted flex items-center gap-1 font-mono">
          <Award className="w-3 h-3 text-amber-500" /> {quiz.max_marks} marks
        </span>
      </div>

      <h5 className="font-bold text-xs sm:text-sm text-ink dark:text-white truncate">
        {quiz.title}
      </h5>
      <p className="text-[11px] text-ink-muted">
        {quiz.quiz_questions?.length || 0} questions attached
      </p>
    </div>

    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
      <button
        type="button"
        onClick={() => onResults(quiz)}
        className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
      >
        <Users size={13} />
        <span>Results ({quiz.submissions?.length || 0})</span>
      </button>
      <button
        type="button"
        onClick={() => onDelete(quiz._id)}
        className="p-2 rounded-xl text-ink-muted hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
        title="Delete Quiz"
      >
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);

export default QuizItemCard;
