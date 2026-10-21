import { useNavigate } from 'react-router-dom';
import { UserCheck, AlertCircle, CheckCircle, MapPin } from 'lucide-react';
import { useStaffApplicantsList } from '../../hooks/useStaffApplicantsList';
import ApplicantTopBar from '../../components/admin/applicants/ApplicantTopBar';
import ApplicantTable from '../../components/admin/applicants/ApplicantTable';
import ApplicantPagination from '../../components/admin/applicants/ApplicantPagination';
import ApplicantDetailsModal from '../../components/admin/applicants/ApplicantDetailsModal';
import ApplicantSalaryModal from '../../components/admin/applicants/ApplicantSalaryModal';
import CustomizeFormModal from '../../components/admin/applicants/CustomizeFormModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import PageLoader from '../../components/common/PageLoader';

const StaffApplicantsList = () => {
  const navigate = useNavigate();
  const {
    applicants, campuses, selectedCampus, setSelectedCampus, selectedStatus,
    setSelectedStatus, selectedDepartment, setSelectedDepartment, selectedAvailability,
    setSelectedAvailability, searchQuery, setSearchQuery, page, setPage, limit, totalPages,
    totalApplicants, loading, error, setError, toastMessage, viewApplicant, setViewApplicant,
    applicantToDelete, setApplicantToDelete, applicantToConvert, setApplicantToConvert,
    applicantForSalary, setApplicantForSalary, isCustomizeModalOpen, setIsCustomizeModalOpen,
    isMapView, setIsMapView, actionLoading, handleStatusChange, handleConvertConfirm,
    handleDeleteConfirm, copyApplicationLink
  } = useStaffApplicantsList();

  return (
    <div className="space-y-4">
      <ApplicantTopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        campuses={campuses}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        selectedAvailability={selectedAvailability}
        onAvailabilityChange={setSelectedAvailability}
        onCopyLink={copyApplicationLink}
        onOpenCustomize={() => setIsCustomizeModalOpen(true)}
        isMapView={isMapView}
        onToggleMapView={() => setIsMapView(!isMapView)}
      />

      <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/30">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-ink dark:text-white">Recruitment &amp; Staff Hiring Pipeline</p>
            <p className="text-[11px] text-ink-muted">
              Review applicant CVs, manage interview status, set approved salaries, and click &ldquo;Hire&rdquo; to instantly enroll candidates into the active staff directory.
            </p>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} className="underline font-semibold">Dismiss</button>
        </div>
      )}

      <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <PageLoader text="Loading staff applicants directory..." />
        ) : isMapView ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Applicant Geospatial Map View</h3>
            <p className="text-xs text-ink-muted max-w-sm mx-auto">
              Visual map showing candidate distribution across campuses and cities.
            </p>
          </div>
        ) : applicants.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary mx-auto">
              <UserCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-ink dark:text-ink-dark">No staff applicants found</h3>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark max-w-sm mx-auto">
                {searchQuery ? `No applicant matching "${searchQuery}" was found.` : 'Create your first candidate using the Add Applicant button above.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <ApplicantTable
              applicants={applicants}
              onStatusChange={handleStatusChange}
              onOpenConvert={setApplicantToConvert}
              onOpenSalary={setApplicantForSalary}
              onView={setViewApplicant}
              onEdit={(app) => navigate(`/admin/staff-applicants/${app._id}/edit`)}
              onDelete={setApplicantToDelete}
            />
            <ApplicantPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalApplicants}
              pageSize={limit}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <ApplicantDetailsModal
        isOpen={Boolean(viewApplicant)}
        applicant={viewApplicant}
        onClose={() => setViewApplicant(null)}
        onConvert={(app) => {
          setViewApplicant(null);
          setApplicantToConvert(app);
        }}
      />

      <ApplicantSalaryModal
        isOpen={Boolean(applicantForSalary)}
        applicant={applicantForSalary}
        onClose={() => setApplicantForSalary(null)}
        onConfirm={handleStatusChange}
      />

      <CustomizeFormModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
      />

      <ConfirmModal
        isOpen={Boolean(applicantToConvert)}
        onClose={() => !actionLoading && setApplicantToConvert(null)}
        onConfirm={handleConvertConfirm}
        title="Hire Candidate as Active Teacher"
        message={`Are you sure you want to hire ${applicantToConvert?.name} as an active Teacher? This will automatically generate a unique employee code, assign login credentials, and transfer their profile directly into the Teachers directory.`}
        confirmText={actionLoading ? 'Enrolling...' : 'Confirm & Enroll'}
        confirmStyle="primary"
      />

      <ConfirmModal
        isOpen={Boolean(applicantToDelete)}
        onClose={() => !actionLoading && setApplicantToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Applicant"
        message={`Are you sure you want to permanently delete ${applicantToDelete?.name || 'this applicant'}? This action cannot be undone.`}
        confirmText={actionLoading ? 'Deleting...' : 'Delete'}
        confirmStyle="danger"
      />
    </div>
  );
};

export default StaffApplicantsList;
