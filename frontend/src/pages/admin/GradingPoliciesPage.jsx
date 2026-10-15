import { useState } from 'react';
import { BarChart2, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useGradingPolicy } from '../../hooks/useGradingPolicy';
import GradingHeaderBar from '../../components/admin/exams/GradingHeaderBar';
import MarksGradingTab from '../../components/admin/exams/MarksGradingTab';
import FailCriteriaTab from '../../components/admin/exams/FailCriteriaTab';
import PageLoader from '../../components/common/PageLoader';
import ConfirmModal from '../../components/common/ConfirmModal';

const GradingPoliciesPage = () => {
  const [activeTab, setActiveTab] = useState('scale');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const {
    policy, campuses, selectedCampus, setSelectedCampus,
    loading, saving, error, setError, success, setSuccess,
    saveScale, saveCriteria, resetDefaults
  } = useGradingPolicy();

  const handleResetConfirm = async () => {
    setResetConfirmOpen(false);
    await resetDefaults();
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <GradingHeaderBar
        campuses={campuses}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        onResetClick={() => setResetConfirmOpen(true)}
        saving={saving}
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('scale')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'scale'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface dark:bg-[#121217] text-ink-sub dark:text-ink-sub-dark border border-line dark:border-line-dark hover:bg-surface-secondary/70'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Marks Grading</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('criteria')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'criteria'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface dark:bg-[#121217] text-ink-sub dark:text-ink-sub-dark border border-line dark:border-line-dark hover:bg-surface-secondary/70'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Fail Criteria</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} className="underline font-semibold">Dismiss</button>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-good/10 text-good border border-good/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
          <button type="button" onClick={() => setSuccess('')} className="underline font-semibold">Dismiss</button>
        </div>
      )}

      {loading ? (
        <PageLoader text="Loading grading policy..." />
      ) : activeTab === 'scale' ? (
        <MarksGradingTab initialScale={policy?.grading_scale} onSave={saveScale} saving={saving} />
      ) : (
        <FailCriteriaTab initialCriteria={policy?.fail_criteria} onSave={saveCriteria} saving={saving} />
      )}

      <ConfirmModal
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleResetConfirm}
        title="Reset Standard Grading Scale"
        message="This will reset the grading scale and fail criteria to Pakistani board defaults for the selected campus. Continue?"
        confirmText="Reset Defaults"
        confirmStyle="danger"
      />
    </div>
  );
};

export default GradingPoliciesPage;
