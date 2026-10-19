import { Building2, Plus, AlertCircle } from 'lucide-react';
import { useCampusManager } from '../../hooks/useCampusManager';
import CampusHeader from '../../components/admin/campus/CampusHeader';
import CampusCard from '../../components/admin/campus/CampusCard';
import CampusModal from '../../components/admin/campus/CampusModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import PageLoader from '../../components/common/PageLoader';

const CampusPage = () => {
  const {
    campuses, loading, error, setError, searchQuery, setSearchQuery,
    filteredCampuses, modalState, setModalState, isSubmitting,
    campusToDelete, setCampusToDelete, deleteLoading,
    handleFormSubmit, handleDeleteConfirm
  } = useCampusManager();

  return (
    <div className="space-y-6">
      <CampusHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setModalState({ isOpen: true, mode: 'add', campus: null })}
        totalCount={campuses.length}
        filteredCount={filteredCampuses.length}
      />

      {error && (
        <div className="p-4 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} className="text-xs font-semibold underline">Dismiss</button>
        </div>
      )}

      {loading ? (
        <PageLoader text="Loading campuses..." />
      ) : campuses.length === 0 ? (
        <div className="p-12 text-center space-y-4 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-ink dark:text-ink-dark">No campuses found</h3>
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark max-w-sm mx-auto">Click + Add Campus to create your first branch.</p>
          </div>
          <button
            type="button"
            onClick={() => setModalState({ isOpen: true, mode: 'add', campus: null })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Campus</span>
          </button>
        </div>
      ) : filteredCampuses.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl">
          <Building2 className="w-10 h-10 mx-auto text-ink-muted" />
          <p className="text-base font-semibold text-ink dark:text-ink-dark">No matching campuses</p>
          <p className="text-sm text-ink-muted">No campus matched your search term "{searchQuery}".</p>
          <button type="button" onClick={() => setSearchQuery('')} className="text-sm font-semibold text-primary hover:underline">Clear Search</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampuses.map((campus) => (
            <CampusCard
              key={campus._id}
              campus={campus}
              onView={(c) => setModalState({ isOpen: true, mode: 'view', campus: c })}
              onEdit={(c) => setModalState({ isOpen: true, mode: 'edit', campus: c })}
              onDelete={setCampusToDelete}
            />
          ))}
        </div>
      )}

      <CampusModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        campus={modalState.campus}
        existingCampuses={campuses}
        onClose={() => setModalState({ isOpen: false, mode: 'add', campus: null })}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={!!campusToDelete}
        onClose={() => !deleteLoading && setCampusToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Campus"
        message={`Are you sure you want to delete ${campusToDelete?.name || 'this campus'}? This action is permanent.`}
        confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
        confirmStyle="danger"
      />
    </div>
  );
};

export default CampusPage;
