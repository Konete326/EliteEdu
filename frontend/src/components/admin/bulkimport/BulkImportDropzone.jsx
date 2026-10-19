import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { parseDelimitedText } from '../../../utils/csvParser';

const BulkImportDropzone = ({ onParsed, fileName, setFileName }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result || '';
      onParsed(parseDelimitedText(String(text)));
    };
    reader.readAsText(file);
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="border-2 border-dashed border-line hover:border-primary/50 rounded-xl p-5 text-center cursor-pointer bg-surface-secondary/20 hover:bg-surface-secondary/40 transition-all space-y-2"
    >
      <input ref={fileInputRef} type="file" accept=".csv,.tsv,.txt" onChange={handleFileChange} className="hidden" />
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
        <Upload className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-bold text-ink dark:text-ink-dark">{fileName || 'Choose or Drag CSV File'}</p>
        <p className="text-[10px] text-ink-muted mt-0.5">Click to browse from your device</p>
      </div>
    </div>
  );
};

export default BulkImportDropzone;
