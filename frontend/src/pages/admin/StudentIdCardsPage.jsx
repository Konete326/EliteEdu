import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import IdCardsToolbar from '../../components/admin/students/idcards/IdCardsToolbar';
import IdCardsSheetPage from '../../components/admin/students/idcards/IdCardsSheetPage';
import IdCardCustomizeModal from '../../components/admin/students/idcards/IdCardCustomizeModal';
import { useIdCardsData } from '../../components/admin/students/idcards/useIdCardsData';

const StudentIdCardsPage = () => {
  const [searchParams] = useSearchParams();
  const initialStudentId = searchParams.get('studentId');

  const {
    campuses,
    grades,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCampus,
    setSelectedCampus,
    selectedGrade,
    setSelectedGrade,
    selectedIds,
    filteredStudents,
    selectedStudents,
    chunks,
    handleToggleSelect,
    handleToggleSelectAll
  } = useIdCardsData(initialStudentId);

  const [selectedStyle, setSelectedStyle] = useState('Default');
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [config, setConfig] = useState({
    motto: 'پڑھے گا سندھ بڑھے گا سندھ',
    accentColor: '#3b82f6',
    showBarcode: true,
    showQr: true,
    showBloodGroup: true,
    showMotto: true
  });

  return (
    <div className="space-y-6">
      <IdCardsToolbar
        selectedStyle={selectedStyle}
        onSelectStyle={setSelectedStyle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        campuses={campuses}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        grades={grades}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        selectedCount={selectedStudents.length}
        totalCount={filteredStudents.length}
        onToggleSelectAll={handleToggleSelectAll}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
      />

      <IdCardCustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        config={config}
        onConfigChange={setConfig}
      />

      {loading ? (
        <div className="text-center py-16 text-xs text-ink-muted">Loading student directory & generating cards...</div>
      ) : chunks.length === 0 ? (
        <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-12 text-center text-xs text-ink-muted">
          No students selected or found matching criteria.
        </div>
      ) : (
        <div className="space-y-8">
          {chunks.map((chunk, idx) => (
            <IdCardsSheetPage
              key={idx}
              students={chunk}
              pageIndex={idx}
              totalSheets={chunks.length}
              selectedStyle={selectedStyle}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              config={config}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentIdCardsPage;
