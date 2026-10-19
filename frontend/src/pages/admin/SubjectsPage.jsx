import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useSubjectsManager } from '../../hooks/useSubjectsManager';
import SubjectTopBar from '../../components/admin/subjects/SubjectTopBar';
import SubjectTable from '../../components/admin/subjects/SubjectTable';
import SubjectPagination from '../../components/admin/subjects/SubjectPagination';
import SubjectModal from '../../components/admin/subjects/SubjectModal';
import SubjectEmptyState from '../../components/admin/subjects/SubjectEmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import AutoLoadConfirmModal from '../../components/common/AutoLoadConfirmModal';
import PageLoader from '../../components/common/PageLoader';

const SubjectsPage = () => {
  const {
    subjects, campuses, grades, selectedCampus, setSelectedCampus, selectedClass, setSelectedClass,
    searchQuery, setSearchQuery, loading, error, setError, currentPage, totalPages, totalItems,
    modalState, setModalState, isSubmitting, subjectToDelete, setSubjectToDelete, deleteLoading,
    toggleLoadingId, isSeeding, handleToggle, handleAutoLoad, handleFormSubmit, handleDeleteConfirm,
    fetchSubjects, setCurrentPage
  } = useSubjectsManager();

  const [showAutoLoadModal, setShowAutoLoadModal] = useState(false);
  const targetCampusName = campuses.find((c) => c._id === selectedCampus)?.name || 'All Campuses';

  return (
    <div className="space-y-4">
      <SubjectTopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        campuses={campuses}
        grades={grades}
        selectedCampus={selectedCampus}
        onCampusChange={(val) => { setSelectedCampus(val); setCurrentPage(1); }}
        selectedClass={selectedClass}
        onClassChange={(val) => { setSelectedClass(val); setCurrentPage(1); }}
        onAutoLoad={() => setShowAutoLoadModal(true)}
        onAddClick={() => setModalState({ isOpen: true, mode: 'add', subject: null })}
        isSeeding={isSeeding}
      />

      {error && (
        <div className="p-3.5 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>
          <button type="button" onClick={() => setError('')} className="underline font-semibold cursor-pointer">Dismiss</button>
        </div>
      )}

      <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <PageLoader text="Loading subjects..." />
        ) : subjects.length === 0 ? (
          <SubjectEmptyState
            searchQuery={searchQuery}
            onAutoLoad={() => setShowAutoLoadModal(true)}
            onAddClick={() => setModalState({ isOpen: true, mode: 'add', subject: null })}
            isSeeding={isSeeding}
          />
        ) : (
          <>
            <SubjectTable
              subjects={subjects}
              onEdit={(s) => setModalState({ isOpen: true, mode: 'edit', subject: s })}
              onDelete={setSubjectToDelete}
              onToggle={handleToggle}
              toggleLoadingId={toggleLoadingId}
            />
            <SubjectPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              limit={10}
              onPageChange={(page) => fetchSubjects(page)}
            />
          </>
        )}
      </div>

      <SubjectModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        subject={modalState.subject}
        campuses={campuses}
        grades={grades}
        onClose={() => setModalState({ isOpen: false, mode: 'add', subject: null })}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={!!subjectToDelete}
        onClose={() => !deleteLoading && setSubjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Subject"
        message={`Are you sure you want to delete ${subjectToDelete?.name || 'this subject'}? This action cannot be undone.`}
        confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
        confirmStyle="danger"
      />

      <AutoLoadConfirmModal
        isOpen={showAutoLoadModal}
        onClose={() => !isSeeding && setShowAutoLoadModal(false)}
        onConfirm={async () => {
          await handleAutoLoad();
          setShowAutoLoadModal(false);
        }}
        isLoading={isSeeding}
        title="Auto-Load Standard Curriculum"
        description="Seed standard Pakistani curriculum courses for Class 1 to Class 10 with official subject codes and categories."
        targetName={targetCampusName}
        features={[
          'Loads standard curriculum courses for Class 1 to Class 10 (English, Urdu, Science, Math, etc.)',
          'Preserves all existing subjects without duplicate collisions',
          'Sets default mandatory/optional statuses and academic credit configs'
        ]}
      />
    </div>
  );
};

export default SubjectsPage;
