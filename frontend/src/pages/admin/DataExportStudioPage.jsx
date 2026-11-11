import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileCode,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  GraduationCap,
  Users,
  CalendarCheck,
  BookOpen,
  HelpCircle,
  Archive
} from 'lucide-react';
import MobileTabStepper from '../../components/common/MobileTabStepper';
import { useAuth } from '../../context/AuthContext';
import { useCampus } from '../../context/CampusContext';
import { useToast } from '../../context/ToastContext';
import { DATASET_DEFINITIONS } from '../../utils/exportDatasetFormatters';
import {
  exportToExcel,
  exportToCsv,
  exportToWord,
  exportToText,
  exportToJson
} from '../../utils/multiFormatExporter';

const getDatasetIcon = (id) => {
  switch (id) {
    case 'students':
      return GraduationCap;
    case 'teachers':
      return Users;
    case 'applicants':
      return HelpCircle;
    case 'classes':
      return Layers;
    case 'subjects':
      return BookOpen;
    case 'campuses':
      return Building2;
    case 'attendance':
      return CalendarCheck;
    default:
      return FileSpreadsheet;
  }
};

const DataExportStudioPage = () => {
  const [searchParams] = useSearchParams();
  const highlightedDataset = searchParams.get('dataset');
  const { user } = useAuth();
  const { campuses } = useCampus();
  const { showSuccess, showError } = useToast();

  const isGovt = user?.school_type === 'Government' || user?.school_id?.school_type === 'Government';

  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [attendanceScope, setAttendanceScope] = useState('full');
  const [loadingMap, setLoadingMap] = useState({});
  const [batchLoading, setBatchLoading] = useState(false);

  const categories = ['all', 'Academic', 'HR & Staff', 'Admissions', 'Structure', 'Operations'];

  const filteredDatasets = DATASET_DEFINITIONS.filter((ds) => {
    if (selectedCategory !== 'all' && ds.category !== selectedCategory) return false;
    return true;
  });

  const handleExport = async (dataset, format) => {
    const key = `${dataset.id}_${format}`;
    setLoadingMap((prev) => ({ ...prev, [key]: true }));

    try {
      const rows = await dataset.fetcher({
        campus: selectedCampus,
        status: selectedStatus,
        attendanceScope
      }, isGovt);

      if (!rows || rows.length === 0) {
        showError(`No records found for ${dataset.name} to export.`);
        setLoadingMap((prev) => ({ ...prev, [key]: false }));
        return;
      }

      const columns = typeof dataset.columns === 'function' ? dataset.columns(isGovt) : dataset.columns;
      const baseFilename = `${dataset.defaultFilename}_${new Date().toISOString().split('T')[0]}`;

      if (format === 'xls') {
        await exportToExcel(dataset.name, columns, rows, `${baseFilename}.xls`);
      } else if (format === 'csv') {
        await exportToCsv(columns, rows, `${baseFilename}.csv`);
      } else if (format === 'doc') {
        await exportToWord(dataset.name, columns, rows, `${baseFilename}.doc`);
      } else if (format === 'txt') {
        await exportToText(dataset.name, columns, rows, `${baseFilename}.txt`);
      } else if (format === 'json') {
        exportToJson(dataset.name, dataset.id, rows, `${baseFilename}.json`);
      }

      showSuccess(`${dataset.name} exported successfully (${rows.length} records) as .${format.toUpperCase()}`);
    } catch (err) {
      showError(err.message || `Failed to export ${dataset.name}`);
    } finally {
      setLoadingMap((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleExportAll = async (format = 'xls') => {
    setBatchLoading(true);
    let successCount = 0;

    for (const dataset of DATASET_DEFINITIONS) {
      try {
        const rows = await dataset.fetcher({
          campus: selectedCampus,
          status: selectedStatus,
          attendanceScope
        }, isGovt);

        if (rows && rows.length > 0) {
          const columns = typeof dataset.columns === 'function' ? dataset.columns(isGovt) : dataset.columns;
          const baseFilename = `${dataset.defaultFilename}_${new Date().toISOString().split('T')[0]}`;
          if (format === 'xls') {
            await exportToExcel(dataset.name, columns, rows, `${baseFilename}.xls`);
          } else if (format === 'csv') {
            await exportToCsv(columns, rows, `${baseFilename}.csv`);
          } else if (format === 'json') {
            exportToJson(dataset.name, dataset.id, rows, `${baseFilename}.json`);
          }
          successCount++;
          await new Promise((r) => setTimeout(r, 300));
        }
      } catch (err) {}
    }

    setBatchLoading(false);
    showSuccess(`Bulk export completed: ${successCount} datasets downloaded.`);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      <div className="p-4 sm:p-6 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-primary/10 text-primary dark:text-primary-dark flex items-center justify-center font-bold shrink-0 border border-primary/20">
            <Archive className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-black text-ink dark:text-white tracking-tight">
                Data Export Center &amp; Archive Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Live Studio
              </span>
            </div>
            <p className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark mt-0.5">
              Export institutional registries across Excel, Word, CSV, JSON and Plain Text with Pakistani standard formatting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={batchLoading}
            onClick={() => handleExportAll('xls')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-primary/20 cursor-pointer disabled:opacity-50"
          >
            {batchLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            <span>Export All (Excel Bundle)</span>
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 shadow-xs flex flex-col gap-3">
        <MobileTabStepper
          tabs={[
            { id: 'all', label: 'All Datasets' },
            { id: 'Academic', label: 'Academic' },
            { id: 'HR & Staff', label: 'HR & Staff' },
            { id: 'Admissions', label: 'Admissions' },
            { id: 'Structure', label: 'Structure' },
            { id: 'Operations', label: 'Operations' }
          ]}
          activeTab={selectedCategory}
          onChange={setSelectedCategory}
        />

        <div className="flex items-center gap-2 flex-wrap justify-end pt-1 border-t border-line/60 dark:border-white/5">
          {campuses && campuses.length > 0 && (
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-surface-secondary/60 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-white outline-none focus:border-primary transition-all font-medium cursor-pointer"
            >
              <option value="all">All Campuses</option>
              {campuses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs bg-surface-secondary/60 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-white outline-none focus:border-primary transition-all font-medium cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive / Left</option>
          </select>

          <select
            value={attendanceScope}
            onChange={(e) => setAttendanceScope(e.target.value)}
            title="Attendance Scope"
            className="px-3 py-1.5 rounded-xl text-xs bg-surface-secondary/60 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-white outline-none focus:border-primary transition-all font-medium cursor-pointer"
          >
            <option value="full">Roll Call: Full (Marked + Pending)</option>
            <option value="marked">Roll Call: Marked Only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDatasets.map((dataset) => {
          const Icon = getDatasetIcon(dataset.id);
          const isHighlighted = highlightedDataset === dataset.id;
          const cols = typeof dataset.columns === 'function' ? dataset.columns(isGovt) : dataset.columns;

          return (
            <div
              key={dataset.id}
              className={`p-4 sm:p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border transition-all flex flex-col justify-between shadow-xs ${
                isHighlighted
                  ? 'border-primary ring-2 ring-primary/20 bg-primary/5 dark:bg-primary/10'
                  : 'border-line dark:border-white/10 hover:border-line-hover dark:hover:border-white/20'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-primary-dark flex items-center justify-center shrink-0 border border-primary/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink dark:text-white">
                        {dataset.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider">
                        {dataset.category}
                      </span>
                    </div>
                  </div>
                  {isHighlighted && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary text-white">
                      Selected
                    </span>
                  )}
                </div>

                <p className="text-xs text-ink-muted dark:text-ink-muted-dark leading-relaxed">
                  {dataset.description}
                </p>

                {dataset.id === 'attendance' && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-semibold text-primary dark:text-primary-dark">
                    <span>Scope:</span>
                    <span className="font-bold">
                      {attendanceScope === 'full' ? 'Full Daily Roll Call (Marked + Pending)' : 'Marked Only'}
                    </span>
                  </div>
                )}

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-ink-sub dark:text-ink-sub-dark uppercase tracking-wider block">
                    Columns Included ({cols.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cols.slice(0, 6).map((c) => (
                      <span
                        key={c.key}
                        className="px-2 py-0.5 rounded-md bg-surface-secondary/70 dark:bg-[#161616] border border-line/60 dark:border-white/5 text-[10px] font-medium text-ink-sub dark:text-ink-muted-dark"
                      >
                        {c.header}
                      </span>
                    ))}
                    {cols.length > 6 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-ink-muted dark:text-ink-muted-dark font-medium">
                        +{cols.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-line/60 dark:border-white/5 space-y-2">
                <span className="text-[10px] font-bold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider block">
                  Download Formats
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  <button
                    type="button"
                    title="Export as Microsoft Excel (.xls)"
                    disabled={loadingMap[`${dataset.id}_xls`]}
                    onClick={() => handleExport(dataset, 'xls')}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingMap[`${dataset.id}_xls`] ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mb-0.5" />
                    ) : (
                      <FileSpreadsheet className="w-3.5 h-3.5 mb-0.5" />
                    )}
                    <span>.XLS</span>
                  </button>

                  <button
                    type="button"
                    title="Export as CSV (.csv)"
                    disabled={loadingMap[`${dataset.id}_csv`]}
                    onClick={() => handleExport(dataset, 'csv')}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[10px] font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingMap[`${dataset.id}_csv`] ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mb-0.5" />
                    ) : (
                      <FileSpreadsheet className="w-3.5 h-3.5 mb-0.5" />
                    )}
                    <span>.CSV</span>
                  </button>

                  <button
                    type="button"
                    title="Export as Microsoft Word (.doc)"
                    disabled={loadingMap[`${dataset.id}_doc`]}
                    onClick={() => handleExport(dataset, 'doc')}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingMap[`${dataset.id}_doc`] ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mb-0.5" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 mb-0.5" />
                    )}
                    <span>.DOC</span>
                  </button>

                  <button
                    type="button"
                    title="Export as Plain Text Report (.txt)"
                    disabled={loadingMap[`${dataset.id}_txt`]}
                    onClick={() => handleExport(dataset, 'txt')}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/60 dark:bg-[#161616] hover:bg-surface-secondary text-ink dark:text-white text-[10px] font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingMap[`${dataset.id}_txt`] ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mb-0.5" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 mb-0.5" />
                    )}
                    <span>.TXT</span>
                  </button>

                  <button
                    type="button"
                    title="Export as JSON (.json)"
                    disabled={loadingMap[`${dataset.id}_json`]}
                    onClick={() => handleExport(dataset, 'json')}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingMap[`${dataset.id}_json`] ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mb-0.5" />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 mb-0.5" />
                    )}
                    <span>.JSON</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataExportStudioPage;

