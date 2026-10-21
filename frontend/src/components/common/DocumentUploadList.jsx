import { useState, useRef } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Paperclip,
  ExternalLink,
  Image as ImageIcon,
  Download,
  Pencil,
  X,
  FileCheck,
  Calendar,
  FolderOpen
} from 'lucide-react';

const CATEGORIES = [
  'Educational Degree',
  'National ID / CNIC',
  'Experience Certificate',
  'Appointment / Offer Letter',
  'CV / Resume',
  'Police Clearance',
  'Medical Certificate',
  'Other Document'
];

const DocumentUploadList = ({
  documents = [],
  onChange,
  title = 'Documents Repository'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Educational Degree');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setDocTitle('');
    setDocCategory('Educational Degree');
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc, idx) => {
    setEditingIndex(idx);
    setDocTitle(doc.title || '');
    setDocCategory(doc.category || 'Other Document');
    setSelectedFile(doc.file_url ? { name: doc.file_name || 'Document', data: doc.file_url } : null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        data: ev.target.result
      });
      if (!docTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setDocTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = () => {
    if (!docTitle.trim()) return;

    if (editingIndex !== null) {
      const updated = [...documents];
      updated[editingIndex] = {
        ...updated[editingIndex],
        title: docTitle.trim(),
        category: docCategory,
        ...(selectedFile?.data && !selectedFile.data.startsWith('http')
          ? { file_url: selectedFile.data, file_name: selectedFile.name }
          : {})
      };
      onChange(updated);
    } else {
      const newDoc = {
        title: docTitle.trim(),
        category: docCategory,
        file_url: selectedFile?.data || '',
        file_name: selectedFile?.name || 'Attached File',
        file_size: selectedFile?.size || '—',
        uploaded_at: new Date().toISOString()
      };
      onChange([...documents, newDoc]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (idx) => {
    onChange(documents.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 border border-primary/20">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-white">{title}</h3>
            <p className="text-[11px] text-ink-muted">
              {documents.length} verified credential(s) and file attachment(s)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-secondary dark:bg-[#181818] text-ink-muted flex items-center justify-center mx-auto border border-line dark:border-white/10">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-xs text-ink dark:text-white">No documents attached</p>
            <p className="text-[11px] text-ink-muted max-w-sm mx-auto mt-0.5">
              Upload academic degrees, certificates, National ID card scans or employment contracts.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/40 text-primary hover:bg-primary/10 text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload First Document</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line dark:border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/70 dark:bg-[#141414] text-[10px] font-bold text-ink-muted uppercase tracking-wider border-b border-line dark:border-white/10">
              <tr>
                <th className="px-4 py-3">Document Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">File Name</th>
                <th className="px-4 py-3">Uploaded Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 dark:divide-white/5 bg-surface dark:bg-[#0c0c0c]">
              {documents.map((doc, idx) => {
                const isImage = doc.file_url?.startsWith('data:image/') || /\.(jpg|jpeg|png|webp)$/i.test(doc.file_url || '');
                const dateStr = doc.uploaded_at
                  ? new Date(doc.uploaded_at).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
                  : '—';

                return (
                  <tr key={idx} className="hover:bg-surface-secondary/40 dark:hover:bg-[#141414] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                          {isImage ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-ink dark:text-white truncate max-w-[200px]">{doc.title}</p>
                          <span className="text-[10px] text-ink-muted block truncate font-mono">
                            {doc.file_size || 'Verified file'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                        {doc.category || 'General'}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px] text-ink-muted truncate max-w-[160px]">
                      {doc.file_name || 'Document'}
                    </td>

                    <td className="px-4 py-3 text-ink-muted whitespace-nowrap">
                      {dateStr}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {doc.file_url && (
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary text-ink dark:text-white"
                            title="Open / View Document"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {doc.file_url && (
                          <a
                            href={doc.file_url}
                            download={doc.file_name || 'document'}
                            className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary text-ink dark:text-white"
                            title="Download Document"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(doc, idx)}
                          className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-surface-secondary text-ink dark:text-white"
                          title="Edit Document Info"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(idx)}
                          className="p-1.5 rounded-lg border border-line dark:border-white/10 hover:bg-bad-soft text-bad"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-surface dark:bg-[#111111] border border-line dark:border-white/10 rounded-2xl shadow-2xl z-10 overflow-hidden animate-in fade-in duration-150">
            <div className="p-4 border-b border-line dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-sm text-ink dark:text-white">
                  {editingIndex !== null ? 'Edit Document Information' : 'Upload New Document'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-ink-muted hover:text-ink dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Master's in Physics Degree, CNIC Copy"
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs text-ink dark:text-white outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                  Document Category *
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#181818] text-xs text-ink dark:text-white outline-none focus:border-primary cursor-pointer font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                  File Attachment
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-xl border-2 border-dashed border-line dark:border-white/10 hover:border-primary/50 text-center cursor-pointer bg-surface-secondary/30 dark:bg-[#181818] transition-colors"
                >
                  <Paperclip className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-xs font-bold text-ink dark:text-white">
                    {selectedFile ? selectedFile.name : 'Click to select or change file'}
                  </p>
                  <p className="text-[10px] text-ink-muted mt-0.5">
                    Supports PDF, DOC, DOCX, PNG, JPG (Max 15MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-line dark:border-white/10 flex items-center justify-end gap-2 bg-surface-secondary/20">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-line dark:border-white/10 text-xs font-semibold text-ink-muted hover:bg-surface-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!docTitle.trim()}
                className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                {editingIndex !== null ? 'Save Changes' : 'Upload & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploadList;