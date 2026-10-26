import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import StudentIdCardModernToolbar from '../../components/admin/students/idcards/StudentIdCardModernToolbar';
import UniversalIdCard from '../../components/common/idcards/UniversalIdCard';
import useIdCardInstitution from '../../components/common/idcards/useIdCardInstitution';
import StudentCardEditModal from '../../components/admin/students/idcards/StudentCardEditModal';
import { useIdCardsData } from '../../components/admin/students/idcards/useIdCardsData';
import {
  exportStudentCardsPdfBackground,
  exportStudentCardsZipBackground,
  printStudentCardsBackground
} from '../../services/idCardExportService';
import { exportStudentCardsPdf } from '../../utils/pdf/studentCardPdfExporter';
import { Masonry } from '../../components/ui/responsive-masonry-layout';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Archive,
  Printer
} from 'lucide-react';

const BATCH_SIZE = 24;

const StudentIdCardsPage = () => {
  const [searchParams] = useSearchParams();
  const initialStudentId = searchParams.get('studentId');

  const {
    campuses,
    grades,
    loading,
    totalCount,
    isAllSelected,
    selectedCount,
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
  const [isPrinting, setIsPrinting] = useState(false);
  const [zipProgress, setZipProgress] = useState(null);
  const [exportNotice, setExportNotice] = useState('');
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [searchQuery, selectedCampus, selectedGrade, photoFilter, selectedStudentId]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, selectedStudents.length));
        }
      },
      { rootMargin: '350px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [selectedStudents.length, visibleCount]);

  const handleSelectSpecificStudent = (sId) => {
    setSelectedStudentId(sId);
    setActiveSheetIndex(0);
    setVisibleCount(BATCH_SIZE);
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

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const visibleStudents = useMemo(() => selectedStudents.slice(0, visibleCount), [selectedStudents, visibleCount]);

  const masonryCols = useMemo(() => {
    if (orientation === 'horizontal') {
      if (sideMode === 'both') {
        return 'columns-1 min-[1780px]:columns-2';
      }
      return 'columns-1 md:columns-2 xl:columns-3 2xl:columns-4';
    }
    if (sideMode === 'both') {
      return 'columns-1 min-[1180px]:columns-2';
    }
    return 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6';
  }, [orientation, sideMode]);

  const handlePrintSheet = async (mode = 'current') => {
    try {
      setIsPrinting(true);
      if (mode === 'current') {
        if (!currentSheetStudents.length) return;
        setExportNotice(`Preparing print for Sheet ${safeSheetIndex + 1}...`);
        await printStudentCardsBackground({
          mode: 'current',
          currentSheetStudents,
          exportOptions: {
            sideMode,
            style: template,
            orientation,
            accentColor,
            institution
          }
        });
        setExportNotice('Print dialog ready!');
        setTimeout(() => setExportNotice(''), 3000);
      } else {
        setExportNotice(`Preparing high-resolution print stream for ${selectedCount} cards...`);
        await printStudentCardsBackground({
          mode: 'all',
          filterParams: {
            campusId: selectedCampus,
            gradeId: selectedGrade,
            searchQuery,
            photoFilter,
            selectedIds,
            isAllSelected,
            fallbackStudents: selectedStudents
          },
          exportOptions: {
            sideMode,
            style: template,
            orientation,
            accentColor,
            institution
          },
          onProgress: (p) => {
            setExportNotice(p.message);
          }
        });
        setExportNotice('Print dialog ready!');
        setTimeout(() => setExportNotice(''), 3000);
      }
    } catch (e) {
      console.error(e);
      setExportNotice(e.message || 'Print preparation failed');
      setTimeout(() => setExportNotice(''), 4000);
    } finally {
      setIsPrinting(false);
    }
  };

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
      setExportNotice('Sheet export failed');
      setTimeout(() => setExportNotice(''), 4000);
    } finally {
      setIsExportingSheet(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      setExportNotice('Connecting to server and rendering vector cards...');
      const count = await exportStudentCardsPdfBackground({
        filterParams: {
          campusId: selectedCampus,
          gradeId: selectedGrade,
          searchQuery,
          photoFilter,
          selectedIds,
          isAllSelected,
          fallbackStudents: selectedStudents
        },
        exportOptions: {
          sideMode,
          style: template,
          orientation,
          accentColor,
          institution,
          filename: `Student_ID_Cards_All_${selectedCount}_Cards_${orientation}.pdf`
        },
        onProgress: (p) => {
          setExportNotice(p.message);
        }
      });
      setExportNotice(`Exported all ${count} student card(s) successfully!`);
      setTimeout(() => setExportNotice(''), 4000);
    } catch (e) {
      console.error(e);
      setExportNotice(e.message || 'PDF Export failed');
      setTimeout(() => setExportNotice(''), 4000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportZip = async () => {
    try {
      setIsExportingZip(true);
      setZipProgress({ current: 0, total: selectedCount, percent: 1, stage: 'init' });
      const count = await exportStudentCardsZipBackground({
        filterParams: {
          campusId: selectedCampus,
          gradeId: selectedGrade,
          searchQuery,
          photoFilter,
          selectedIds,
          isAllSelected,
          fallbackStudents: selectedStudents
        },
        exportOptions: {
          sideMode,
          style: template,
          orientation,
          accentColor,
          institution
        },
        onProgress: (p) => {
          setZipProgress(p);
        }
      });
      setExportNotice(`Vendor package exported! ${count} card(s) saved in ZIP archive.`);
      setTimeout(() => setExportNotice(''), 5000);
    } catch (e) {
      console.error(e);
      setExportNotice(e.message || 'Vendor ZIP Export failed');
      setTimeout(() => setExportNotice(''), 4000);
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
        selectedCount={selectedCount}
        totalCount={totalCount || filteredStudents.length}
        onToggleSelectAll={handleToggleSelectAll}
        onPrintSheet={handlePrintSheet}
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

      {isPrinting && (
        <div className="p-3.5 rounded-2xl bg-surface dark:bg-[#181818] border border-primary/20 shadow-xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Printer className="w-4 h-4 animate-bounce" />
            <span>Preparing vector print stream...</span>
          </div>
          <span className="text-ink-muted">Native print dialog will open shortly</span>
        </div>
      )}

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
              Show All Students ({totalCount || filteredStudents.length})
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

      {loading ? (
        <div className="text-center py-16 text-xs text-ink-muted">
          Loading student directory &amp; generating cards...
        </div>
      ) : selectedStudents.length === 0 ? (
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
        <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-4 sm:p-6 shadow-sm print:hidden">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-line dark:border-line-dark text-xs text-ink-muted">
            <span className="font-semibold text-ink dark:text-white">
              Previewing {visibleStudents.length} of {selectedStudents.length} cards (Total Database: {totalCount || filteredStudents.length})
            </span>
            {visibleCount < selectedStudents.length && (
              <button
                type="button"
                onClick={() => setVisibleCount(selectedStudents.length)}
                className="text-primary hover:underline font-bold cursor-pointer"
              >
                Load More Preview ({selectedStudents.length - visibleCount})
              </button>
            )}
          </div>

          <Masonry cols={masonryCols}>
            {visibleStudents.map((student) => (
              <div key={student._id} className="flex justify-center transition-all duration-300 hover:-translate-y-1 max-w-full overflow-x-auto sm:overflow-visible">
                <UniversalIdCard
                  holder={student}
                  holderType="student"
                  template={template}
                  orientation={orientation}
                  accentColor={accentColor}
                  sideMode={sideMode}
                  institution={institution}
                  isSelected={selectedSet.has(student._id)}
                  onToggleSelect={() => handleToggleSelect(student._id)}
                />
              </div>
            ))}
          </Masonry>

          {visibleCount < selectedStudents.length && (
            <div ref={sentinelRef} className="pt-8 pb-4 text-center">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-surface-secondary dark:bg-[#181818] border border-line dark:border-white/10 shadow-xs text-xs text-ink-muted">
                <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Loading more cards...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {editingStudent && (
        <StudentCardEditModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={(updated) => {
            updateStudentInList(updated);
            setEditingStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentIdCardsPage;
