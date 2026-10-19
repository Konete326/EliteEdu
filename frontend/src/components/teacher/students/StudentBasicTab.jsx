import StudentPhotoSection from './StudentPhotoSection';
import StudentEnrollmentFields from './StudentEnrollmentFields';

const StudentBasicTab = ({ data, onChange, grades = [] }) => {
  return (
    <div className="space-y-4">
      <StudentPhotoSection
        photoUrl={data.photo_url}
        studentName={data.name}
        onPhotoUpload={(photo) => onChange('photo_url', photo)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            Full Name <span className="text-bad">*</span>
          </label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Student Name"
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            Father Name <span className="text-bad">*</span>
          </label>
          <input
            type="text"
            value={data.father_name || ''}
            onChange={(e) => onChange('father_name', e.target.value)}
            placeholder="Father Name"
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            GR / Roll Number
          </label>
          <input
            type="text"
            value={data.gr_number || ''}
            onChange={(e) => onChange('gr_number', e.target.value)}
            placeholder="Auto-generated if blank"
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            Enrolled Grade / Class
          </label>
          <select
            value={data.current_grade?._id || data.current_grade || ''}
            onChange={(e) => onChange('current_grade', e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          >
            <option value="">Select Grade</option>
            {grades.map((g) => (
              <option key={g._id} value={g._id}>{g.name}</option>
            ))}
          </select>
        </div>

        <StudentEnrollmentFields data={data} onChange={onChange} />
      </div>
    </div>
  );
};

export default StudentBasicTab;
