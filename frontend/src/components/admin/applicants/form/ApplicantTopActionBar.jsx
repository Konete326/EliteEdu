import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const ApplicantTopActionBar = ({ isEditMode, applicantName, onSave, submitting }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs transition-all">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/staff-applicants"
          className="w-9 h-9 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#141414] flex items-center justify-center text-ink-muted hover:text-ink dark:hover:text-ink-dark transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-ink dark:text-ink-dark tracking-tight">
            {isEditMode ? `Edit Applicant: ${applicantName || 'Applicant'}` : 'New Applicant'}
          </h1>
        </div>
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={submitting}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e1b4b] hover:bg-[#2e2a72] dark:bg-primary dark:hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
      >
        {submitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        <span>{submitting ? 'Saving...' : 'Save'}</span>
      </button>
    </div>
  );
};

export default ApplicantTopActionBar;
