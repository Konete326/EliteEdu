import { useState } from 'react';
import { AlertCircle, BookOpen } from 'lucide-react';
import { useSubjectsManager } from '../../hooks/useSubjectsManager';
import SubjectTopBar from '../../components/admin/subjects/SubjectTopBar';
import SubjectKpiStrip from '../../components/admin/subjects/SubjectKpiStrip';
import SubjectTable from '../../components/admin/subjects/SubjectTable';
import SubjectPagination from '../../components/admin/subjects/SubjectPagination';
import SubjectModal from '../../components/admin/subjects/SubjectModal';
import SubjectEmptyState from '../../components/admin/subjects/SubjectEmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import AutoLoadConfirmModal from '../../components/common/AutoLoadConfirmModal';
import SubjectInUseModal from '../../components/admin/subjects/SubjectInUseModal';
import PageLoader from '../../components/common/PageLoader';

const SubjectsPage = () => {
  const {
    subjects, campuses, grades, teachers, selectedCampus, setSelectedCampus,
    selectedClass, setSelectedClass, selectedStream, setSelectedStream,
    searchQuery, setSearchQuery, loading, error, setError, currentPage, totalPages, totalItems,
    pageSize, modalState, setModalState, isSubmitting, subjectToDelete, setSubjectToDelete, deleteLoading,
    toggleLoadingId, isSeeding, inUseConflict, setInUseConflict, handleToggle, handleAutoLoad, handleFormSubmit,
    handleDeleteConfirm, handleInactivateFromConflict, fetchSubjects, setCurrentPage
  } = useSubjectsManager();

  const [showAutoLoadModal, setShowAutoLoadModal] = useState(false);
  const targetCampusName = campuses.find((c) => c._id === selectedCampus)?.name || 'All Campuses';

  return (
    <div className="space-y-4 pb-12">
      <SubjectTopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        campuses={campuses}
        grades={grades}
        selectedCampus={selectedCampus}
        onCampusChange={(val) => { setSelectedCampus(val); setCurrentPage(1); }}
        selectedClass={selectedClass}
        onClassChange={(val) => { setSelectedClass(val); setCurrentPage(1); }}
        selectedStream={selectedStream}
        onStreamChange={(val) => { setSelectedStream(val); setCurrentPage(1); }}
        onAutoLoad={() => setShowAutoLoadModal(true)}
        onAddClick={() => setModalState({ isOpen: true, mode: 'add', subject: null })}
        isSeeding={isSeeding}
        totalItems={totalItems}
      />

      <SubjectKpiStrip
        subjects={subjects}
        totalCount={totalItems}
        activeCampusName={targetCampusName}
      />

      {error && (
        <div className="p-3.5 rounded-xl bg-bad/10 text-bad dark:text-bad-dark border border-bad/20 text-xs flex items-center justify-between font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} className="underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl overflow-hidden shadow-xs p-4 sm:p-5">
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
              limit={pageSize}
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
        teachers={teachers}
        existingSubjects={subjects}
        onClose={() => setModalState({ isOpen: false, mode: 'add', subject: null })}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={!!subjectToDelete}
        onClose={() => !deleteLoading && setSubjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Subject"
        message={`Are you sure you want to delete "${subjectToDelete?.name || 'this subject'}"? This action cannot be undone.`}
        confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
        confirmStyle="danger"
      />

      <SubjectInUseModal
        isOpen={!!inUseConflict}
        conflict={inUseConflict}
        onClose={() => setInUseConflict(null)}
        onInactivate={handleInactivateFromConflict}
        isLoading={isSubmitting}
      />

      <AutoLoadConfirmModal
        isOpen={showAutoLoadModal}
        onClose={() => setShowAutoLoadModal(false)}
        onConfirm={() => {
          setShowAutoLoadModal(false);
          handleAutoLoad();
        }}
        isLoading={isSeeding}
        icon={BookOpen}
        title="Load Standard Subjects"
        description="Load standard Pakistani school subjects from Playgroup to Class 10 with Compulsory subjects and Electives (Biology and Computer Science)."
        targetName={targetCampusName}
        features={[
          'Includes English, Urdu, Islamiat, Math, Science, Physics, Chemistry, Biology, and Computer Science',
          'Sets up Biology and Computer Science as elective choices for Class 9 and 10',
          'Your existing subjects and teachers will remain safe'
        ]}
      />
    </div>
  );
};

export default SubjectsPage;
