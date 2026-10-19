import { useState } from 'react';
import { Download, Search, RefreshCw } from 'lucide-react';
import { parseDelimitedText } from '../../../utils/csvParser';
import BulkImportDropzone from './BulkImportDropzone';

const BulkImportSourcePanel = ({
  onDownloadTemplate,
  onValidateRows,
  validating,
  downloading,
  campuses = [],
  selectedCampus,
  setSelectedCampus
}) => {
  const [mode, setMode] = useState('upload');
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState('');

  const handleManualParse = () => {
    if (!rawText.trim()) return;
    onValidateRows(parseDelimitedText(rawText));
  };

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line rounded-2xl p-5 shadow-sm space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">Step 1</span>
          <span className="text-[10px] text-ink-muted">Standard Format</span>
        </div>
        <button
          type="button"
          disabled={downloading}
          onClick={onDownloadTemplate}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          {downloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-ink dark:text-ink-dark">Target Branch / Campus</label>
        <select
          value={selectedCampus}
          onChange={(e) => setSelectedCampus(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-line bg-surface-secondary/40 text-xs font-semibold outline-none focus:border-primary"
        >
          <option value="">Default / School Scope</option>
          {campuses.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="pt-2 border-t border-line space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">Step 2: Source Data</span>
          <div className="flex items-center p-0.5 rounded-lg bg-surface-secondary dark:bg-white/5 border border-line">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${mode === 'upload' ? 'bg-surface dark:bg-surface-dark text-primary shadow-xs' : 'text-ink-muted'}`}
            >
              CSV File
            </button>
            <button
              type="button"
              onClick={() => setMode('paste')}
              className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${mode === 'paste' ? 'bg-surface dark:bg-surface-dark text-primary shadow-xs' : 'text-ink-muted'}`}
            >
              Paste Grid
            </button>
          </div>
        </div>

        {mode === 'upload' ? (
          <BulkImportDropzone onParsed={onValidateRows} fileName={fileName} setFileName={setFileName} />
        ) : (
          <div className="space-y-2">
            <textarea
              rows={5}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Copy rows from Excel and paste here (including headers)..."
              className="w-full p-2.5 rounded-xl border border-line bg-surface-secondary/40 text-xs font-mono outline-none focus:border-primary resize-none"
            />
            <button
              type="button"
              disabled={validating || !rawText.trim()}
              onClick={handleManualParse}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {validating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Validate & Preview Rows (Dry Run)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkImportSourcePanel;
