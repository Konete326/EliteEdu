import { Image, FileText } from 'lucide-react';
import AvatarUploadField from '../../../common/AvatarUploadField';
import DocumentUploadList from '../../../common/DocumentUploadList';

const StudentDocumentsTab = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
          <Image className="w-4 h-4 text-primary" />
          <span>Student Photo & Media</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 rounded-xl bg-surface-secondary/30 dark:bg-[#141414]/30 border border-line dark:border-white/10">
          <AvatarUploadField
            value={formData.photo_url || ''}
            onChange={(val) => onChange('photo_url', val)}
            label="Upload / Crop Profile Photo (Optional)"
          />
          <div className="flex-1 space-y-2 text-xs">
            <h4 className="font-semibold text-ink dark:text-ink-dark text-sm">
              Official Identity Photo
            </h4>
            <p className="text-ink-sub dark:text-ink-sub-dark">
              Upload an official passport or portrait photo of the student. You can crop, resize, zoom, and rotate it using the interactive editor.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-medium text-xs">
              Direct upload & instant crop supported
            </div>
          </div>
        </div>
      </div>

      <DocumentUploadList
        documents={formData.documents || []}
        onChange={(docs) => onChange('documents', docs)}
        title="Student Certificates & Attached Documents (Optional)"
      />

      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
          <FileText className="w-4 h-4 text-primary" />
          <span>Administrative & Special Instructions</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            General Notes / Medical Conditions / Special Concessions (Optional)
          </label>
          <textarea
            rows="4"
            value={formData.notes || ''}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Add any medical remarks, special allowances, behavioral notes, or admin instructions here..."
            className="w-full px-3 py-2.5 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-xs text-ink dark:text-ink-dark focus:border-primary outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDocumentsTab;
