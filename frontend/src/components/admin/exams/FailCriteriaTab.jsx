import { useState, useEffect } from 'react';
import { AlertTriangle, Check, Play, ShieldAlert } from 'lucide-react';
import CriteriaCard from './CriteriaCard';

const FailCriteriaTab = ({ initialCriteria, onSave, saving = false }) => {
  const [criteria, setCriteria] = useState({
    overall_percentage: 40,
    subject_percentage: 33,
    min_failed_subjects: 1
  });
  const [testOverall, setTestOverall] = useState(45);
  const [testFailedCount, setTestFailedCount] = useState(1);

  useEffect(() => {
    if (initialCriteria) {
      setCriteria({
        overall_percentage: Number(initialCriteria.overall_percentage) ?? 40,
        subject_percentage: Number(initialCriteria.subject_percentage) ?? 33,
        min_failed_subjects: Number(initialCriteria.min_failed_subjects) ?? 1
      });
    }
  }, [initialCriteria]);

  const simFailed = testOverall <= criteria.overall_percentage || testFailedCount >= criteria.min_failed_subjects;

  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-bad-soft dark:bg-bad/20 text-bad flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-ink dark:text-ink-dark">Fail Criteria</h2>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Set the conditions under which a student is marked as failed.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <CriteriaCard
          description={<>Student will be marked as <span className="font-bold text-bad">FAILED</span> if their <span className="font-bold text-ink dark:text-ink-dark">overall percentage</span> is equal to or below:</>}
          label="Overall %"
          value={criteria.overall_percentage}
          onChange={(v) => setCriteria((prev) => ({ ...prev, overall_percentage: v }))}
        />
        <CriteriaCard
          description={<><span className="font-bold text-primary dark:text-primary-dark">OR</span> if they obtain a <span className="font-bold text-ink dark:text-ink-dark">subject percentage</span> score equal to or below:</>}
          label="Subject %"
          value={criteria.subject_percentage}
          onChange={(v) => setCriteria((prev) => ({ ...prev, subject_percentage: v }))}
        />
        <CriteriaCard
          description={<>In at least this many <span className="font-bold text-ink dark:text-ink-dark">subjects</span>:</>}
          label="No. of Subjects"
          min={1}
          max={20}
          value={criteria.min_failed_subjects}
          onChange={(v) => setCriteria((prev) => ({ ...prev, min_failed_subjects: v }))}
        />
      </div>

      <div className="p-4 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/30 dark:bg-[#121217] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-ink dark:text-ink-dark">
          <Play className="w-4 h-4 text-primary" />
          <span>Interactive Rule Tester:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-ink-muted text-[11px]">Overall %:</span>
            <input
              type="number"
              value={testOverall}
              onChange={(e) => setTestOverall(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded-lg border border-line bg-surface dark:bg-[#16161d] text-xs font-mono font-bold text-center"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-ink-muted text-[11px]">Failed Subjs:</span>
            <input
              type="number"
              value={testFailedCount}
              onChange={(e) => setTestFailedCount(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded-lg border border-line bg-surface dark:bg-[#16161d] text-xs font-mono font-bold text-center"
            />
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
            simFailed ? 'bg-bad/10 text-bad border-bad/30' : 'bg-good/10 text-good border-good/30'
          }`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Result: {simFailed ? 'FAIL' : 'PASS'}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center sm:justify-end pt-2">
        <button
          type="button"
          onClick={() => onSave(criteria)}
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-xs shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Criteria'}</span>
        </button>
      </div>
    </div>
  );
};

export default FailCriteriaTab;
