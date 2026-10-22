import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import StudentIdCardModernToolbar from '../../components/admin/students/idcards/StudentIdCardModernToolbar';
import UniversalIdCardSheet from '../../components/common/idcards/UniversalIdCardSheet';
import useIdCardInstitution from '../../components/common/idcards/useIdCardInstitution';
import StudentCardEditModal from '../../components/admin/students/idcards/StudentCardEditModal';
import { useIdCardsData } from '../../components/admin/students/idcards/useIdCardsData';
import { exportStudentCardsPdf } from '../../utils/pdf/studentCardPdfExporter';
import { exportStudentCardsZip } from '../../utils/pdf/studentCardZipExporter';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Archive
} from 'lucide-react';

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
    photoFilter,
    handlePhotoFilterChange,
    photoCounts,
    selectedIds,
    setSelectedIds,
    filteredStudents,
    selectedStudents,
    handleToggleSelect,
    handleToggleSelectAll,
    updateStudentInList
  } = useIdCardsData(initialStudentId);

  const institution = useIdCardInstitution(selectedCampus);

  const [template, setTemplate] = useState('template_1_curve_blue');
  const [orientation, setOrientation] = useState('vertical');
  const [accentColor, setAccentColor] = useState('#003B73');
  const [sideMode, setSideMode] = useState('front');
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId || 'all');
  const [editingStudent, setEditingStudent] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingSheet, setIsExportingSheet] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState(null);
  const [exportNotice, setExportNotice] = useState('');
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [viewMode, setViewMode] = useState('all');

  const handleSelectSpecificStudent = (sId) => {
    setSelectedStudentId(sId);
    setActiveSheetIndex(0);
    if (sId === 'all') {
      setSelectedIds(filteredStudents.map((s) => s._id));
    } else {
      setSelectedIds([sId]);
    }
  };

  const chunkSize = 6;
  const chunks = useMemo(() => {
    const list = [];
    for (let i = 0; i < selectedStudents.length; i += chunkSize) {
      list.push(selectedStudents.slice(i, i + chunkSize));
    }
    return list;
  }, [selectedStudents, chunkSize]);

  const safeSheetIndex = Math.min(activeSheetIndex, Math.max(0, chunks.length - 1));
  const currentSheetStudents = chunks[safeSheetIndex] || [];

  const handleExportSheetPdf = async () => {
    if (!currentSheetStudents.length) return;
    try {
      setIsExportingSheet(true);
      await exportStudentCardsPdf(currentSheetStudents, {
        sideMode,
        style: template,
        orientation,
        accentColor,
        institution,
        filename: `Student_ID_Cards_Sheet_${safeSheetIndex + 1}_${orientation}.pdf`
      });
      setExportNotice(`Exported Sheet ${safeSheetIndex + 1} (${currentSheetStudents.length} card(s)) successfully!`);
      setTimeout(() => setExportNotice(''), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingSheet(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      await exportStudentCardsPdf(selectedStudents, {
        sideMode,
        style: template,
        orientation,
        accentColor,
        institution,
        filename: `Student_ID_Cards_All_${selectedStudents.length}_Cards_${orientation}.pdf`
      });
      setExportNotice(`Exported all ${selectedStudents.length} card(s) successfully!`);
      setTimeout(() => setExportNotice(''), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportZip = async () => {
    try {
      setIsExportingZip(true);
      setZipProgress({ current: 0, total: selectedStudents.length, percent: 1, stage: 'init' });
      await exportStudentCardsZip(selectedStudents, {
        sideMode,
        style: template,
        orientation,
        accentColor,
        institution,
        onProgress: (p) => setZipProgress(p)
      });
      setExportNotice(`Vendor package exported! ${selectedStudents.length} card(s) saved in ZIP archive.`);
      setTimeout(() => setExportNotice(''), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingZip(false);
      setZipProgress(null);
    }
  };

  const singleSelectedStudent = selectedStudents.length === 1 ? selectedStudents[0] : null;

  return (
    <div className="space-y-5">
      <StudentIdCardModernToolbar
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
        students={filteredStudents}
        selectedStudentId={selectedStudentId}
        onSelectSpecificStudent={handleSelectSpecificStudent}
        photoFilter={photoFilter}
        onPhotoFilterChange={handlePhotoFilterChange}
        photoCounts={photoCounts}
        selectedCount={selectedStudents.length}
        totalCount={filteredStudents.length}
        onToggleSelectAll={handleToggleSelectAll}
        onExportSheetPdf={handleExportSheetPdf}
        isExportingSheet={isExportingSheet}
        activeSheetIndex={safeSheetIndex}
        activeSheetCount={currentSheetStudents.length}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
        onExportZip={handleExportZip}
        isExportingZip={isExportingZip}
        zipProgress={zipProgress}
      />

      {isExportingZip && zipProgress && (
        <div className="p-3.5 rounded-2xl bg-surface dark:bg-[#181818] border border-primary/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-primary animate-pulse" />
              <span className="font-bold text-ink dark:text-white">
                Packaging Vendor ZIP Archive ({zipProgress.percent}%)
              </span>
            </div>
            <span className="font-semibold text-ink-muted">
              {zipProgress.current} / {zipProgress.total} cards processed
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-line dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-150 rounded-full"
              style={{ width: `${zipProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-good/10 text-good border border-good/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{exportNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setExportNotice('')}
            className="underline font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {singleSelectedStudent && (
        <div className="print:hidden p-3 rounded-2xl bg-primary/10 border border-primary/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-ink dark:text-white">
                  Individual Print Mode: <span className="text-primary">{singleSelectedStudent.name}</span>
                </p>
                {!singleSelectedStudent.photo_url && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px] border border-amber-500/20">
                    No Photo (Monogram Avatar)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-ink-muted">
                Class: {singleSelectedStudent.current_grade?.name || '—'} • GR: {singleSelectedStudent.gr_number || '—'} • Father: {singleSelectedStudent.father_name || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectSpecificStudent('all')}
              className="px-3 py-1.5 rounded-xl border border-primary/30 text-primary hover:bg-primary/15 font-bold transition-all cursor-pointer text-xs"
            >
              Show All Students ({filteredStudents.length})
            </button>
            <button
              type="button"
              onClick={() => setEditingStudent(singleSelectedStudent)}
              className="px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold transition-all cursor-pointer text-xs"
            >
              Edit Card Data
            </button>
          </div>
        </div>
      )}

      {chunks.length > 1 && (
        <div className="print:hidden flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-surface dark:bg-[#111114] border border-line dark:border-white/10 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs border border-primary/20">
              {safeSheetIndex + 1}
            </span>
            <div>
              <p className="text-xs font-bold text-ink dark:text-white">
                Sheet {safeSheetIndex + 1} of {chunks.length}
              </p>
              <p className="text-[11px] text-ink-muted">
                {chunks[safeSheetIndex]?.length || 0} cards on this sheet • {selectedStudents.length} total selected
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center bg-surface-secondary dark:bg-[#181818] p-1 rounded-xl border border-line dark:border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('sheet')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'sheet'
                    ? 'bg-surface dark:bg-[#222222] text-primary dark:text-white shadow-2xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Fast Sheet View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'all'
                    ? 'bg-surface dark:bg-[#222222] text-primary dark:text-white shadow-2xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
                title="Render all sheets simultaneously"
              >
                View All ({chunks.length})
              </button>
            </div>

            {viewMode === 'sheet' && (
              <div className="flex items-center gap-1 bg-surface-secondary dark:bg-[#181818] p-1 rounded-xl border border-line dark:border-white/10">
                <button
                  type="button"
                  disabled={safeSheetIndex === 0}
                  onClick={() => setActiveSheetIndex(0)}
                  title="First Sheet"
                  className="p-1 rounded-lg text-ink-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={safeSheetIndex === 0}
                  onClick={() => setActiveSheetIndex((prev) => Math.max(0, prev - 1))}
                  title="Previous Sheet"
                  className="p-1 rounded-lg text-ink-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <select
                  value={safeSheetIndex}
                  onChange={(e) => setActiveSheetIndex(Number(e.target.value))}
                  className="px-2 py-0.5 text-xs font-bold bg-surface dark:bg-[#222222] text-ink dark:text-white rounded-lg border border-line dark:border-white/10 outline-none cursor-pointer"
                >
                  {chunks.map((_, i) => (
                    <option key={i} value={i}>
                      Sheet {i + 1} of {chunks.length}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={safeSheetIndex >= chunks.length - 1}
                  onClick={() => setActiveSheetIndex((prev) => Math.min(chunks.length - 1, prev + 1))}
                  title="Next Sheet"
                  className="p-1 rounded-lg text-ink-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={safeSheetIndex >= chunks.length - 1}
                  onClick={() => setActiveSheetIndex(chunks.length - 1)}
                  title="Last Sheet"
                  className="p-1 rounded-lg text-ink-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <StudentCardEditModal
        isOpen={Boolean(editingStudent)}
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onSaveSuccess={(updated) => updateStudentInList(updated)}
      />

      {loading ? (
        <div className="text-center py-16 text-xs text-ink-muted">
          Loading student directory &amp; generating cards...
        </div>
      ) : chunks.length === 0 ? (
        <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-12 text-center text-xs text-ink-muted space-y-2">
          <Sparkles className="w-8 h-8 text-primary mx-auto opacity-40" />
          <p className="font-bold text-sm text-ink dark:text-white">No student cards selected</p>
          <p className="max-w-sm mx-auto text-ink-muted">
            {searchQuery
              ? `No student matched "${searchQuery}".`
              : 'Pick a student from the dropdown or click "Select All" to preview ID cards.'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-8 print:hidden">
            {viewMode === 'sheet' ? (
              chunks[safeSheetIndex] && (
                <UniversalIdCardSheet
                  key={safeSheetIndex}
                  holders={chunks[safeSheetIndex]}
                  holderType="student"
                  template={template}
                  orientation={orientation}
                  accentColor={accentColor}
                  sideMode={sideMode}
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                  institution={institution}
                  pageIndex={safeSheetIndex}
                  totalSheets={chunks.length}
                />
              )
            ) : (
              chunks.map((chunk, idx) => (
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
              ))
            )}
          </div>

          <div className="hidden print:block space-y-8">
            {chunks.map((chunk, idx) => (
              <UniversalIdCardSheet
                key={`print-${idx}`}
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
        </>
      )}
    </div>
  );
};

export default StudentIdCardsPage;
