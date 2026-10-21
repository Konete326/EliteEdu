import { useState } from 'react';
import { Search } from 'lucide-react';

const QuizQuestionsSelector = ({ questions = [], selected = [], onToggle }) => {
  const [filter, setFilter] = useState('');

  if (questions.length === 0) {
    return (
      <div className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink-muted text-xs text-center">
        No questions found in question bank for this subject. Questions can be added later or evaluated manually.
      </div>
    );
  }

  const filtered = questions.filter((q) =>
    (q.question_text || '').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-3.5 rounded-2xl border border-line dark:border-line-dark bg-surface-secondary/40 dark:bg-surface-secondary-dark/40 space-y-2.5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-bold text-ink dark:text-white">
          Question Bank ({selected.length} Selected):
        </span>
        <div className="relative flex-1 max-w-xs">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search questions..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-7 pr-2.5 py-1 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs text-ink dark:text-white outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
        {filtered.map((q) => {
          const isSelected = selected.some((sq) => sq._id === q._id);
          return (
            <label
              key={q._id}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-colors text-xs ${
                isSelected
                  ? 'bg-primary/10 border-primary/30 text-ink dark:text-white font-semibold'
                  : 'bg-surface dark:bg-surface-dark border-line dark:border-line-dark text-ink-muted hover:text-ink'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => onToggle(q, e.target.checked)}
                  className="rounded border-line text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
                />
                <span className="truncate">{q.question_text}</span>
              </div>
              <span className="text-[10px] font-mono text-ink-muted shrink-0">
                {q.marks || 1} mark
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default QuizQuestionsSelector;
