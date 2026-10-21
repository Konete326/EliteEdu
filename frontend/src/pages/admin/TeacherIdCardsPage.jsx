import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import TeacherIdCardModernToolbar from '../../components/admin/teachers/idcards/TeacherIdCardModernToolbar';
import UniversalIdCardSheet from '../../components/common/idcards/UniversalIdCardSheet';
import useIdCardInstitution from '../../components/common/idcards/useIdCardInstitution';
import TeacherCardEditModal from '../../components/admin/teachers/idcards/TeacherCardEditModal';
import { useTeacherIdCardsData } from '../../components/admin/teachers/idcards/useTeacherIdCardsData';
import { exportTeacherCardsPdf } from '../../utils/pdf/teacherCardPdfExporter';
import { UserCheck, Sparkles, CheckCircle2 } from 'lucide-react';

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
  const [exportNotice, setExportNotice] = useState('');

  const handleSelectSpecificTeacher = (tId) => {
    setSelectedTeacherId(tId);
    if (tId === 'all') {
      setSelectedIds(filteredTeachers.map((t) => t._id));
    } else {
      setSelectedIds([tId]);
    }
  };

  const chunkSize = orientation === 'horizontal' ? 6 : 3;
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
      await exportTeacherCardsPdf(selectedTeachers, {
        sideMode,
        style: template,
        orientation,
        accentColor,
        institution
      });
      setExportNotice(`Exported ${selectedTeachers.length} card(s) successfully!`);
      setTimeout(() => setExportNotice(''), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
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
        selectedCount={selectedTeachers.length}
        totalCount={filteredTeachers.length}
        onToggleSelectAll={handleToggleSelectAll}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
      />

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
        <div className="print:hidden p-3 rounded-2xl bg-primary/10 border border-primary/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-ink dark:text-white">
                Individual Print Mode: <span className="text-primary">{singleSelectedTeacher.name}</span>
              </p>
              <p className="text-[11px] text-ink-muted">
                {singleSelectedTeacher.designation || 'Staff'} • Code: {singleSelectedTeacher.employee_code || singleSelectedTeacher.personal_id || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectSpecificTeacher('all')}
              className="px-3 py-1.5 rounded-xl border border-primary/30 text-primary hover:bg-primary/15 font-bold transition-all cursor-pointer text-xs"
            >
              Show All Faculty ({filteredTeachers.length})
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

      <TeacherCardEditModal
        isOpen={Boolean(editingTeacher)}
        teacher={editingTeacher}
        onClose={() => setEditingTeacher(null)}
        onSaveSuccess={(updated) => updateTeacherInList(updated)}
      />

      {loading ? (
        <div className="text-center py-16 text-xs text-ink-muted">
          Loading faculty records &amp; service cards...
        </div>
      ) : chunks.length === 0 ? (
        <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-12 text-center text-xs text-ink-muted space-y-2">
          <Sparkles className="w-8 h-8 text-primary mx-auto opacity-40" />
          <p className="font-bold text-sm text-ink dark:text-white">No faculty cards selected</p>
          <p className="max-w-sm mx-auto text-ink-muted">
            {searchQuery
              ? `No staff matched "${searchQuery}".`
              : 'Pick a faculty member from the dropdown or click "Select All" to preview ID cards.'}
          </p>
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