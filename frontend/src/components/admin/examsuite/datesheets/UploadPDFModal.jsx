import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';

const UploadPDFModal = ({ isOpen, onClose, onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUploadComplete(selectedFile.name);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-white">Upload Datesheet / Syllabus PDF</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-slate-50/50 dark:bg-slate-800/30">
            <Upload size={32} className="text-primary mb-2" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {selectedFile ? selectedFile.name : 'Click to select or drag PDF file'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">PDF documents up to 10MB</span>
            <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300">Cancel</button>
            <button type="button" disabled={!selectedFile} onClick={handleUpload} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-primary text-white hover:bg-primary-hover disabled:opacity-50">
              <FileText size={14} /> Attach File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPDFModal;
