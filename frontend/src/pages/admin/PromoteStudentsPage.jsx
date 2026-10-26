import { useState } from 'react';
import { useStudentPromotion } from '../../hooks/useStudentPromotion';
import PromotionHeaderBanner from '../../components/admin/students/promote/PromotionHeaderBanner';
import PromotionStudentGrid from '../../components/admin/students/promote/PromotionStudentGrid';
import PromotionPosDock from '../../components/admin/students/promote/PromotionPosDock';
import ConfirmModal from '../../components/common/ConfirmModal';

const PromoteStudentsPage = () => {
  const {
    candidates, grades, campuses, recentPromotions, passThreshold, setPassThreshold, loading, submitting, error, setError,
    campusId, setCampusId, sourceGradeId, setSourceGradeId, search, setSearch,
    selectedIds, toggleStudent, selectAll, clearSelection, selectPassed, updateStudentScore,
    targetGradeId, setTargetGradeId, targetSection, setTargetSection, mode, setMode,
    executePromotion, fetchCandidates
  } = useStudentPromotion();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const targetGrade = grades.find((g) => g._id === targetGradeId);

  const handleConfirmPromote = async () => {
    setConfirmOpen(false);
    const success = await executePromotion();
    if (success) {
      setSuccessMsg(`Successfully promoted students to ${targetGrade?.name || 'next class'}!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="w-full space-y-2.5 pb-4 xl:pb-0 min-h-0">
      <PromotionHeaderBanner
        candidates={candidates}
        passThreshold={passThreshold}
        setPassThreshold={setPassThreshold}
        selectedCount={selectedIds.length}
        recentPromotions={recentPromotions}
        onReload={fetchCandidates}
        loading={loading}
      />

      {error && (
        <div className="p-2.5 rounded-xl bg-bad/10 text-bad border border-bad/20 text-xs">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-start min-h-0">
        <div className="xl:col-span-8 min-w-0 min-h-0">
          <PromotionStudentGrid
            candidates={candidates}
            grades={grades}
            campuses={campuses}
            campusId={campusId}
            setCampusId={setCampusId}
            sourceGradeId={sourceGradeId}
            setSourceGradeId={setSourceGradeId}
            search={search}
            setSearch={setSearch}
            selectedIds={selectedIds}
            onToggleStudent={toggleStudent}
            onSelectAll={selectAll}
            onClearSelection={clearSelection}
            onSelectPassed={selectPassed}
            onScoreChange={updateStudentScore}
            passThreshold={passThreshold}
            setPassThreshold={setPassThreshold}
            loading={loading}
          />
        </div>

        <div className="xl:col-span-4 min-w-0">
          <PromotionPosDock
            candidates={candidates}
            grades={grades}
            selectedIds={selectedIds}
            onRemoveStudent={toggleStudent}
            sourceGradeId={sourceGradeId}
            targetGradeId={targetGradeId}
            setTargetGradeId={setTargetGradeId}
            targetSection={targetSection}
            setTargetSection={setTargetSection}
            mode={mode}
            setMode={setMode}
            onPromoteClick={() => setConfirmOpen(true)}
            passThreshold={passThreshold}
            setPassThreshold={setPassThreshold}
            submitting={submitting}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmPromote}
        title="Confirm Student Promotion"
        message={`Are you sure you want to promote ${mode === 'Auto_Criteria' ? 'all qualified students' : `${selectedIds.length} selected students`} to ${targetGrade?.name || 'target grade'} (${targetSection})?`}
        confirmText="Confirm Promotion"
        confirmStyle="primary"
      />
    </div>
  );
};

export default PromoteStudentsPage;
