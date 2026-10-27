import { useState, useRef } from 'react';
import { Upload, FileText, Trash2, ExternalLink, Plus, AlertCircle } from 'lucide-react';

const COMMON_DOC_TYPES = [
  'Highest Degree / Transcript',
  'Secondary School Certificate',
  'Teaching Certification (B.Ed / M.Ed)',
  'Experience Certificate',
  'Resume / CV',
  'CNIC / Identity Card Copy',
  'Appointment / Joining Letter',
  'Other Document'
];

const ProfileDocumentsCard = ({ documents = [], onChange }) => {
  const [selectedType, setSelectedType] = useState(COMMON_DOC_TYPES[0]);
  const [customTitle, setCustomTitle] = useState('');
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size must be less than 10MB');
      return;
    }
    setFileError('');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setFileData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!fileData) {
      setFileError('Please select a file to upload');
      return;
    }

    const title = selectedType === 'Other Document'
      ? (customTitle.trim() || 'Other Official Document')
      : selectedType;

    const newDoc = {
      title,
      file_name: fileName || `${title.replace(/\s+/g, '_')}`,
      file_url: fileData,
      uploaded_at: new Date().toISOString()
    };

    const updated = [newDoc, ...documents];
    onChange(updated);

    setFileData(null);
    setFileName('');
    setCustomTitle('');
    setSelectedType(COMMON_DOC_TYPES[0]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteDocument = (indexToRemove) => {
    const updated = documents.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleOpenDoc = (url) => {
    if (!url) return;
    if (url.startsWith('data:')) {
      const win = window.open();
      if (win) {
        if (url.startsWith('data:application/pdf')) {
          win.document.write(`<iframe src="${url}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`);
        } else {
          win.document.write(`<img src="${url}" style="max-width:100%; height:auto; margin:auto; display:block;" />`);
        }
      }
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-line dark:border-line-dark">
        <div>
          <h3 className="text-sm font-bold text-ink dark:text-ink-dark flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Official & Academic Documents
          </h3>
          <p className="text-[11px] text-ink-muted">
            Upload educational degrees, transcripts, experience certificates and professional credentials.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary w-fit">
          {documents.length} {documents.length === 1 ? 'Document' : 'Documents'}
        </span>
      </div>

      <div className="p-4 rounded-xl bg-surface-secondary/50 dark:bg-white/[0.02] border border-line dark:border-line-dark space-y-3">
        <span className="text-xs font-bold text-ink dark:text-ink-dark block">Upload New Document</span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
              Document Category
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark outline-none focus:border-primary font-medium"
            >
              {COMMON_DOC_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {selectedType === 'Other Document' && (
            <div>
              <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                Specify Document Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Workshop Certificate"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
              Select File (PDF, JPG, PNG)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                className="hidden"
                id="staff_doc_upload_input"
              />
              <label
                htmlFor="staff_doc_upload_input"
                className="flex-1 flex items-center justify-between px-3.5 py-2 text-xs rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary cursor-pointer transition-colors truncate"
              >
                <span className="truncate">{fileName || 'Choose file...'}</span>
                <Upload className="w-3.5 h-3.5 shrink-0 ml-2" />
              </label>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAddDocument}
              disabled={!fileData}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-primary text-white shadow-xs hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Attach Document</span>
            </button>
          </div>
        </div>

        {fileError && (
          <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{fileError}</span>
          </div>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-line dark:border-line-dark rounded-xl bg-surface-secondary/20 space-y-1">
          <FileText className="w-7 h-7 text-ink-muted mx-auto opacity-50" />
          <p className="text-xs font-medium text-ink-muted">No documents uploaded yet.</p>
          <p className="text-[11px] text-ink-muted/80">Select a document type and attach your file above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark flex items-start justify-between gap-3 shadow-xs hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-ink dark:text-ink-dark truncate" title={doc.title}>
                    {doc.title || 'Document'}
                  </p>
                  <p className="text-[11px] text-ink-muted truncate" title={doc.file_name}>
                    {doc.file_name || 'Attached file'}
                  </p>
                  <p className="text-[10px] text-ink-muted/70 mt-1">
                    {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString('en-GB') : 'Attached'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenDoc(doc.file_url)}
                  title="View / Download"
                  className="p-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteDocument(idx)}
                  title="Remove Document"
                  className="p-1.5 rounded-lg text-ink-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
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

export default ProfileDocumentsCard;
