import { useState } from 'react';
import { Database, CheckCircle2 } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import api from '../../utils/axiosConfig';
import { useToast } from '../../context/ToastContext';
import MigrationEntitySelector from '../../components/admin/migration/MigrationEntitySelector';
import MigrationInputZone from '../../components/admin/migration/MigrationInputZone';
import MigrationPreviewTable from '../../components/admin/migration/MigrationPreviewTable';

const BulkMigrationPage = () => {
  const { selectedCampus } = useCampus();
  const { showToast } = useToast();
  const [selectedEntity, setSelectedEntity] = useState('students');
  const [parsing, setParsing] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [lastSummary, setLastSummary] = useState(null);

  const handleDownloadTemplate = async () => {
    try {
      const res = await api.get(`/bulk-migration/template/${selectedEntity}`);
      if (res.data?.success) {
        const { headers, samples } = res.data;
        const csvRows = [headers.join(',')];
        samples.forEach((s) => {
          csvRows.push(headers.map((h) => `"${s[h] !== undefined ? s[h] : ''}"`).join(','));
        });
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedEntity}_template.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        showToast(`Template downloaded for ${selectedEntity}`, 'success');
      }
    } catch {
      showToast('Failed to download template', 'error');
    }
  };

  const handleParse = async (rows) => {
    if (!rows || rows.length === 0) return showToast('No rows found in input data', 'warning');
    setParsing(true);
    setLastSummary(null);
    try {
      const res = await api.post('/bulk-migration/parse', { entity: selectedEntity, rows, campus_id: selectedCampus });
      if (res.data?.success) {
        setPreviewData(res.data);
        showToast(`Validated ${res.data.totalRows} rows (${res.data.validCount} valid)`, 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error validating batch', 'error');
    } finally {
      setParsing(false);
    }
  };

  const handleCellChange = (rowIdx, key, value) => {
    setPreviewData((prev) => {
      if (!prev) return prev;
      const nextRows = [...prev.rows];
      const targetRow = { ...nextRows[rowIdx], data: { ...nextRows[rowIdx].data, [key]: value } };
      nextRows[rowIdx] = targetRow;
      return { ...prev, rows: nextRows };
    });
  };

  const handleCommit = async () => {
    if (!previewData?.rows) return;
    setCommitting(true);
    try {
      const res = await api.post('/bulk-migration/execute', { entity: selectedEntity, rows: previewData.rows, campus_id: selectedCampus });
      if (res.data?.success) {
        setLastSummary(res.data);
        setPreviewData(null);
        showToast(res.data.message || 'Batch commit finished', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error committing batch', 'error');
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">2-Stage Bulk Data Migration Engine</h1>
            <p className="text-xs font-semibold text-ink-muted">Dry-run schema validation followed by transactional batch commit</p>
          </div>
        </div>
      </div>

      <MigrationEntitySelector
        selectedEntity={selectedEntity}
        onSelect={(ent) => { setSelectedEntity(ent); setPreviewData(null); setLastSummary(null); }}
        onDownloadTemplate={handleDownloadTemplate}
      />

      {lastSummary && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{lastSummary.message} (Imported: {lastSummary.importedCount}, Failed: {lastSummary.failedCount})</span>
        </div>
      )}

      <MigrationInputZone onParse={handleParse} loading={parsing} onClear={() => { setPreviewData(null); setLastSummary(null); }} />

      <MigrationPreviewTable previewData={previewData} onCommit={handleCommit} committing={committing} onCellChange={handleCellChange} />
    </div>
  );
};

export default BulkMigrationPage;
