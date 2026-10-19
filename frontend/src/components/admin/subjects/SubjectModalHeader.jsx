import { X, BookOpen } from 'lucide-react';

const SubjectModalHeader = ({ mode = 'add', onClose }) => {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-dark shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">
            {mode === 'edit' ? 'Edit Subject' : 'Add New Subject'}
          </h3>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
            Configure curriculum course codes, academic levels and requirements.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1.5 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors cursor-pointer"
        aria-label="Close modal"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SubjectModalHeader;
