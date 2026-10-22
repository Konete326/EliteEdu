import { useNavigate } from 'react-router-dom';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { useStudentsList } from '../../hooks/useStudentsList';
import StudentTopBar from '../../components/admin/students/StudentTopBar';
import StudentKpiStrip from '../../components/admin/students/StudentKpiStrip';
import StudentTable from '../../components/admin/students/StudentTable';
import StudentMobileCard from '../../components/admin/students/StudentMobileCard';
import StudentPagination from '../../components/admin/students/StudentPagination';
import StudentLedgerModal from '../../components/admin/students/StudentLedgerModal';
import StudentDetailsModal from '../../components/admin/students/StudentDetailsModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import PageLoader from '../../components/common/PageLoader';

const StudentsList = () => {
  const navigate = useNavigate();
  const {
    students, campuses, grades, selectedCampus, setSelectedCampus, selectedGrade, setSelectedGrade,
    selectedStatus, setSelectedStatus, kpis, searchQuery, setSearchQuery, loading, error, setError,
    page, setPage, limit, totalPages, totalStudents, viewStudent, setViewStudent, ledgerStudent,
    setLedgerStudent, studentToDelete, setStudentToDelete, deleteLoading, handleToggleStatus,
    handleDeleteConfirm
  } = useStudentsList();

  return (
    <div className="space-y-4">
      <StudentTopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        campuses={campuses}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        grades={grades}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        totalCount={totalStudents}
      />

      <StudentKpiStrip
        kpis={kpis}
        activeFilter={selectedStatus}
        onFilterChange={setSelectedStatus}
      />

      {error && (
        <div className="p-3.5 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} className="underline font-semibold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <PageLoader text="Loading student enrollment directory..." />
        ) : students.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-dark mx-auto">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-ink dark:text-white">No students found</h3>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark max-w-sm mx-auto">
                {searchQuery
                  ? `No student matching "${searchQuery}" was found.`
                  : selectedStatus !== 'all'
                  ? `No students found with status "${selectedStatus}".`
                  : 'Enroll your first student using the Add Student button above.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="hidden md:block">
              <StudentTable
                students={students}
                onToggleStatus={handleToggleStatus}
                onEdit={(s) => navigate(`/admin/students/${s._id}/edit`)}
                onDelete={setStudentToDelete}
                onView={setViewStudent}
                onOpenLedger={setLedgerStudent}
                onOpenAttendance={(s) => navigate(`/admin/attendance/students?gradeId=${s.current_grade?._id || ''}&studentId=${s._id}`)}
                onOpenAdmissionLetter={(s) => navigate(`/admin/students/admission-letter?studentId=${s._id}`)}
                onOpenIdCard={(s) => navigate(`/admin/students/id-cards?studentId=${s._id}`)}
              />
            </div>

            <div className="md:hidden space-y-3">
              {students.map((student) => (
                <StudentMobileCard
                  key={student._id}
                  student={student}
                  onToggleStatus={handleToggleStatus}
                  onEdit={(s) => navigate(`/admin/students/${s._id}/edit`)}
                  onDelete={setStudentToDelete}
                  onView={setViewStudent}
                  onOpenLedger={setLedgerStudent}
                  onOpenAttendance={(s) => navigate(`/admin/attendance/students?gradeId=${s.current_grade?._id || ''}&studentId=${s._id}`)}
                  onOpenAdmissionLetter={(s) => navigate(`/admin/students/admission-letter?studentId=${s._id}`)}
                  onOpenIdCard={(s) => navigate(`/admin/students/id-cards?studentId=${s._id}`)}
                />
              ))}
            </div>

            <StudentPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalStudents}
              pageSize={limit}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <StudentDetailsModal
        isOpen={!!viewStudent}
        student={viewStudent}
        onClose={() => setViewStudent(null)}
        onOpenLedger={setLedgerStudent}
        onEdit={(s) => navigate(`/admin/students/${s._id}/edit`)}
      />
      <StudentLedgerModal
        isOpen={!!ledgerStudent}
        student={ledgerStudent}
        onClose={() => setLedgerStudent(null)}
      />
      <ConfirmModal
        isOpen={!!studentToDelete}
        onClose={() => !deleteLoading && setStudentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        message={`Are you sure you want to permanently delete ${studentToDelete?.name || 'this student'}? This action cannot be undone.`}
        confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
        confirmStyle="danger"
      />
    </div>
  );
};

export default StudentsList;
