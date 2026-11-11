const ACTIONS = ['view', 'add', 'edit', 'delete', 'filter', 'reports'];

const COMING_SOON_KEYS = new Set([
  'fees',
  'accounts',
  'store_pos',
  'payroll',
  'lms',
  'homework',
  'lectures',
  'quizzes',
  'online_classes',
  'exams',
  'class_tests',
  'question_papers',
  'grading_policies',
  'report_cards',
  'exam_reports',
  'transport',
  'van_management',
  'crm',
  'crm_inquiries',
  'crm_pipeline',
  'crm_followups',
  'crm_analytics',
  'student_promotion',
  'admission_letter',
  'behavior',
  'behavior_skills',
  'bulk_migration',
  'student_portal'
]);

const RolePermissionsTable = ({ permissions, toggleAction, toggleAllForModule, toggleGlobalAll }) => {
  const activePermissions = permissions.filter((p) => !COMING_SOON_KEYS.has(p.module_key));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-bold text-ink dark:text-ink-dark uppercase text-[11px] tracking-wider">
          Active Modules Permissions Matrix
        </span>
        <button
          type="button"
          onClick={toggleGlobalAll}
          className="text-primary hover:underline font-semibold cursor-pointer text-xs"
        >
          Toggle Select All
        </button>
      </div>

      <div className="border border-line dark:border-line-dark rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-secondary/40 border-b border-line text-ink-muted">
            <tr>
              <th className="py-2.5 px-3">Active Module</th>
              {ACTIONS.map((a) => (
                <th key={a} className="py-2.5 px-2 text-center capitalize">
                  {a}
                </th>
              ))}
              <th className="py-2.5 px-2 text-center">All</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark">
            {activePermissions.map((p) => (
              <tr key={p.module_key} className="hover:bg-surface-secondary/20">
                <td className="py-2 px-3 font-medium text-ink dark:text-ink-dark">{p.module_name}</td>
                {ACTIONS.map((action) => (
                  <td key={action} className="py-2 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={Boolean(p[action])}
                      onChange={() => toggleAction(p.module_key, action)}
                      className="rounded text-primary focus:ring-0 cursor-pointer"
                    />
                  </td>
                ))}
                <td className="py-2 px-2 text-center">
                  <button
                    type="button"
                    onClick={() => toggleAllForModule(p.module_key)}
                    className="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Row
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolePermissionsTable;
