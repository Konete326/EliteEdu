import { useState, useEffect } from 'react';
import api from '../../services/api';
import BulkImportEntityCards from '../../components/admin/bulkimport/BulkImportEntityCards';
import BulkImportSourcePanel from '../../components/admin/bulkimport/BulkImportSourcePanel';
import BulkImportPreviewTable from '../../components/admin/bulkimport/BulkImportPreviewTable';
import BulkImportResultsModal from '../../components/admin/bulkimport/BulkImportResultsModal';
import { useBulkImport } from '../../components/admin/bulkimport/useBulkImport';

const BulkDataImportPage = () => {
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('');

  useEffect(() => {
    api.get('/campuses').then((res) => {
      setCampuses(res.data?.campuses || res.data?.data || []);
    }).catch(() => {});
  }, []);

  const {
    activeEntity, setActiveEntity, rows, summary, validating, downloading, executing,
    modalOpen, setModalOpen, insertedCount, handleDownloadTemplate, handleValidateRows,
    handleUpdateRowCell, handleRemoveRow, handleExecuteImport, handleReset
  } = useBulkImport(selectedCampus);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-ink dark:text-ink-dark">Bulk Data Import & Migration Hub</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20">
              2-Stage Dry-Run Engine
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            Stage 1: Verify & sanitize records locally. Stage 2: Batch commit validated entities into EliteEdu.
          </p>
        </div>
      </div>

      <BulkImportEntityCards
        activeEntity={activeEntity}
        onSelectEntity={(ent) => { setActiveEntity(ent); handleReset(); }}
        disabled={validating || executing}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-4">
          <BulkImportSourcePanel
            onDownloadTemplate={handleDownloadTemplate}
            onValidateRows={handleValidateRows}
            validating={validating}
            downloading={downloading}
            campuses={campuses}
            selectedCampus={selectedCampus}
            setSelectedCampus={setSelectedCampus}
          />
        </div>

        <div className="lg:col-span-8">
          <BulkImportPreviewTable
            rows={rows}
            onUpdateRowCell={handleUpdateRowCell}
            onRemoveRow={handleRemoveRow}
            onExecuteImport={handleExecuteImport}
            executing={executing}
            summary={summary}
          />
        </div>
      </div>

      <BulkImportResultsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        entityType={activeEntity}
        insertedCount={insertedCount}
        onReset={handleReset}
      />
    </div>
  );
};

export default BulkDataImportPage;
