import { BookOpen, Sparkles, Plus } from 'lucide-react';

const SubjectEmptyState = ({ searchQuery, onAutoLoad, onAddClick, isSeeding }) => {
  return (
    <div className="p-12 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-dark mx-auto">
        <BookOpen className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-ink dark:text-ink-dark">No subjects found</h3>
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark max-w-sm mx-auto">
          {searchQuery ? `No subjects matched "${searchQuery}".` : 'Start by auto-loading standard curriculum courses or create one manually.'}
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 pt-1">
        {!searchQuery && (
          <button
            type="button"
            onClick={onAutoLoad}
            disabled={isSeeding}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary text-primary text-xs font-semibold hover:bg-primary-soft cursor-pointer transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Load Standard</span>
          </button>
        )}
        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Subject</span>
        </button>
      </div>
    </div>
  );
};

export default SubjectEmptyState;
