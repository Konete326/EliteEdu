import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import UniversalIdCardToolbar from '../../components/common/idcards/UniversalIdCardToolbar';
import UniversalIdCardSheet from '../../components/common/idcards/UniversalIdCardSheet';
import useIdCardInstitution from '../../components/common/idcards/useIdCardInstitution';
import TeacherCardEditModal from '../../components/admin/teachers/idcards/TeacherCardEditModal';
import { useTeacherIdCardsData } from '../../components/admin/teachers/idcards/useTeacherIdCardsData';
import { exportTeacherCardsPdf } from '../../utils/pdf/teacherCardPdfExporter';

const TeacherIdCardsPage = () => {
  const [searchParams] = useSearchParams();
  const initialTeacherId = searchParams.get('teacherId');

  const {
    campuses,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCampus,
    setSelectedCampus,
    selectedIds,
    filteredTeachers,
    selectedTeachers,
    handleToggleSelect,
    handleToggleSelectAll,
    updateTeacherInList
  } = useTeacherIdCardsData(initialTeacherId);

  const institution = useIdCardInstitution(selectedCampus);

  const [template, setTemplate] = useState('template_1_curve_blue');
  const [orientation, setOrientation] = useState('vertical');
  const [accentColor, setAccentColor] = useState('#003B73');
  const [sideMode, setSideMode] = useState('both');
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const chunkSize = orientation === 'horizontal' ? 6 : 8;
  const chunks = useMemo(() => {
    const list = [];
    for (let i = 0; i < selectedTeachers.length; i += chunkSize) {
      list.push(selectedTeachers.slice(i, i + chunkSize));
    }
    return list;
  }, [selectedTeachers, chunkSize]);

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      await exportTeacherCardsPdf(selectedTeachers, { sideMode, style: template });
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <UniversalIdCardToolbar
        template={template}
        onTemplateChange={setTemplate}
        orientation={orientation}
        onOrientationChange={setOrientation}
        accentColor={accentColor}
        onAccentColorChange={setAccentColor}
        sideMode={sideMode}
        onSideModeChange={setSideMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        campuses={campuses}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        selectedCount={selectedTeachers.length}
        totalCount={filteredTeachers.length}
        onToggleSelectAll={handleToggleSelectAll}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
      />

      <TeacherCardEditModal
        isOpen={Boolean(editingTeacher)}
        teacher={editingTeacher}
        onClose={() => setEditingTeacher(null)}
        onSaveSuccess={(updated) => updateTeacherInList(updated)}
      />

      {loading ? (
        <div className="text-center py-16 text-xs text-ink-muted">Loading faculty records & service cards...</div>
      ) : chunks.length === 0 ? (
        <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-12 text-center text-xs text-ink-muted">
          No faculty members selected or found matching criteria.
        </div>
      ) : (
        <div className="space-y-8">
          {chunks.map((chunk, idx) => (
            <UniversalIdCardSheet
              key={idx}
              holders={chunk}
              holderType="teacher"
              template={template}
              orientation={orientation}
              accentColor={accentColor}
              sideMode={sideMode}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              institution={institution}
              pageIndex={idx}
              totalSheets={chunks.length}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherIdCardsPage;
