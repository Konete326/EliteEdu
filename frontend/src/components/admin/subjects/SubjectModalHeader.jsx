import { X, BookOpen } from 'lucide-react';

const SubjectModalHeader = ({ mode = 'add', onClose }) => {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-ink dark:text-white">
            {mode === 'edit' ? 'Edit Subject' : 'Add Subject'}
          </h3>
          <p className="text-xs text-ink-muted">
            Set up subject details, assigned classes, and marks.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1.5 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors cursor-pointer"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SubjectModalHeader;