import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const StudentTopActionBar = ({ isEditMode, studentName, onSave, submitting }) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface/95 dark:bg-[#0c0c0c]/95 backdrop-blur-md border border-line dark:border-white/10 shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/admin/students')}
          className="p-2 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base font-bold text-ink dark:text-ink-dark">
            {isEditMode ? `Edit Student: ${studentName || ''}` : 'Enroll New Student'}
          </h2>
          <p className="text-xs text-ink-muted">
            Institutional student admission, family history, and curriculum profile.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => navigate('/admin/students')}
          className="px-4 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-semibold hover:bg-surface-secondary text-ink-sub transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={submitting}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Update Student' : 'Save & Enroll'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StudentTopActionBar;
