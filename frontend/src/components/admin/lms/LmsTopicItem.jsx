import { CheckCircle2, Trash2, BookOpen } from 'lucide-react';

const LmsTopicItem = ({ topic, onToggleStatus, onDelete }) => {
  const isDone = topic.status === 'Completed';

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => onToggleStatus(topic)}
          className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
            isDone
              ? 'bg-emerald-500 text-white shadow-2xs'
              : 'bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted hover:text-ink border border-line dark:border-line-dark'
          }`}
          title={isDone ? 'Mark as In Progress' : 'Mark as Completed'}
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>

        <div className="min-w-0">
          <h5
            className={`text-xs sm:text-sm font-bold truncate ${
              isDone
                ? 'line-through text-ink-muted dark:text-ink-muted'
                : 'text-ink dark:text-white'
            }`}
          >
            {topic.title}
          </h5>
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-ink-muted">
            <span className="flex items-center gap-1">
              <BookOpen size={11} className="text-primary" />
              <span>{topic.chapter_id?.title ? `Ch: ${topic.chapter_id.title}` : 'General Curriculum Topic'}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
            isDone
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
          }`}
        >
          {isDone ? 'Completed' : 'In Progress'}
        </span>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(topic._id)}
            className="p-1.5 rounded-lg text-ink-muted hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Delete Topic"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LmsTopicItem;
