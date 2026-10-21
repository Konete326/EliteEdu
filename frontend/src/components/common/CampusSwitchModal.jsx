import { Building2, Sparkles, ArrowRight } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { useToast } from '../../context/ToastContext';

const CampusSwitchModal = () => {
  const { pendingSwitch, confirmCampusSwitch, cancelCampusSwitch, activeCampus } = useCampus();
  const { showToast } = useToast();

  if (!pendingSwitch) return null;

  const currentName = activeCampus?.name || 'All Campuses';
  const targetName = pendingSwitch.name || 'All Campuses';

  const handleConfirm = () => {
    const name = confirmCampusSwitch();
    if (showToast) {
      showToast(`Switched active workspace to "${name || targetName}"`, 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-ink dark:text-white">
              Switch Active Workspace
            </h3>
            <p className="text-xs text-ink-muted">
              Scope institutional data to a specific branch
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-surface-secondary-dark/70 border border-line dark:border-line-dark space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-ink-muted">
            <span>Current Branch</span>
            <span>Target Branch</span>
          </div>
          <div className="flex items-center justify-between gap-2 text-xs font-bold text-ink dark:text-white">
            <span className="truncate max-w-[140px] px-2.5 py-1 rounded-lg bg-surface dark:bg-surface-dark border border-line dark:border-line-dark">
              {currentName}
            </span>
            <ArrowRight size={14} className="text-primary shrink-0" />
            <span className="truncate max-w-[140px] px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
              {targetName}
            </span>
          </div>
        </div>

        <p className="text-xs text-ink-muted leading-relaxed">
          Switching will update your active scope across students, classes, attendance, exams, and LMS to <strong>{targetName}</strong>.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-line dark:border-line-dark">
          <button
            type="button"
            onClick={cancelCampusSwitch}
            className="px-4 py-2 rounded-xl border border-line dark:border-line-dark text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Building2 size={13} />
            <span>Switch Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampusSwitchModal;
