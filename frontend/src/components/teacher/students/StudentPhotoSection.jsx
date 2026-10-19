import { Camera } from 'lucide-react';

const StudentPhotoSection = ({ photoUrl, studentName, onPhotoUpload }) => {
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onPhotoUpload(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl bg-surface-secondary/40 dark:bg-[#141419] border border-line dark:border-line-dark">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl shrink-0">
        {photoUrl ? (
          <img src={photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span>{studentName?.[0] || 'S'}</span>
        )}
        <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
          <Camera className="w-5 h-5" />
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>
      </div>
      <div>
        <h4 className="text-xs font-bold text-ink dark:text-ink-dark">Student Photograph</h4>
        <p className="text-[10px] text-ink-muted">Upload a clear passport-size photo (JPEG, PNG, or WebP).</p>
      </div>
    </div>
  );
};

export default StudentPhotoSection;
