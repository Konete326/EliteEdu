import { useState, useCallback } from 'react';
import api from '../../../services/api';
import { downloadCsvTemplate } from '../../../utils/csvParser';

export const useBulkImport = (selectedCampus) => {
  const [activeEntity, setActiveEntity] = useState('students');
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({ total: 0, validCount: 0, errorCount: 0 });
  const [validating, setValidating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [insertedCount, setInsertedCount] = useState(0);

  const handleDownloadTemplate = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/bulk-import/template/${activeEntity}`);
      if (res.data?.success) {
        downloadCsvTemplate(res.data.headers, res.data.samples, `${activeEntity}_template.csv`);
      }
    } catch {} finally {
      setDownloading(false);
    }
  };

  const handleValidateRows = useCallback(async (parsedRows) => {
    if (!parsedRows || parsedRows.length === 0) return;
    setValidating(true);
    try {
      const res = await api.post('/bulk-import/parse', {
        entityType: activeEntity,
        rows: parsedRows,
        campus_id: selectedCampus || null
      });
      if (res.data?.success) {
        const combined = [...(res.data.validRows || []), ...(res.data.invalidRows || [])];
        combined.sort((a, b) => a.rowIndex - b.rowIndex);
        setRows(combined);
        setSummary(res.data.summary || { total: combined.length, validCount: res.data.validRows?.length || 0, errorCount: res.data.invalidRows?.length || 0 });
      }
    } catch {} finally {
      setValidating(false);
    }
  }, [activeEntity, selectedCampus]);

  const handleUpdateRowCell = (rowIndex, col, value) => {
    const updated = rows.map((r) => r.rowIndex === rowIndex ? { ...r, data: { ...r.data, [col]: value } } : r);
    setRows(updated);
  };

  const handleRemoveRow = (rowIndex) => {
    const updated = rows.filter((r) => r.rowIndex !== rowIndex);
    const validCount = updated.filter((r) => r.isValid).length;
    setRows(updated);
    setSummary({ total: updated.length, validCount, errorCount: updated.length - validCount });
  };

  const handleExecuteImport = async () => {
    const validRows = rows.filter((r) => r.isValid);
    if (validRows.length === 0) return;
    setExecuting(true);
    try {
      const res = await api.post('/bulk-import/execute', {
        entityType: activeEntity,
        validRows,
        campus_id: selectedCampus || null
      });
      if (res.data?.success) {
        setInsertedCount(res.data.insertedCount);
        setModalOpen(true);
      }
    } catch {} finally {
      setExecuting(false);
    }
  };

  const handleReset = () => {
    setModalOpen(false);
    setRows([]);
    setSummary({ total: 0, validCount: 0, errorCount: 0 });
  };

  return {
    activeEntity,
    setActiveEntity,
    rows,
    summary,
    validating,
    downloading,
    executing,
    modalOpen,
    setModalOpen,
    insertedCount,
    handleDownloadTemplate,
    handleValidateRows,
    handleUpdateRowCell,
    handleRemoveRow,
    handleExecuteImport,
    handleReset
  };
};

export default useBulkImport;
