import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherTopActionBar = ({ isEditMode, staffName, schoolType, onSave, submitting }) => {
  return (
    <div className="sticky top-0 z-20 bg-bg/95 dark:bg-bg-dark/95 backdrop-blur-sm pb-4 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line dark:border-line-dark -mt-1">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/teachers"
          className="p-2 rounded-xl border border-line dark:border-line-dark text-ink-muted hover:text-ink hover:bg-surface-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-ink dark:text-ink-dark">
              {isEditMode ? `Edit Staff: ${staffName || ''}` : 'Add Staff'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              {schoolType || 'Private'}
            </span>
          </div>
          <p className="text-xs text-ink-muted">
            Institutional staff onboarding, service record, permissions and class assignments.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/admin/teachers"
          className="px-4 py-2 rounded-xl border border-line dark:border-line-dark text-xs font-semibold text-ink-muted hover:text-ink hover:bg-surface-secondary"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={onSave}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? 'Saving...' : isEditMode ? 'Update Staff' : 'Save Staff'}</span>
        </button>
      </div>
    </div>
  );
};

export default TeacherTopActionBar;
