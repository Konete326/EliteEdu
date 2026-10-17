import React, { useState } from 'react';
import { FileText, Plus, Trash2, Upload } from 'lucide-react';

const COMMON_DOCS = [
  'Birth Certificate', 'Nadra B-Form', 'Father CNIC Copy',
  'Previous School Leaving Certificate', 'Passport Size Photographs', 'Vaccination Card'
];

export default function CrmDocumentsTab({ documents = [], onChange }) {
  const [docTitle, setDocTitle] = useState('');
  const [docUrl, setDocUrl] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!docTitle.trim()) return;
    const newDoc = {
      title: docTitle.trim(),
      file_url: docUrl.trim() || 'Uploaded to physical file',
      uploaded_at: new Date()
    };
    onChange('documents', [...documents, newDoc]);
    setDocTitle('');
    setDocUrl('');
  };

  const handleRemove = (idx) => {
    onChange('documents', documents.filter((_, i) => i !== idx));
  };

  return (
    <div className="bg-surface dark:bg-surface-dark p-5 rounded-2xl border border-line dark:border-line-dark shadow-xs space-y-4 max-w-4xl">
      <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark flex items-center gap-2 border-b border-line dark:border-line-dark pb-2">
        <FileText className="w-4 h-4 text-primary" /> Attached Documentation
      </h3>

      <form onSubmit={handleAdd} className="p-3.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/20 space-y-3">
        <span className="text-xs font-bold text-text-primary dark:text-text-primary-dark">Add New Document Entry</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Document Title *</label>
            <input
              required
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="e.g. Birth Certificate"
              className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent"
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {COMMON_DOCS.map((doc) => (
                <button
                  key={doc}
                  type="button"
                  onClick={() => setDocTitle(doc)}
                  className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface-secondary/70 hover:bg-primary/20 text-text-muted hover:text-primary transition-colors"
                >
                  {doc}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">File URL / Reference</label>
            <input
              type="text"
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              placeholder="https://... or physical filing drawer code"
              className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent"
            />
          </div>
        </div>
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-xs cursor-pointer"
          >
            <Plus size={13} /> Attach Document
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {documents.length === 0 ? (
          <p className="text-xs text-text-muted py-6 text-center">No documents attached yet.</p>
        ) : (
          documents.map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <div>
                  <h4 className="font-bold text-text-primary dark:text-text-primary-dark">{doc.title}</h4>
                  <span className="text-[11px] text-text-muted font-mono">{doc.file_url}</span>
                </div>
              </div>
              <button type="button" onClick={() => handleRemove(idx)} className="text-bad hover:opacity-80 p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
