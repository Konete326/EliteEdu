import { X, ShieldAlert, CheckCircle2, Calendar, FileText, Award, BookOpen, Layers, Loader2 } from 'lucide-react';

const SubjectInUseModal = ({
  isOpen,
  conflict,
  onClose,
  onInactivate,
  isLoading = false
}) => {
  if (!isOpen || !conflict) return null;

  const { subject, linked_items = {} } = conflict;

  const items = [
    { label: 'Timetable Periods', count: linked_items.timetable, icon: Calendar, color: 'text-primary' },
    { label: 'Exam Papers', count: linked_items.exams, icon: FileText, color: 'text-accent' },
    { label: 'Student Marks', count: linked_items.marks, icon: Award, color: 'text-good' },
    { label: 'Homework Tasks', count: linked_items.homework, icon: BookOpen, color: 'text-info' },
    { label: 'LMS Topics', count: linked_items.lms, icon: Layers, color: 'text-primary' }
  ].filter((item) => item.count > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />
      <div className="relative w-full max-w-md bg-surface dark:bg-[#0c0c0f] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink dark:text-white">Subject In Use</h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Cannot delete &ldquo;{subject?.name}&rdquo; ({subject?.code})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-ink-muted hover:text-ink dark:hover:text-white p-1 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-white/5 space-y-2.5">
          <p className="text-xs font-semibold text-ink dark:text-white">
            This subject is currently linked to:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {items.map((it, i) => {
              const Icon = it.icon;
              return (
                <div
                  key={i}
                  className="p-2 rounded-lg bg-surface dark:bg-[#141414] border border-line dark:border-white/5 flex items-center gap-2"
                >
                  <Icon size={14} className={it.color} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-ink dark:text-white leading-none">{it.count}</p>
                    <p className="text-[10px] text-ink-muted truncate mt-0.5">{it.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-[11px] text-ink-muted space-y-1">
          <p className="font-semibold text-primary dark:text-primary-dark">Recommended action:</p>
          <p>
            Deleting will break past student marks and timetables. Mark this subject as <strong>Inactive</strong> instead.
            It will be hidden from new selections while keeping all historical records intact.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-semibold text-ink-muted hover:bg-surface-secondary transition-all disabled:opacity-40 cursor-pointer"
          >
            Keep Active
          </button>
          <button
            type="button"
            onClick={onInactivate}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-good hover:bg-good/90 text-white text-xs font-bold transition-all shadow-sm shadow-good/25 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Set to Inactive</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectInUseModal;
