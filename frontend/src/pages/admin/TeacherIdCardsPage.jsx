import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import TeacherIdCardModernToolbar from '../../components/admin/teachers/idcards/TeacherIdCardModernToolbar';
import UniversalIdCard from '../../components/common/idcards/UniversalIdCard';
import useIdCardInstitution from '../../components/common/idcards/useIdCardInstitution';
import TeacherCardEditModal from '../../components/admin/teachers/idcards/TeacherCardEditModal';
import { useTeacherIdCardsData } from '../../components/admin/teachers/idcards/useTeacherIdCardsData';
import {
  exportTeacherCardsPdfBackground,
  exportTeacherCardsZipBackground,
  printTeacherCardsBackground
} from '../../services/idCardExportService';
import { Masonry } from '../../components/ui/responsive-masonry-layout';
import { UserCheck, Sparkles, CheckCircle2, Printer } from 'lucide-react';

const BATCH_SIZE = 24;

const TeacherIdCardsPage = () => {
  const [searchParams] = useSearchParams();
  const initialTeacherId = searchParams.get('teacherId');

  const {
    campuses,
    loading,
    totalCount,
    isAllSelected,
    selectedCount,
    searchQuery,
    setSearchQuery,
    selectedCampus,
    setSelectedCampus,
    selectedIds,
    setSelectedIds,
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
  const [sideMode, setSideMode] = useState('front');
  const [selectedTeacherId, setSelectedTeacherId] = useState(initialTeacherId || 'all');
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [exportNotice, setExportNotice] = useState('');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [searchQuery, selectedCampus, selectedTeacherId]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, selectedTeachers.length));
        }
      },
      { rootMargin: '350px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [selectedTeachers.length, visibleCount]);

  const handleSelectSpecificTeacher = (tId) => {
    setSelectedTeacherId(tId);
    setVisibleCount(BATCH_SIZE);
    if (tId === 'all') {
      setSelectedIds(filteredTeachers.map((t) => t._id));
    } else {
      setSelectedIds([tId]);
    }
  };

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const visibleTeachers = useMemo(() => selectedTeachers.slice(0, visibleCount), [selectedTeachers, visibleCount]);

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

  const handlePrintSheet = async (mode = 'all') => {
    try {
      setIsPrinting(true);
      setExportNotice(`Preparing printable vector sheet for ${selectedCount} faculty cards...`);
      await printTeacherCardsBackground({
        mode: 'all',
        filterParams: {
          campusId: selectedCampus,
          searchQuery,
          selectedIds,
          isAllSelected: isAllSelected || selectedIds.length === filteredTeachers.length,
          fallbackTeachers: selectedTeachers
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
    } catch (e) {
      console.error(e);
      setExportNotice(e.message || 'Print failed');
      setTimeout(() => setExportNotice(''), 4000);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      setExportNotice('Connecting to database and generating faculty cards...');
      const count = await exportTeacherCardsPdfBackground({
        filterParams: {
          campusId: selectedCampus,
          searchQuery,
          selectedIds,
          isAllSelected: isAllSelected || selectedIds.length === filteredTeachers.length,
          fallbackTeachers: selectedTeachers
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
      setExportNotice(`Exported ${count} faculty card(s) successfully!`);
      setTimeout(() => setExportNotice(''), 4000);
    } catch (e) {
      console.error(e);
      setExportNotice(e.message || 'Export failed');
      setTimeout(() => setExportNotice(''), 4000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportZip = async () => {
    try {
      setIsExportingZip(true);
      setExportNotice('Packing vendor ZIP package...');
      const count = await exportTeacherCardsZipBackground({
        filterParams: {
          campusId: selectedCampus,
          searchQuery,
          selectedIds,
          isAllSelected: isAllSelected || selectedIds.length === filteredTeachers.length,
          fallbackTeachers: selectedTeachers
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
      setExportNotice(`Vendor package exported! ${count} faculty card(s) saved in ZIP.`);
      setTimeout(() => setExportNotice(''), 5000);
    } catch (e) {
      console.error(e);
      setExportNotice(e.message || 'ZIP Export failed');
      setTimeout(() => setExportNotice(''), 4000);
    } finally {
      setIsExportingZip(false);
    }
  };

  const singleSelectedTeacher = selectedTeachers.length === 1 ? selectedTeachers[0] : null;

  return (
    <div className="space-y-6">
      <TeacherIdCardModernToolbar
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
        teachers={filteredTeachers}
        selectedTeacherId={selectedTeacherId}
        onSelectSpecificTeacher={handleSelectSpecificTeacher}
        selectedCount={selectedCount}
        totalCount={totalCount}
        onToggleSelectAll={handleToggleSelectAll}
        onPrintSheet={handlePrintSheet}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
        onExportZip={handleExportZip}
        isExportingZip={isExportingZip}
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

      {singleSelectedTeacher && (
        <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-ink dark:text-white">
                Individual Print Mode: <span className="text-primary">{singleSelectedTeacher.name}</span>
              </p>
              <p className="text-[11px] text-ink-muted">
                {singleSelectedTeacher.designation || 'Faculty'} • ID: {singleSelectedTeacher.employee_code || singleSelectedTeacher.personal_id || '—'} • {singleSelectedTeacher.campus_id?.name || 'Main Campus'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectSpecificTeacher('all')}
              className="px-3 py-1.5 rounded-xl border border-primary/30 text-primary hover:bg-primary/15 font-bold transition-all cursor-pointer text-xs"
            >
              Show All Faculty ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setEditingTeacher(singleSelectedTeacher)}
              className="px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold transition-all cursor-pointer text-xs"
            >
              Edit Card Data
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-xs text-ink-muted">
          Loading faculty records &amp; generating cards...
        </div>
      ) : selectedTeachers.length === 0 ? (
        <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-12 text-center text-xs text-ink-muted space-y-2">
          <Sparkles className="w-8 h-8 text-primary mx-auto opacity-40" />
          <p className="font-bold text-sm text-ink dark:text-white">No faculty cards selected</p>
          <p className="max-w-sm mx-auto text-ink-muted">
            {searchQuery
              ? `No teacher matched "${searchQuery}".`
              : 'Pick a faculty member from the dropdown or click "Select All" to preview.'}
          </p>
        </div>
      ) : (
        <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-4 sm:p-6 shadow-sm print:hidden">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-line dark:border-line-dark text-xs text-ink-muted">
            <span className="font-semibold text-ink dark:text-white">
              Previewing {visibleTeachers.length} of {selectedTeachers.length} faculty cards (Total: {totalCount})
            </span>
            {visibleCount < selectedTeachers.length && (
              <button
                type="button"
                onClick={() => setVisibleCount(selectedTeachers.length)}
                className="text-primary hover:underline font-bold cursor-pointer"
              >
                Load More ({selectedTeachers.length - visibleCount})
              </button>
            )}
          </div>

          <Masonry cols={masonryCols}>
            {visibleTeachers.map((teacher) => (
              <div key={teacher._id} className="flex justify-center transition-all duration-300 hover:-translate-y-1 max-w-full overflow-x-auto sm:overflow-visible">
                <UniversalIdCard
                  holder={teacher}
                  holderType="teacher"
                  template={template}
                  orientation={orientation}
                  accentColor={accentColor}
                  sideMode={sideMode}
                  institution={institution}
                  isSelected={selectedSet.has(teacher._id)}
                  onToggleSelect={() => handleToggleSelect(teacher._id)}
                />
              </div>
            ))}
          </Masonry>

          {visibleCount < selectedTeachers.length && (
            <div ref={sentinelRef} className="pt-8 pb-4 text-center">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-surface-secondary dark:bg-[#181818] border border-line dark:border-white/10 shadow-xs text-xs text-ink-muted">
                <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Loading more faculty cards...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {editingTeacher && (
        <TeacherCardEditModal
          teacher={editingTeacher}
          onClose={() => setEditingTeacher(null)}
          onSave={(updated) => {
            updateTeacherInList(updated);
            setEditingTeacher(null);
          }}
        />
      )}
    </div>
  );
};

export default TeacherIdCardsPage;
