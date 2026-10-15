import { useState, useMemo } from 'react';
import { useGrades } from '../../hooks/useGrades';
import PageLoader from '../../components/common/PageLoader';
import ConfirmModal from '../../components/common/ConfirmModal';
import AutoLoadConfirmModal from '../../components/common/AutoLoadConfirmModal';
import GradesHeader from '../../components/admin/grades/GradesHeader';
import GradesTable from '../../components/admin/grades/GradesTable';
import GradesPagination from '../../components/admin/grades/GradesPagination';
import GradeModal from '../../components/admin/grades/GradeModal';

const GradesPage = () => {
  const { grades, campuses, teachers, loading, isSeeding, saveGrade, toggleStatus, deleteGrade, autoLoadGrades } = useGrades();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAutoLoadModal, setShowAutoLoadModal] = useState(false);

  const targetCampusName = campuses.find((c) => c._id === selectedCampus)?.name || 'All Campuses';

  const filteredGrades = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return grades.filter((g) => {
      const matchSearch = !q || g.name.toLowerCase().includes(q) || g.sections?.some((s) => s.toLowerCase().includes(q)) || (g.class_teacher?.name && g.class_teacher.name.toLowerCase().includes(q));
      return matchSearch && (!selectedCampus || (g.campus_id?._id || g.campus_id) === selectedCampus);
    });
  }, [grades, searchQuery, selectedCampus]);

  const pageSize = 20;
  const totalPages = Math.ceil(filteredGrades.length / pageSize) || 1;
  const paginatedGrades = filteredGrades.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteGrade(deleteTarget._id);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <PageLoader text="Loading grades & sections..." />;

  return (
    <div className="w-full space-y-5 pb-12">
      <GradesHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCampus={selectedCampus}
        setSelectedCampus={setSelectedCampus}
        campuses={campuses}
        onAddClick={() => { setSelectedGrade(null); setModalOpen(true); }}
        onAutoLoad={() => setShowAutoLoadModal(true)}
        isSeeding={isSeeding}
      />

      <div className="w-full rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm p-4 sm:p-5">
        <GradesTable
          grades={paginatedGrades}
          onEdit={(g) => { setSelectedGrade(g); setModalOpen(true); }}
          onView={(g) => { setSelectedGrade(g); setModalOpen(true); }}
          onDelete={(g) => setDeleteTarget(g)}
          onToggleStatus={(g) => toggleStatus(g._id)}
        />

        <GradesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredGrades.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      <GradeModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedGrade(null); }}
        onSave={(payload) => saveGrade(payload, selectedGrade?._id)}
        grade={selectedGrade}
        campuses={campuses}
        teachers={teachers}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Grade"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Grade"
        confirmStyle="danger"
      />

      <AutoLoadConfirmModal
        isOpen={showAutoLoadModal}
        onClose={() => !isSeeding && setShowAutoLoadModal(false)}
        onConfirm={async () => {
          await autoLoadGrades(selectedCampus);
          setShowAutoLoadModal(false);
        }}
        isLoading={isSeeding}
        title="Auto-Load Standard Classes"
        description="Seed standard academic levels from Class 1 to Class 10 with default sections for your institution."
        targetName={targetCampusName}
        features={[
          'Creates standard Class 1 through Class 10 academic divisions',
          'Configures default Section A with active status for each class',
          'Safe operation: existing classes and assigned teachers remain unchanged'
        ]}
      />
    </div>
  );
};

export default GradesPage;
