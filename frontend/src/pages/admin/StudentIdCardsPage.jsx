import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import UniversalIdCardToolbar from '../../components/common/idcards/UniversalIdCardToolbar';
import UniversalIdCardSheet from '../../components/common/idcards/UniversalIdCardSheet';
import useIdCardInstitution from '../../components/common/idcards/useIdCardInstitution';
import { useIdCardsData } from '../../components/admin/students/idcards/useIdCardsData';
import { exportStudentCardsPdf } from '../../utils/pdf/studentCardPdfExporter';

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
    handleToggleSelect,
    handleToggleSelectAll
  } = useIdCardsData(initialStudentId);

  const institution = useIdCardInstitution(selectedCampus);

  const [template, setTemplate] = useState('template_1_curve_blue');
  const [orientation, setOrientation] = useState('vertical');
  const [accentColor, setAccentColor] = useState('#003B73');
  const [sideMode, setSideMode] = useState('front');
  const [isExporting, setIsExporting] = useState(false);

  const chunkSize = orientation === 'horizontal' ? 6 : 3;
  const chunks = useMemo(() => {
    const list = [];
    for (let i = 0; i < selectedStudents.length; i += chunkSize) {
      list.push(selectedStudents.slice(i, i + chunkSize));
    }
    return list;
  }, [selectedStudents, chunkSize]);

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      await exportStudentCardsPdf(selectedStudents, {
        sideMode,
        style: template,
        orientation,
        accentColor,
        institution,
      });
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
        grades={grades}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        selectedCount={selectedStudents.length}
        totalCount={filteredStudents.length}
        onToggleSelectAll={handleToggleSelectAll}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
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
            <UniversalIdCardSheet
              key={idx}
              holders={chunk}
              holderType="student"
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

export default StudentIdCardsPage;
