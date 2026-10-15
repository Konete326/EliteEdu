import { useState, useRef } from 'react';
import { FileText, Plus, Trash2, Paperclip, ExternalLink, Image as ImageIcon } from 'lucide-react';

const DocumentUploadList = ({ documents = [], onChange, title = 'Documents Repository' }) => {
  const [docTitle, setDocTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedFile({ name: file.name, data: ev.target.result });
      if (!docTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setDocTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAdd = () => {
    if (!selectedFile && !docTitle.trim()) return;
    onChange([...documents, {
      title: docTitle.trim() || selectedFile?.name || 'Document',
      file_url: selectedFile?.data || '',
      file_name: selectedFile?.name || 'Document',
      uploaded_at: new Date()
    }]);
    setDocTitle('');
    setSelectedFile(null);
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-line dark:border-white/10">
        <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
          <FileText className="w-4 h-4 text-primary" />
          <span>{title}</span>
        </div>
        <span className="text-xs text-ink-muted">{documents.length} attached</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <input
          type="text"
          value={docTitle}
          onChange={(e) => setDocTitle(e.target.value)}
          placeholder="Document Title (e.g. Degree / B-Form / CNIC)"
          className="flex-1 px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-xs text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" className="hidden" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-dashed border-primary/50 text-primary hover:bg-primary/10 text-xs font-semibold shrink-0"
        >
          <Paperclip className="w-3.5 h-3.5" />
          <span>{selectedFile ? selectedFile.name.slice(0, 16) + '...' : 'Choose File'}</span>
        </button>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedFile && !docTitle.trim()}
          className="px-4 py-2 rounded-xl bg-primary disabled:opacity-50 hover:bg-primary-hover text-white text-xs font-bold flex items-center justify-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {documents.length === 0 ? (
        <p className="text-xs text-ink-muted italic py-3 text-center">No files uploaded yet. Select a file and click Add.</p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                {doc.file_url?.startsWith('data:image/') ? <ImageIcon className="w-4 h-4 text-primary shrink-0" /> : <FileText className="w-4 h-4 text-primary shrink-0" />}
                <div className="truncate">
                  <p className="font-bold text-ink dark:text-ink-dark truncate">{doc.title}</p>
                  <p className="text-[10px] text-ink-muted truncate font-mono">{doc.file_name || 'Attached Document'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {doc.file_url && (
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-ink-sub hover:text-primary" title="View Document">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button type="button" onClick={() => onChange(documents.filter((_, i) => i !== idx))} className="p-1.5 rounded-lg text-bad hover:bg-bad-soft" title="Remove Document">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUploadList;
