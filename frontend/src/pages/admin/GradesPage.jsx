import { useState, useMemo, useEffect } from 'react';
import { useGrades } from '../../hooks/useGrades';
import { useCampus } from '../../context/CampusContext';
import { sortGradesInSequence } from '../../utils/gradeSortHelper';
import PageLoader from '../../components/common/PageLoader';
import GradesHeader from '../../components/admin/grades/GradesHeader';
import GradesKpiStrip from '../../components/admin/grades/GradesKpiStrip';
import GradesTable from '../../components/admin/grades/GradesTable';
import GradesPagination from '../../components/admin/grades/GradesPagination';
import GradeModals from '../../components/admin/grades/GradeModals';

const GradesPage = () => {
  const { activeCampus, activeCampusId } = useCampus();
  const [selectedCampus, setSelectedCampus] = useState(activeCampusId !== 'all' ? activeCampusId : '');
  const {
    grades, campuses, teachers, loading, isSeeding,
    saveGrade, toggleStatus, deleteGrade, reorderGrades, autoLoadGrades, reload
  } = useGrades(selectedCampus);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [viewGrade, setViewGrade] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAutoLoadModal, setShowAutoLoadModal] = useState(false);

  useEffect(() => {
    if (activeCampusId && activeCampusId !== 'all') {
      setSelectedCampus(activeCampusId);
    }
  }, [activeCampusId]);

  const targetCampusName = campuses.find((c) => c._id === selectedCampus)?.name || activeCampus?.name || 'All Campuses';

  const filteredGrades = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const list = grades.filter((g) => {
      const matchSearch = !q || g.name.toLowerCase().includes(q) || g.sections?.some((s) => s.toLowerCase().includes(q)) || (g.class_teacher?.name && g.class_teacher.name.toLowerCase().includes(q));
      return matchSearch && (!selectedCampus || (g.campus_id?._id || g.campus_id) === selectedCampus);
    });
    return sortGradesInSequence(list);
  }, [grades, searchQuery, selectedCampus]);

  const totalPages = Math.ceil(filteredGrades.length / pageSize) || 1;
  const paginatedGrades = filteredGrades.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleReorder = (newPaginated) => {
    const startIdx = (currentPage - 1) * pageSize;
    const updatedFiltered = [...filteredGrades];
    updatedFiltered.splice(startIdx, paginatedGrades.length, ...newPaginated);

    const reorderedIdsMap = new Map();
    updatedFiltered.forEach((g, idx) => {
      reorderedIdsMap.set(g._id, idx + 1);
    });

    const fullUpdated = grades.map((g) => {
      if (reorderedIdsMap.has(g._id)) {
        return { ...g, order: reorderedIdsMap.get(g._id) };
      }
      return g;
    });

    const finalOrdered = [...fullUpdated].sort((a, b) => {
      const ordA = a.order ?? 999;
      const ordB = b.order ?? 999;
      return ordA - ordB;
    });

    reorderGrades(finalOrdered);
  };

  const handleDelete = async () => {
    const targetId = deleteTarget?._id;
    if (!targetId) return;
    setDeleteTarget(null);
    try {
      await deleteGrade(targetId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && grades.length === 0) return <PageLoader text="Loading grades & sections..." />;

  return (
    <div className="w-full space-y-4 pb-12">
      <GradesHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCampus={selectedCampus}
        setSelectedCampus={setSelectedCampus}
        campuses={campuses}
        onAddClick={() => { setSelectedGrade(null); setModalOpen(true); }}
        onAutoLoad={() => setShowAutoLoadModal(true)}
        isSeeding={isSeeding}
        onRefresh={reload}
        loading={loading}
        totalCount={filteredGrades.length}
      />

      <GradesKpiStrip
        grades={filteredGrades}
        activeCampusName={targetCampusName}
      />

      <div className="w-full rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm p-4 sm:p-5">
        <GradesTable
          grades={paginatedGrades}
          onEdit={(g) => { setSelectedGrade(g); setModalOpen(true); }}
          onView={(g) => setViewGrade(g)}
          onDelete={(g) => setDeleteTarget(g)}
          onToggleStatus={(g) => toggleStatus(g._id)}
          onReorder={searchQuery ? null : handleReorder}
        />
        <GradesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredGrades.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <GradeModals
        modalOpen={modalOpen}
        selectedGrade={selectedGrade}
        onCloseModal={() => { setModalOpen(false); setSelectedGrade(null); }}
        onSaveGrade={(payload) => saveGrade(payload, selectedGrade?._id)}
        viewGrade={viewGrade}
        onCloseView={() => setViewGrade(null)}
        onEditGrade={(g) => { setViewGrade(null); setSelectedGrade(g); setModalOpen(true); }}
        deleteTarget={deleteTarget}
        onCloseDelete={() => setDeleteTarget(null)}
        onConfirmDelete={handleDelete}
        showAutoLoadModal={showAutoLoadModal}
        isSeeding={isSeeding}
        onCloseAutoLoad={() => !isSeeding && setShowAutoLoadModal(false)}
        onConfirmAutoLoad={async () => {
          await autoLoadGrades(selectedCampus);
          setShowAutoLoadModal(false);
        }}
        targetCampusName={targetCampusName}
        campuses={campuses}
        teachers={teachers}
      />
    </div>
  );
};

export default GradesPage;
