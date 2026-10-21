import { Save, Loader2, Award } from 'lucide-react';

const HomeworkSubmissionsFooter = ({
  saving,
  syncToClassTest,
  onToggleSync,
  onSave,
  onClose
}) => (
  <div className="p-3.5 sm:p-4 border-t border-line dark:border-line-dark flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40">
    <label className="flex items-center gap-2 text-xs font-semibold text-ink dark:text-white cursor-pointer select-none">
      <input
        type="checkbox"
        checked={syncToClassTest}
        onChange={(e) => onToggleSync(e.target.checked)}
        className="w-4 h-4 rounded border-line text-primary focus:ring-primary cursor-pointer accent-primary"
      />
      <Award className="w-4 h-4 text-primary" />
      <span>Sync Grades to Class Tests Register</span>
    </label>

    <div className="flex items-center gap-2 justify-end">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-xs font-bold text-ink-muted hover:text-ink hover:bg-surface-secondary rounded-xl transition-colors cursor-pointer"
      >
        Close
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        <span>Save Grades</span>
      </button>
    </div>
  </div>
);

export default HomeworkSubmissionsFooter;
