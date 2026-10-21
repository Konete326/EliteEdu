import { BookOpen, DownloadCloud, Plus } from 'lucide-react';

const SubjectEmptyState = ({ searchQuery, onAutoLoad, onAddClick, isSeeding }) => {
  return (
    <div className="p-12 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
        <BookOpen className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-ink dark:text-white">No subjects found</h3>
        <p className="text-xs text-ink-muted max-w-sm mx-auto">
          {searchQuery ? `No subjects match "${searchQuery}".` : 'Add your first subject or load standard subjects.'}
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 pt-1">
        {!searchQuery && (
          <button
            type="button"
            onClick={onAutoLoad}
            disabled={isSeeding}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary text-primary text-xs font-semibold hover:bg-primary/10 cursor-pointer transition-colors disabled:opacity-50"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Load Standard Subjects</span>
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