import React from 'react';
import ClassTestFilterBar from './ClassTestFilterBar';
import ClassTestTable from './ClassTestTable';
import ClassTestMarksSheet from './ClassTestMarksSheet';

export default function ClassTestListAndSheet({ tests = [], page = 1, total = 0, totalPages = 1, onPageChange, filters, setFilters, onResetFilters, prereqs, activeView, setActiveView, activeTest, onSelectTest, onEditTest, onDeleteTest, onPrintTest, sheetRows, setSheetRows, onSaveMarks, isSavingMarks, onBackToList }) {
  return (
    <div className="space-y-4">
      <ClassTestFilterBar filters={filters} setFilters={setFilters} onReset={onResetFilters} prereqs={prereqs} activeView={activeView} setActiveView={setActiveView} activeTest={activeTest} />

      {activeView === 'sheet' && activeTest ? (
        <ClassTestMarksSheet test={activeTest} rows={sheetRows} setRows={setSheetRows} onSave={onSaveMarks} isSaving={isSavingMarks} onBack={onBackToList} onPrint={() => onPrintTest(activeTest)} />
      ) : (
        <ClassTestTable tests={tests} page={page} total={total} totalPages={totalPages} onPageChange={onPageChange} onSelectTest={onSelectTest} onEditTest={onEditTest} onDeleteTest={onDeleteTest} onPrintTest={onPrintTest} />
      )}
    </div>
  );
}
