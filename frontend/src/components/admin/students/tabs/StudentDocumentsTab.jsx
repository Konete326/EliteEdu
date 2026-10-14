import { Image, FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';

const StudentDocumentsTab = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
          <Image className="w-4 h-4 text-primary" />
          <span>Student Photo & Media</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
                Student Profile Photo URL
              </label>
              <input
                type="url"
                value={formData.photo_url || ''}
                onChange={(e) => onChange('photo_url', e.target.value)}
                placeholder="https://example.com/photos/student.jpg"
                className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-xs text-ink dark:text-ink-dark focus:border-primary outline-none"
              />
              <p className="text-[11px] text-ink-muted mt-1">
                Provide a hosted direct image URL for the student&apos;s digital ID card and profile.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-line dark:border-white/10 bg-surface-secondary/30 dark:bg-[#141414]/30">
            {formData.photo_url ? (
              <img
                src={formData.photo_url}
                alt="Student Preview"
                className="w-24 h-24 rounded-2xl object-cover border border-line shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-surface-secondary flex flex-col items-center justify-center text-ink-muted text-xs border border-line dark:border-white/10">
                <Image className="w-8 h-8 mb-1 stroke-1" />
                <span>No Photo</span>
              </div>
            )}
            <span className="text-[10px] text-ink-muted mt-2 font-medium">Preview Thumbnail</span>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
          <FileText className="w-4 h-4 text-primary" />
          <span>Administrative & Special Instructions</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            General Notes / Medical Conditions / Special Concessions
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
