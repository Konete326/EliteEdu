import { CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ROUTES_MAP = {
  students: '/admin/students',
  teachers: '/admin/teachers',
  crm_leads: '/admin/crm/leads',
  questions: '/admin/exams/question-papers',
  store_items: '/admin/store'
};

const BulkImportResultsModal = ({ isOpen, onClose, entityType, insertedCount, onReset }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const targetPath = ROUTES_MAP[entityType] || '/admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-surface dark:bg-[#121212] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-extrabold text-base text-ink dark:text-ink-dark">Bulk Import Complete!</h3>
          <p className="text-xs text-ink-muted mt-1">
            Successfully committed <strong className="text-emerald-600">{insertedCount}</strong> {entityType.replace(/_/g, ' ')} into the system.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-line text-xs font-bold text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Import Another</span>
          </button>
          <button
            type="button"
            onClick={() => { onClose(); navigate(targetPath); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            <span>View Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkImportResultsModal;
