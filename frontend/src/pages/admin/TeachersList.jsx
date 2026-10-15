import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTeachersList, DESIGNATIONS } from '../../hooks/useTeachersList';
import TeacherTopBar from '../../components/admin/teachers/TeacherTopBar';
import TeacherTable from '../../components/admin/teachers/TeacherTable';
import TeacherDetailsModal from '../../components/admin/teachers/TeacherDetailsModal';
import ChangePasswordModal from '../../components/admin/teachers/ChangePasswordModal';
import SubjectPagination from '../../components/admin/subjects/SubjectPagination';
import ConfirmModal from '../../components/common/ConfirmModal';
import PageLoader from '../../components/common/PageLoader';

const TeachersList = () => {
  const navigate = useNavigate();
  const [passwordTeacher, setPasswordTeacher] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const {
    teachers, campuses, loading, error, setError,
    selectedCampus, setSelectedCampus,
    selectedDesignation, setSelectedDesignation,
    searchQuery, setSearchQuery,
    viewTeacher, setViewTeacher,
    teacherToDelete, setTeacherToDelete,
    deleteLoading, handleToggleStatus, handleDeleteConfirm
  } = useTeachersList();

  return (
    <div className="space-y-4">
      <TeacherTopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        campuses={campuses}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        designations={DESIGNATIONS}
        selectedDesignation={selectedDesignation}
        onDesignationChange={setSelectedDesignation}
      />

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-good/10 text-good border border-good/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button type="button" onClick={() => setSuccessMessage('')} className="underline font-semibold">Dismiss</button>
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
          <PageLoader text="Loading staff directory..." />
        ) : teachers.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary mx-auto">
              <Users className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-ink dark:text-ink-dark">No staff records found</h3>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark max-w-sm mx-auto">
                {searchQuery ? `No staff matched "${searchQuery}".` : 'Add your first faculty member to populate directory.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <TeacherTable
              teachers={teachers}
              onToggleStatus={handleToggleStatus}
              onEdit={(t) => navigate(`/admin/teachers/${t._id}/edit`)}
              onDelete={setTeacherToDelete}
              onView={setViewTeacher}
              onOpenPassword={setPasswordTeacher}
            />
            <SubjectPagination
              currentPage={1}
              totalPages={1}
              totalItems={teachers.length}
              limit={teachers.length || 20}
              onPageChange={() => {}}
            />
          </>
        )}
      </div>

      <TeacherDetailsModal isOpen={!!viewTeacher} teacher={viewTeacher} onClose={() => setViewTeacher(null)} />
      <ChangePasswordModal
        isOpen={!!passwordTeacher}
        teacher={passwordTeacher}
        onClose={() => setPasswordTeacher(null)}
        onSuccess={(msg) => setSuccessMessage(msg)}
      />
      <ConfirmModal
        isOpen={!!teacherToDelete}
        onClose={() => !deleteLoading && setTeacherToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Teacher"
        message={`Are you sure you want to remove ${teacherToDelete?.name || 'this teacher'}?`}
        confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
        confirmStyle="danger"
      />
    </div>
  );
};

export default TeachersList;
