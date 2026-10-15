import { useRef } from 'react';
import { Upload, FileText, Trash2, ExternalLink } from 'lucide-react';
import DocumentUploadList from '../../../common/DocumentUploadList';

const ApplicantDocumentsTab = ({ formData, onChange }) => {
  const resumeInputRef = useRef(null);

  const handleResumeFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange('resume_url', ev.target.result);
      onChange('resume_name', file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
            <FileText className="w-4 h-4 text-primary" />
            <span>Resume / Curriculum Vitae</span>
          </div>
          {formData.resume_url && (
            <span className="text-xs text-good font-semibold">Uploaded</span>
          )}
        </div>

        <input
          type="file"
          ref={resumeInputRef}
          onChange={handleResumeFile}
          accept=".pdf,.doc,.docx,image/*"
          className="hidden"
        />

        {!formData.resume_url ? (
          <div
            onClick={() => resumeInputRef.current?.click()}
            className="border-2 border-dashed border-line dark:border-white/10 hover:border-primary/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-surface-secondary/20 hover:bg-primary-soft/10 group"
          >
            <Upload className="w-8 h-8 mx-auto text-ink-muted group-hover:text-primary transition-colors mb-2" />
            <p className="text-xs font-semibold text-ink dark:text-ink-dark">
              Click to select or upload resume (PDF, DOCX, Images)
            </p>
            <p className="text-[11px] text-ink-muted mt-1">Direct file upload</p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-5 h-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink dark:text-ink-dark truncate">
                  {formData.resume_name || 'Uploaded Resume / CV'}
                </p>
                <p className="text-[10px] text-ink-muted">Ready for review</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={formData.resume_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  onChange('resume_url', '');
                  onChange('resume_name', '');
                }}
                className="p-1.5 rounded-lg text-bad hover:bg-bad-soft"
                title="Remove Resume"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <DocumentUploadList
        documents={formData.documents || []}
        onChange={(newDocs) => onChange('documents', newDocs)}
        title="Educational Certificates & Experience Letters"
      />
    </div>
  );
};

export default ApplicantDocumentsTab;
