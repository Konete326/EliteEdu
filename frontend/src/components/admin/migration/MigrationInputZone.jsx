import { useState } from 'react';
import { UploadCloud, FileSpreadsheet, Play, RotateCcw } from 'lucide-react';

const parseRawData = (text) => {
  const lines = text.trim().split('\n').filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const values = line.split(delimiter).map((v) => v.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i] !== undefined ? values[i] : ''; });
    return obj;
  });
};

const MigrationInputZone = ({ onParse, loading, onClear }) => {
  const [rawText, setRawText] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result || '';
      setRawText(content);
    };
    reader.readAsText(file);
  };

  const handleRun = () => {
    const rows = parseRawData(rawText);
    onParse(rows);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Upload File or Paste Grid Data
        </h4>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-3 py-1.5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-gray-200 dark:border-gray-600">
            <UploadCloud className="w-3.5 h-3.5" /> Upload CSV
            <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={() => { setRawText(''); onClear(); }}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <textarea
        rows={6}
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Paste CSV rows or tab-separated Excel table here (including headers)..."
        className="w-full p-3 font-mono text-xs border rounded-xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex justify-end">
        <button
          onClick={handleRun}
          disabled={loading || !rawText.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm"
        >
          <Play className="w-3.5 h-3.5" /> Stage 1: Parse & Validate (Dry-Run)
        </button>
      </div>
    </div>
  );
};

export default MigrationInputZone;
