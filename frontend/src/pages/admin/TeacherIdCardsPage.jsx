import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TeacherIdCardsToolbar from '../../components/admin/teachers/idcards/TeacherIdCardsToolbar';
import TeacherServiceCardsSheet from '../../components/admin/teachers/idcards/TeacherServiceCardsSheet';
import TeacherCardEditModal from '../../components/admin/teachers/idcards/TeacherCardEditModal';
import { useTeacherIdCardsData } from '../../components/admin/teachers/idcards/useTeacherIdCardsData';

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
    chunks,
    handleToggleSelect,
    handleToggleSelectAll,
    updateTeacherInList
  } = useTeacherIdCardsData(initialTeacherId);

  const [selectedStyle, setSelectedStyle] = useState('GovtSindh');
  const [sideMode, setSideMode] = useState('both');
  const [editingTeacher, setEditingTeacher] = useState(null);

  return (
    <div className="space-y-6">
      <TeacherIdCardsToolbar
        selectedStyle={selectedStyle}
        onSelectStyle={setSelectedStyle}
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
      />

      <TeacherCardEditModal
        isOpen={Boolean(editingTeacher)}
        teacher={editingTeacher}
        onClose={() => setEditingTeacher(null)}
        onSaveSuccess={(updated) => updateTeacherInList(updated)}
      />

      {loading ? (
        <div className="text-center py-16 text-xs text-ink-muted">Loading staff records & service cards...</div>
      ) : chunks.length === 0 ? (
        <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-12 text-center text-xs text-ink-muted">
          No faculty members selected or found matching criteria.
        </div>
      ) : (
        <div className="space-y-8">
          {chunks.map((chunk, idx) => (
            <TeacherServiceCardsSheet
              key={idx}
              teachers={chunk}
              pageIndex={idx}
              totalSheets={chunks.length}
              selectedStyle={selectedStyle}
              sideMode={sideMode}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onEditTeacher={(t) => setEditingTeacher(t)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherIdCardsPage;
