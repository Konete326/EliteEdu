import { Save, Loader2, Award } from 'lucide-react';

const HomeworkSubmissionsFooter = ({
  saving,
  syncToClassTest,
  onToggleSync,
  onSave,
  onClose
}) => (
  <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50 dark:bg-gray-700/30">
    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={syncToClassTest}
        onChange={(e) => onToggleSync(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
      <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      <span>Sync Grades to Class Tests Register</span>
    </label>

    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
      >
        Close
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 shadow-sm shadow-blue-500/20 cursor-pointer disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        <span>Save Grades</span>
      </button>
    </div>
  </div>
);

export default HomeworkSubmissionsFooter;
