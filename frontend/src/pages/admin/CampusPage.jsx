import { Building2, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { useCampusManager } from '../../hooks/useCampusManager';
import CampusHeader from '../../components/admin/campus/CampusHeader';
import CampusKpiStrip from '../../components/admin/campus/CampusKpiStrip';
import CampusFilterBar from '../../components/admin/campus/CampusFilterBar';
import CampusCard from '../../components/admin/campus/CampusCard';
import CampusModal from '../../components/admin/campus/CampusModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import PageLoader from '../../components/common/PageLoader';

const CampusPage = () => {
  const {
    campuses, loading, error, setError, searchQuery, setSearchQuery,
    statusFilter, setStatusFilter, filteredCampuses, kpis, modalState, setModalState,
    isSubmitting, campusToDelete, setCampusToDelete, deleteLoading,
    handleFormSubmit, handleDeleteConfirm, handleQuickSwitch,
    reload, activeCampusId, activeCampus, setActiveCampusId
  } = useCampusManager();

  return (
    <div className="w-full min-h-full flex flex-col gap-3 sm:gap-4">
      <CampusHeader
        activeCampus={activeCampus}
        onResetActiveCampus={() => handleQuickSwitch({ _id: 'all', name: 'All Campuses' })}
        onRefresh={reload}
        loading={loading}
        onAddClick={() => setModalState({ isOpen: true, mode: 'add', campus: null })}
        totalCount={campuses.length}
      />

      {error && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError('')}
            className="text-xs font-bold underline hover:opacity-80 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <CampusKpiStrip
        kpis={kpis}
        activeCampusName={activeCampus?.name || 'All Campuses'}
      />

      <CampusFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalCount={campuses.length}
        filteredCount={filteredCampuses.length}
      />

      <div className="flex-1 min-h-0">
        {loading && campuses.length === 0 ? (
          <PageLoader text="Loading campuses and metrics..." />
        ) : campuses.length === 0 ? (
          <div className="p-10 sm:p-14 text-center space-y-4 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-ink dark:text-white">
                No campuses registered yet
              </h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                Set up your institution&apos;s physical branches to assign students, teachers, and grades.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalState({ isOpen: true, mode: 'add', campus: null })}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Campus</span>
            </button>
          </div>
        ) : filteredCampuses.length === 0 ? (
          <div className="p-10 text-center space-y-3 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-xs">
            <Building2 className="w-10 h-10 mx-auto text-ink-muted" />
            <p className="text-sm font-bold text-ink dark:text-white">
              No matching campuses found
            </p>
            <p className="text-xs text-ink-muted">
              Try adjusting your search query &quot;{searchQuery}&quot; or status filter.
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="px-3 py-1.5 rounded-xl border border-line dark:border-line-dark text-xs font-bold text-primary hover:bg-primary/5 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {filteredCampuses.map((campus) => (
              <CampusCard
                key={campus._id}
                campus={campus}
                isActiveCampus={String(campus._id) === String(activeCampusId)}
                onQuickSwitch={handleQuickSwitch}
                onView={(c) => setModalState({ isOpen: true, mode: 'view', campus: c })}
                onEdit={(c) => setModalState({ isOpen: true, mode: 'edit', campus: c })}
                onDelete={setCampusToDelete}
              />
            ))}
          </div>
        )}
      </div>

      <CampusModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        campus={modalState.campus}
        existingCampuses={campuses}
        onClose={() => setModalState({ isOpen: false, mode: 'add', campus: null })}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        isActiveCampus={String(modalState.campus?._id) === String(activeCampusId)}
        onQuickSwitch={handleQuickSwitch}
      />

      <ConfirmModal
        isOpen={Boolean(campusToDelete)}
        onClose={() => !deleteLoading && setCampusToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Campus"
        message={`Are you sure you want to delete "${campusToDelete?.name || 'this campus'}"? This action cannot be undone.`}
        confirmText={deleteLoading ? 'Deleting...' : 'Delete Campus'}
        confirmStyle="danger"
      />
    </div>
  );
};

export default CampusPage;
